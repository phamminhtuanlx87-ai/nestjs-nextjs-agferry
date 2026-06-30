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
import {
  ChiTietSanLuong,
  MA_GIA_VE,
  MAPPING_NHOM_VE,
} from './dto/chi_tiet_doanh_thu';

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
    const mangChiTietCapNhat: ChiTietSanLuong[] = [];

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
      const tongDoanhThuDongXe = Math.round(xe.so_luot_xe * giaVeApDung);
      const cauHinhNhom = MAPPING_NHOM_VE[
        xe.ma_loai_ve as keyof typeof MA_GIA_VE
      ] || {
        nhom_cha: 'HANH_KHACH',
        nhom_con: 'HANH_KHACH',
      };
      mangChiTietCapNhat.push({
        ma_loai_ve: xe.ma_loai_ve,
        so_luot_xe: xe.so_luot_xe,
        gia_ve_ap_dung: giaVeApDung,
        tong_doanh_thu: tongDoanhThuDongXe,
        nhom_cha: cauHinhNhom.nhom_cha,
        nhom_con: cauHinhNhom.nhom_con,
      });
    }

    console.log(mangChiTietCapNhat);
    // Tự động sinh chuỗi YYYY-MM làm báo cáo
    const thangNam = `${ngayNhapDate.getFullYear()}-${String(ngayNhapDate.getMonth() + 1).padStart(2, '0')}`;
    const dt_theo_ve = mangChiTietCapNhat
      // 1. Lọc lấy các dòng thuộc nhóm cha cần tính tổng
      .filter((e) =>
        ['HANH_KHACH', 'XE_CAC_LOAI', 'THUE_BAO'].includes(e.nhom_cha),
      )
      // 2. Cộng dồn trường tong_doanh_thu (bắt đầu từ số 0)
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const doanhThuTheoVe = {
      dtt_ve: 0,
      dt_theo_ve: dt_theo_ve,
      bhhk: 0,
      bhhk_thanh_tien: 0,
      vat: 0,
      vat_thanh_tien: 0,
    };

    const dt_theo_ve_thang = mangChiTietCapNhat
      // 1. Lọc lấy các dòng thuộc nhóm cha cần tính tổng
      .filter((e) => ['VE_THANG'].includes(e.nhom_cha))
      // 2. Cộng dồn trường tong_doanh_thu (bắt đầu từ số 0)
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const doanhThuTheoVeThang = {
      dtt_ve: 0,
      dt_theo_ve: dt_theo_ve_thang,
      vat: 0,
      vat_thanh_tien: 0,
    };

    const dt_theo_ve_qui = mangChiTietCapNhat
      // 1. Lọc lấy các dòng thuộc nhóm cha cần tính tổng
      .filter((e) => ['VE_QUI'].includes(e.nhom_cha))
      // 2. Cộng dồn trường tong_doanh_thu (bắt đầu từ số 0)
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const doanhThuTheoVeQui = {
      dtt_ve: 0,
      dt_theo_ve: dt_theo_ve_qui,
      vat: 0,
      vat_thanh_tien: 0,
    };

    const dt_theo_ve_nam = mangChiTietCapNhat
      // 1. Lọc lấy các dòng thuộc nhóm cha cần tính tổng
      .filter((e) => ['VE_NAM'].includes(e.nhom_cha))
      // 2. Cộng dồn trường tong_doanh_thu (bắt đầu từ số 0)
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const doanhThuTheoVeNam = {
      dtt_ve: 0,
      dt_theo_ve: dt_theo_ve_nam,
      vat: 0,
      vat_thanh_tien: 0,
    };
    const doanhThuKhac = 0;
    const doanhThuHDTaiChinh = 0;
    // Tiến hành nạp dữ liệu sạch vào Database
    const loaiDuLieu = 'THUC_HIEN';
    const newRecord = new this.sanLuongModel({
      ...dto,
      ngay_nhap: ngayNhapDate,
      thang_nam: thangNam,
      chi_tiet_san_luong: mangChiTietCapNhat,
      nguoi_nhap: userId,
      doanh_thu_theo_ve: doanhThuTheoVe,
      doanh_thu_ve_thang: doanhThuTheoVeThang,
      doanh_thu_ve_qui: doanhThuTheoVeQui,
      doanh_thu_ve_nam: doanhThuTheoVeNam,
      doanh_thu_khac: doanhThuKhac,
      doanh_thu_hd_tai_chinh: doanhThuHDTaiChinh,
      loai_du_lieu: loaiDuLieu,
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

    let mangChiTietSanLuong = banGhiCu.chi_tiet_san_luong;

    // Nếu sửa cả mảng danh sách sản lượng, tính toán lại giá tiền y như hàm create
    if (dto.chi_tiet_san_luong && dto.chi_tiet_san_luong.length > 0) {
      mangChiTietSanLuong = [];
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

        mangChiTietSanLuong.push({
          ma_loai_ve: xe.ma_loai_ve,
          so_luot_xe: xe.so_luot_xe,
          gia_ve_ap_dung: giaCuaBen.gia_ve,
          tong_doanh_thu: Math.round(xe.so_luot_xe * giaCuaBen.gia_ve),
          nhom_cha: xe.nhom_cha,
          nhom_con: xe.nhom_cha,
        });
      }
    }

    const thangNam = `${ngayNhapChuẩn.getFullYear()}-${String(ngayNhapChuẩn.getMonth() + 1).padStart(2, '0')}`;

    const dataUpdate = {
      ...dto,
      ngay_nhap: ngayNhapChuẩn,
      thang_nam: thangNam,
      chi_tiet_san_luong: mangChiTietSanLuong,
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
