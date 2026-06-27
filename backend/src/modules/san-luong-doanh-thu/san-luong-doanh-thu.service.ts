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

/**
 * Mốc thời gian bắt đầu triển khai hệ thống chạy thật (Nhập theo ngày).
 * Định dạng chuẩn: YYYY-MM-DD
 */
export const START_DATE_REALTIME = '2026-08-01';

/**
 * Ngày quy ước cố định dành cho dữ liệu lịch sử (Nhập theo tháng).
 */
export const LEGACY_DAY_SNAPSHOT = '20';

@Injectable()
export class SanLuongDoanhThuService {
  const;

  constructor(
    @InjectModel(SanLuongDoanhThu.name)
    private readonly sanLuongModel: Model<SanLuongDoanhThuDocument>,

    @InjectModel(DanhMucGiaVe.name)
    private readonly danhMucGiaVeModel: Model<DanhMucGiaVeDocument>,
  ) {}

  async create(dto: CreateSanLuongDoanhThuDto, userId: string) {
    // 🛡️ Tuyến phòng thủ cuối cùng: Đồng bộ mốc START_DATE 01/08/2026
    const targetDate = new Date(`${dto.ngay_nhap}T12:00:00.000Z`);
    const fenceDate = new Date(`${START_DATE_REALTIME}T12:00:00.000Z`);

    if (targetDate < fenceDate) {
      const thangNamCat = dto.ngay_nhap.substring(0, 7); // Cắt lấy "YYYY-MM"
      dto.ngay_nhap = `${thangNamCat}-${LEGACY_DAY_SNAPSHOT}`; // Ép về ngày quy ước tổng
    }

    const ngayNhapDate = new Date(dto.ngay_nhap);

    // 🛑 PHÒNG TUYẾN 1: Chống nhập trùng dữ liệu (Gõ nhầm/Click đúp)
    const trungSoLieu = await this.sanLuongModel
      .findOne({
        ma_ben: dto.ma_ben,
        ngay_nhap: ngayNhapDate,
        ma_loai_ve: dto.ma_loai_ve,
      })
      .exec();

    if (trungSoLieu) {
      throw new ConflictException(
        `Số liệu của loại vé [${dto.ma_loai_ve}] tại bến ${dto.ma_ben} ngày ${dto.ngay_nhap} đã được nạp trước đó rồi!`,
      );
    }

    // 🛑 PHÒNG TUYẾN 2: Kiểm tra loại vé có tồn tại hợp pháp không
    const danhMucVe = await this.danhMucGiaVeModel
      .findOne({
        ma_loai_ve: dto.ma_loai_ve,
        kich_hoat: true,
      })
      .exec();

    if (!danhMucVe) {
      throw new BadRequestException(
        `Loại vé mã [${dto.ma_loai_ve}] không tồn tại hoặc đang bị ẩn khỏi hệ thống!`,
      );
    }

    // 🛑 PHÒNG TUYẾN 3: Thuật toán mò mảng lồng nhau lấy Đơn giá áp dụng theo Ngày
    // Lọc lấy danh sách các mức giá có ngày_áp_dụng nhỏ hơn hoặc bằng ngày_nhập
    const lichSuPhuHop = danhMucVe.lich_su_gia
      .filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapDate)
      // Sắp xếp ngày giảm dần để ông mới nhất nhảy lên đầu mảng
      .sort(
        (a, b) =>
          new Date(b.ngay_ap_dung).getTime() -
          new Date(a.ngay_ap_dung).getTime(),
      )[0];

    if (!lichSuPhuHop) {
      throw new BadRequestException(
        `Loại vé này chưa được cấu hình biểu giá cho thời điểm ngày ${dto.ngay_nhap}!`,
      );
    }

    // Tìm giá riêng cho bến của anh (Ví dụ: 'TC', 'VC'...). Nếu bến đó dùng giá chung thì bốc cấu hình 'CHUNG'
    const giaCuaBen =
      lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === dto.ma_ben) ||
      lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === 'CHUNG');

    if (!giaCuaBen) {
      throw new BadRequestException(
        `Không tìm thấy đơn giá áp dụng cho bến ${dto.ma_ben} trong biểu giá!`,
      );
    }

    const giaVeApDung = giaCuaBen.gia_ve;

    // 🧮 PHÒNG TUYẾN 4: Đóng băng Snapshot dữ liệu tài chính
    const tongDoanhThu = dto.san_luong * giaVeApDung; // Tự nhân tiền, không tin tưởng Frontend

    // Tự động đẻ chuỗi YYYY-MM phục vụ Index làm báo cáo thần tốc
    const thangNam = `${ngayNhapDate.getFullYear()}-${String(ngayNhapDate.getMonth() + 1).padStart(2, '0')}`;

    // Lưu xuống DB kèm thông tin người nhập (Sau này truyền userId từ JWT Token vào)
    const newRecord = new this.sanLuongModel({
      ...dto,
      ngay_nhap: ngayNhapDate,
      thang_nam: thangNam,
      gia_ve_ap_dung: giaVeApDung,
      tong_doanh_thu: tongDoanhThu,
      created_by: userId, // Lưu vết ai là người gõ số liệu này vào máy
    });

    return await newRecord.save();
  }

  findAll() {
    return `This action returns all sanLuongDoanhThu`;
  }

  findOne(id: string) {
    return `This action returns a #${id} sanLuongDoanhThu`;
  }

  async update(id: string, dto: UpdateSanLuongDoanhThuDto, userId: string) {
    if (dto.ngay_nhap) {
      const targetDate = new Date(`${dto.ngay_nhap}T12:00:00.000Z`);
      const fenceDate = new Date(`${START_DATE_REALTIME}T12:00:00.000Z`);

      if (targetDate < fenceDate) {
        const thangNamCat = dto.ngay_nhap.substring(0, 7);
        dto.ngay_nhap = `${thangNamCat}-${LEGACY_DAY_SNAPSHOT}`;
      }
    }

    const banGhiCu = await this.sanLuongModel.findById(id).exec();
    if (!banGhiCu) {
      throw new BadRequestException(
        'Không tìm thấy bản ghi sản lượng cần chỉnh sửa!',
      );
    }

    // 📦 BẬC THẦY BỌC LÓT: Nếu Frontend không gửi, lấy lại giá trị cũ của DB
    const maBen = dto.ma_ben || banGhiCu.ma_ben;
    const maLoaiVe = dto.ma_loai_ve || banGhiCu.ma_loai_ve;
    const sanLuong =
      dto.san_luong !== undefined ? dto.san_luong : banGhiCu.san_luong;

    let ngayNhapDate = banGhiCu.ngay_nhap;
    if (dto.ngay_nhap) {
      ngayNhapDate = new Date(`${dto.ngay_nhap}T12:00:00.000Z`); // Chống lệch múi giờ UTC
    }

    // 🛑 PHÒNG TUYẾN 1: CHECK TRÙNG (NÉ BẢN GHI HIỆN TẠI RA)
    const trungSoLieu = await this.sanLuongModel
      .findOne({
        _id: { $ne: id },
        ma_ben: maBen,
        ngay_nhap: ngayNhapDate,
        ma_loai_ve: maLoaiVe,
      })
      .exec();

    if (trungSoLieu) {
      throw new ConflictException(
        `Số liệu của loại vé này tại bến ${maBen} vào ngày đó đã tồn tại ở một bản ghi khác rồi!`,
      );
    }

    // 🛑 PHÒNG TUYẾN 2: Kiểm tra loại vé (Sửa lại: Dùng biến maLoaiVe)
    const danhMucVe = await this.danhMucGiaVeModel
      .findOne({
        ma_loai_ve: maLoaiVe, // ✨ ĐÃ SỬA: Thay cho dto.ma_loai_ve
        kich_hoat: true,
      })
      .exec();

    if (!danhMucVe) {
      throw new BadRequestException(
        `Loại vé mã [${maLoaiVe}] không tồn tại hoặc đang bị ẩn khỏi hệ thống!`,
      );
    }

    // 🛑 PHÒNG TUYẾN 3: Thuật toán săn đơn giá theo ngày
    const lichSuPhuHop = danhMucVe.lich_su_gia
      .filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapDate)
      .sort(
        (a, b) =>
          new Date(b.ngay_ap_dung).getTime() -
          new Date(a.ngay_ap_dung).getTime(),
      )[0];

    if (!lichSuPhuHop) {
      throw new BadRequestException(
        `Loại vé này chưa được cấu hình biểu giá cho thời điểm này!`,
      );
    }

    // Sửa lại: Dùng biến maBen thay cho dto.ma_ben để không bị lỗi khi sửa một phần
    const giaCuaBen =
      lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === maBen) || // ✨ ĐÃ SỬA
      lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === 'CHUNG');

    if (!giaCuaBen) {
      throw new BadRequestException(
        `Không tìm thấy đơn giá áp dụng cho bến ${maBen} trong biểu giá!`,
      );
    }

    const giaVeApDung = giaCuaBen.gia_ve;

    // 🧮 PHÒNG TUYẾN 4: Tính lại doanh thu tự động chuẩn đét
    const tongDoanhThu = sanLuong * giaVeApDung;

    const thangNam = `${ngayNhapDate.getFullYear()}-${String(ngayNhapDate.getMonth() + 1).padStart(2, '0')}`;

    const dataCapNhat = {
      ...dto,
      ma_ben: maBen, // Đảm bảo dữ liệu luôn đầy đủ khi ghi đè
      ma_loai_ve: maLoaiVe, // Đảm bảo dữ liệu luôn đầy đủ khi ghi đè
      ngay_nhap: ngayNhapDate,
      thang_nam: thangNam,
      gia_ve_ap_dung: giaVeApDung,
      tong_doanh_thu: tongDoanhThu,
      updated_by: userId,
    };

    return await this.sanLuongModel
      .findByIdAndUpdate(id, { $set: dataCapNhat }, { new: true })
      .exec();
  }

  remove(id: string) {
    return `This action removes a #${id} sanLuongDoanhThu`;
  }
}
