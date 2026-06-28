import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateSanLuongDoanhThuDto } from './dto/create-san-luong-doanh-thu.dto';
import { UpdateSanLuongDoanhThuDto } from './dto/update-san-luong-doanh-thu.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  SanLuongDoanhThu,
  SanLuongDoanhThuDocument,
} from './entities/san-luong-doanh-thu.entity';
import { Model } from 'mongoose';
import {
  DanhMucGiaVe,
  DanhMucGiaVeDocument,
} from '../danh-muc-gia-ve/entities/danh-muc-gia-ve.entity';

export const START_DATE_REALTIME = '2026-08-01';
export const LEGACY_DAY_SNAPSHOT = '20';

@Injectable()
export class SanLuongDoanhThuService {
  constructor(
    @InjectModel(SanLuongDoanhThu.name)
    private readonly sanLuongModel: Model<SanLuongDoanhThuDocument>,

    @InjectModel(DanhMucGiaVe.name)
    private readonly danhMucGiaVeModel: Model<DanhMucGiaVeDocument>,
  ) {}

  async create(dto: CreateSanLuongDoanhThuDto, userId: string) {
    // 🛡️ Tuyến phòng thủ 1: Xử lý múi giờ và đồng bộ dữ liệu lịch sử
    if (dto.ngay_nhap) {
      const targetDate = new Date(`${dto.ngay_nhap}T12:00:00.000Z`);
      const fenceDate = new Date(`${START_DATE_REALTIME}T12:00:00.000Z`);

      if (targetDate < fenceDate) {
        const thangNamCat = dto.ngay_nhap.substring(0, 7);
        dto.ngay_nhap = `${thangNamCat}-${LEGACY_DAY_SNAPSHOT}`;
      }
    }

    const ngayNhapDate = new Date(`${dto.ngay_nhap}T12:00:00.000Z`);

    // 🛑 PHÒNG TUYẾN 2: Chống trùng phiên (Mỗi bến trong 1 ngày chỉ có 1 document tổng)
    const trungPhien = await this.sanLuongModel
      .findOne({
        ma_ben: dto.ma_ben,
        ngay_nhap: ngayNhapDate,
      })
      .exec();

    if (trungPhien) {
      throw new ConflictException(
        `Báo cáo sản lượng của bến [${dto.ma_ben}] ngày ${dto.ngay_nhap} đã được nạp trước đó rồi! Hãy dùng tính năng chỉnh sửa.`,
      );
    }

    // 🛑 PHÒNG TUYẾN 3: Thuật toán tự động tra cứu biểu giá & nhân tiền cho từng dòng xe
    const mangChiTietCậpNhật: any[] = [];

    for (const xe of dto.chi_tiet_san_luong) {
      // Tìm danh mục giá của loại xe này
      const danhMucVe = await this.danhMucGiaVeModel
        .findOne({ ma_loai_ve: xe.ma_loai_ve, kich_hoat: true })
        .exec();

      if (!danhMucVe) {
        throw new BadRequestException(
          `Loại xe mã [${xe.ma_loai_ve}] không tồn tại hoặc đã bị ẩn khỏi hệ thống!`,
        );
      }

      // Săn tìm mức giá phù hợp với ngày nhập (Lấy ông mới nhất nhỏ hơn hoặc bằng ngày nhập)
      const lichSuPhuHop = danhMucVe.lich_su_gia
        .filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapDate)
        .sort(
          (a, b) =>
            new Date(b.ngay_ap_dung).getTime() -
            new Date(a.ngay_ap_dung).getTime(),
        )[0];

      if (!lichSuPhuHop) {
        throw new BadRequestException(
          `Loại xe [${xe.ma_loai_ve}] chưa cấu hình biểu giá cho ngày ${dto.ngay_nhap}!`,
        );
      }

      // Lấy giá theo bến hoặc giá CHUNG
      const giaCuaBen =
        lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === dto.ma_ben) ||
        lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === 'CHUNG');

      if (!giaCuaBen) {
        throw new BadRequestException(
          `Không tìm thấy đơn giá cho bến ${dto.ma_ben} của loại xe [${xe.ma_loai_ve}]!`,
        );
      }

      // Chốt cứng đơn giá và nhân tổng doanh thu dòng xe (Không tin Frontend gửi lên)
      const giaVeApDung = giaCuaBen.gia_ve;
      const tongDoanhThuDòngXe = Math.round(xe.so_luot_xe * giaVeApDung);

      mangChiTietCậpNhật.push({
        ma_loai_ve: xe.ma_loai_ve,
        so_luot_xe: xe.so_luot_xe,
        gia_ve_ap_dung: giaVeApDung,
        tong_doanh_thu: tongDoanhThuDòngXe,
      });
    }

    // Tự động sinh chuỗi YYYY-MM làm báo cáo
    const thangNam = `${ngayNhapDate.getFullYear()}-${String(ngayNhapDate.getMonth() + 1).padStart(2, '0')}`;

    // Tiến hành nạp dữ liệu sạch vào Database
    const newRecord = new this.sanLuongModel({
      ...dto,
      ngay_nhap: ngayNhapDate,
      thang_nam: thangNam,
      chi_tiet_san_luong: mangChiTietCậpNhật,
      nguoi_nhap: userId,
    });

    return await newRecord.save();
  }

  findAll() {
    return this.sanLuongModel.find().sort({ ngay_nhap: -1 }).exec();
  }

  findOne(id: string) {
    return this.sanLuongModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateSanLuongDoanhThuDto, userId: string) {
    const banGhiCu = await this.sanLuongModel.findById(id).exec();
    if (!banGhiCu) {
      throw new BadRequestException(
        'Không tìm thấy bản ghi sản lượng cần chỉnh sửa!',
      );
    }

    // Tận dụng dữ liệu cũ nếu Frontend không truyền lên đủ
    let ngayNhapChuẩn = banGhiCu.ngay_nhap;
    if (dto.ngay_nhap) {
      const targetDate = new Date(`${dto.ngay_nhap}T12:00:00.000Z`);
      const fenceDate = new Date(`${START_DATE_REALTIME}T12:00:00.000Z`);

      if (targetDate < fenceDate) {
        const thangNamCat = dto.ngay_nhap.substring(0, 7);
        dto.ngay_nhap = `${thangNamCat}-${LEGACY_DAY_SNAPSHOT}`;
      }
      ngayNhapChuẩn = new Date(`${dto.ngay_nhap}T12:00:00.000Z`);
    }

    const maBenMới = dto.ma_ben || banGhiCu.ma_ben;

    // Kiểm tra trùng lịch với phiên ngày khác (trừ chính nó)
    const trungLich = await this.sanLuongModel
      .findOne({
        _id: { $ne: id },
        ma_ben: maBenMới,
        ngay_nhap: ngayNhapChuẩn,
      })
      .exec();

    if (trungLich) {
      throw new ConflictException(
        `Số liệu bến ${maBenMới} ngày ${ngayNhapChuẩn.toISOString().split('T')[0]} trùng với một phiên khác rồi!`,
      );
    }

    let mangChiTietCậpNhật = banGhiCu.chi_tiet_san_luong;

    // Nếu sửa cả mảng danh sách sản lượng, tính toán lại giá tiền y như hàm create
    if (dto.chi_tiet_san_luong && dto.chi_tiet_san_luong.length > 0) {
      mangChiTietCậpNhật = [];
      for (const xe of dto.chi_tiet_san_luong) {
        const danhMucVe = await this.danhMucGiaVeModel
          .findOne({ ma_loai_ve: xe.ma_loai_ve, kich_hoat: true })
          .exec();

        if (!danhMucVe) continue;

        const lichSuPhuHop = danhMucVe.lich_su_gia
          .filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapChuẩn)
          .sort(
            (a, b) =>
              new Date(b.ngay_ap_dung).getTime() -
              new Date(a.ngay_ap_dung).getTime(),
          )[0];

        if (!lichSuPhuHop) continue;

        const giaCuaBen =
          lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === maBenMới) ||
          lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === 'CHUNG');

        if (!giaCuaBen) continue;

        mangChiTietCậpNhật.push({
          ma_loai_ve: xe.ma_loai_ve,
          so_luot_xe: xe.so_luot_xe,
          gia_ve_ap_dung: giaCuaBen.gia_ve,
          tong_doanh_thu: Math.round(xe.so_luot_xe * giaCuaBen.gia_ve),
        });
      }
    }

    const thangNam = `${ngayNhapChuẩn.getFullYear()}-${String(ngayNhapChuẩn.getMonth() + 1).padStart(2, '0')}`;

    const dataUpdate = {
      ...dto,
      ngay_nhap: ngayNhapChuẩn,
      thang_nam: thangNam,
      chi_tiet_san_luong: mangChiTietCậpNhật,
      updated_by: userId,
    };

    return await this.sanLuongModel
      .findByIdAndUpdate(id, { $set: dataUpdate }, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.sanLuongModel.findByIdAndDelete(id).exec();
  }
}
