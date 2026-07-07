import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
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
import dayjs from 'dayjs';
import { GetSanLuongDto } from './dto/get-san-luong-doanh-thi.dto';

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
      const lichSuBHHK = danhMucVe.lich_su_bhhk
        .filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapDate)
        .sort(
          (a, b) =>
            new Date(b.ngay_ap_dung).getTime() -
            new Date(a.ngay_ap_dung).getTime(),
        )[0];

      const bhhkDonGia = lichSuBHHK ? lichSuBHHK.gia_bhhk : 0;
      const bhhkThanhTien = Math.round(xe.so_luot_xe * bhhkDonGia);

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
        bhhk_don_gia: bhhkDonGia,
        bhhk_thanh_tien: bhhkThanhTien,
        nhom_cha: cauHinhNhom.nhom_cha,
        nhom_con: cauHinhNhom.nhom_con,
      });
    }
    //hết voòng for
    // Tự động sinh chuỗi YYYY-MM làm báo cáo
    const thangNam = `${ngayNhapDate.getFullYear()}-${String(ngayNhapDate.getMonth() + 1).padStart(2, '0')}`;
    // --- 1. KHỐI DOANH THU THEO VÉ (VÉ LƯỢT) ---
    const dt_theo_ve = mangChiTietCapNhat
      .filter((e) =>
        ['HANH_KHACH', 'XE_CAC_LOAI', 'THUE_BAO'].includes(e.nhom_cha),
      )
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    // Tính tổng tiền bảo hiểm hành khách của nhóm vé lượt
    const bhhk_thanh_tien = mangChiTietCapNhat
      .filter((e) =>
        ['HANH_KHACH', 'XE_CAC_LOAI', 'THUE_BAO'].includes(e.nhom_cha),
      )
      .reduce((total, e) => total + (e.bhhk_thanh_tien || 0), 0);

    // Thuế suất lấy từ FE gửi lên, mặc định là 8 nếu rỗng
    const vat_ve_luot = dto.doanh_thu_theo_ve?.vat ?? 8;
    const vat_thanh_tien_luot =
      ((dt_theo_ve - bhhk_thanh_tien) / (1 + vat_ve_luot / 100)) *
      (vat_ve_luot / 100);
    const dtt_ve_luot = dt_theo_ve - bhhk_thanh_tien - vat_thanh_tien_luot;
    const doanhThuTheoVe = {
      dtt_ve: dtt_ve_luot,
      dt_theo_ve: dt_theo_ve,
      bhhk_thanh_tien: bhhk_thanh_tien,
      vat: vat_ve_luot,
      vat_thanh_tien: vat_thanh_tien_luot,
    };
    //------------------------------------
    //Ve qui
    const dt_theo_ve_thang = mangChiTietCapNhat
      // 1. Lọc lấy các dòng thuộc nhóm cha cần tính tổng
      .filter((e) => ['VE_THANG'].includes(e.nhom_cha))
      // 2. Cộng dồn trường tong_doanh_thu (bắt đầu từ số 0)
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);
    const vat_ve_thang = dto.doanh_thu_ve_thang?.vat ?? 8;

    const vat_thanh_tien_ve_thang = Math.round(
      (dt_theo_ve_thang / (1 + vat_ve_thang / 100)) * (vat_ve_thang / 100),
    );
    const dtt_ve_thang = dt_theo_ve_thang - vat_thanh_tien_ve_thang;
    const doanhThuTheoVeThang = {
      dtt_ve: dtt_ve_thang,
      dt_theo_ve: dt_theo_ve_thang,
      vat: vat_ve_thang,
      vat_thanh_tien: vat_thanh_tien_ve_thang,
    };

    //------------------------------------
    //Ve qui
    const dt_theo_ve_qui = mangChiTietCapNhat
      // 1. Lọc lấy các dòng thuộc nhóm cha cần tính tổng
      .filter((e) => ['VE_QUI'].includes(e.nhom_cha))
      // 2. Cộng dồn trường tong_doanh_thu (bắt đầu từ số 0)
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const vat_ve_qui = dto.doanh_thu_ve_thang?.vat ?? 8;

    const vat_thanh_tien_ve_qui = Math.round(
      (dt_theo_ve_qui / (1 + vat_ve_qui / 100)) * (vat_ve_qui / 100),
    );
    const dtt_ve_qui = dt_theo_ve_qui - vat_thanh_tien_ve_qui;
    const doanhThuTheoVeQui = {
      dtt_ve: dtt_ve_qui,
      dt_theo_ve: dt_theo_ve_qui,
      vat: vat_ve_qui,
      vat_thanh_tien: vat_thanh_tien_ve_qui,
    };
    //------------------------------------
    //Ve Nam
    const dt_theo_ve_nam = mangChiTietCapNhat
      // 1. Lọc lấy các dòng thuộc nhóm cha cần tính tổng
      .filter((e) => ['VE_NAM'].includes(e.nhom_cha))
      // 2. Cộng dồn trường tong_doanh_thu (bắt đầu từ số 0)
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const vat_ve_nam = dto.doanh_thu_ve_thang?.vat ?? 8;

    const vat_thanh_tien_ve_nam = Math.round(
      (dt_theo_ve_nam / (1 + vat_ve_nam / 100)) * (vat_ve_nam / 100),
    );
    const dtt_ve_nam = dt_theo_ve_nam - vat_thanh_tien_ve_nam;
    const doanhThuTheoVeNam = {
      dtt_ve: dtt_ve_nam,
      dt_theo_ve: dt_theo_ve_nam,
      vat: vat_ve_nam,
      vat_thanh_tien: vat_thanh_tien_ve_nam,
    };

    const doanhThuKhac = dto.doanh_thu_khac ?? 0;
    const doanhThuHDTaiChinh = dto.doanh_thu_hd_tai_chinh ?? 0;
    const doanh_thu_thuan_tong_cong = Math.round(
      dtt_ve_luot + dtt_ve_thang + dtt_ve_qui + dtt_ve_nam + doanhThuHDTaiChinh,
    );
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
      doanh_thu_thuan_tong_cong: doanh_thu_thuan_tong_cong,
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
    // 1.1 Tìm bản ghi cũ trong DB bằng ID để lấy dữ liệu đối chiếu
    const banGhiCu = await this.sanLuongModel.findById(id).exec();
    if (!banGhiCu) {
      throw new NotFoundException(
        `Không tìm thấy dữ liệu sản lượng với ID: ${id}`,
      );
    }

    // =========================================================
    // BƯỚC 2: KIỂM TRA NỘI DUNG THAY ĐỔI (TRIỆT TIÊU LƯU THỪA)
    // =========================================================

    // 2.1 Lấy các giá trị doanh thu phụ từ DTO gửi lên (nếu không truyền thì giữ nguyên giá trị cũ trong DB)
    const doanhThuKhacMoi = dto.doanh_thu_khac ?? banGhiCu.doanh_thu_khac;
    const doanhThuTaiChinhMoi =
      dto.doanh_thu_hd_tai_chinh ?? banGhiCu.doanh_thu_hd_tai_chinh;
    const loaiDuLieuMoi =
      dto.loai_du_lieu || banGhiCu.loai_du_lieu || 'THUC_HIEN';

    // 2.2 Trích xuất mảng xe (Chỉ lấy mã xe và số lượt xe) để so sánh kết cấu gõ nhập
    const stringXeCu = JSON.stringify(
      banGhiCu.chi_tiet_san_luong.map((x) => ({
        ma_loai_ve: x.ma_loai_ve,
        so_luot_xe: x.so_luot_xe,
      })),
    );

    const stringXeMoi = dto.chi_tiet_san_luong
      ? JSON.stringify(
          dto.chi_tiet_san_luong.map((x) => ({
            ma_loai_ve: x.ma_loai_ve,
            so_luot_xe: x.so_luot_xe,
          })),
        )
      : stringXeCu;

    // 2.3 🌟 SO SÁNH TỔNG THỂ: Nếu số liệu xe và các khoản doanh thu giống hệt cũ -> Trả về kết quả luôn, không tính toán lại
    if (
      doanhThuKhacMoi === banGhiCu.doanh_thu_khac &&
      doanhThuTaiChinhMoi === banGhiCu.doanh_thu_hd_tai_chinh &&
      loaiDuLieuMoi === banGhiCu.loai_du_lieu &&
      stringXeCu === stringXeMoi
    ) {
      return banGhiCu; // Bẻ luồng sớm, Server không tốn 1 chút CPU nào để chạy tiếp xuống dưới
    }

    // 3.1 Cố định Ngày nhập và Mã bến từ bản ghi gốc trong DB (Bỏ qua DTO gửi lên)
    const ngayNhapGoc = banGhiCu.ngay_nhap;
    const maBenGoc = banGhiCu.ma_ben;

    const mangChiTietCapNhat: ChiTietSanLuong[] = [];

    // 3.2 Kiểm tra xem Frontend có truyền mảng sản lượng xe mới lên không
    if (dto.chi_tiet_san_luong && dto.chi_tiet_san_luong.length > 0) {
      for (const xe of dto.chi_tiet_san_luong) {
        // Tìm cấu hình loại vé trong danh mục
        const danhMucVe = await this.danhMucGiaVeModel
          .findOne({ ma_loai_ve: xe.ma_loai_ve, kich_hoat: true })
          .exec();

        if (!danhMucVe) {
          throw new BadRequestException(
            `Mã loại xe [${xe.ma_loai_ve}] không tồn tại trên hệ thống!`,
          );
        }

        // 🌟 Tối ưu: Dùng ngayNhapGoc của DB để quét tìm biểu giá lịch sử phù hợp
        const lichSuPhuHop = danhMucVe.lich_su_gia
          .filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapGoc)
          .sort(
            (a, b) =>
              new Date(b.ngay_ap_dung).getTime() -
              new Date(a.ngay_ap_dung).getTime(),
          )[0];

        if (!lichSuPhuHop) {
          throw new BadRequestException(
            `Loại xe [${xe.ma_loai_ve}] chưa cấu hình biểu giá cho ngày này!`,
          );
        }

        // 🌟 Tối ưu: Dùng maBenGoc của DB để nhặt đơn giá của bến đó
        const giaCuaBen =
          lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === maBenGoc) ||
          lichSuPhuHop.gia_theo_ben.find((g) => g.ma_nhom_ben === 'CHUNG');

        // Tìm giá Bảo hiểm hành khách (BHHK) an toàn, phòng lỗi trống mảng
        const lichSuBHHK = danhMucVe.lich_su_bhhk
          ?.filter((ls) => new Date(ls.ngay_ap_dung) <= ngayNhapGoc)
          .sort(
            (a, b) =>
              new Date(b.ngay_ap_dung).getTime() -
              new Date(a.ngay_ap_dung).getTime(),
          )[0];

        const bhhkDonGia = lichSuBHHK ? lichSuBHHK.gia_bhhk : 0;
        const bhhkThanhTien = Math.round(xe.so_luot_xe * bhhkDonGia);

        const giaVeApDung = giaCuaBen ? giaCuaBen.gia_ve : 0;
        const tongDoanhThuDongXe = Math.round(xe.so_luot_xe * giaVeApDung);

        // Map nhóm cha/nhóm con từ file cấu hình của anh
        const cauHinhNhom = MAPPING_NHOM_VE[
          xe.ma_loai_ve as keyof typeof MA_GIA_VE
        ] || {
          nhom_cha: 'HANH_KHACH',
          nhom_con: 'HANH_KHACH',
        };

        // Đẩy dòng xe đã được tính toán lại vào mảng tạm
        mangChiTietCapNhat.push({
          ma_loai_ve: xe.ma_loai_ve,
          so_luot_xe: xe.so_luot_xe,
          gia_ve_ap_dung: giaVeApDung,
          tong_doanh_thu: tongDoanhThuDongXe,
          bhhk_don_gia: bhhkDonGia,
          bhhk_thanh_tien: bhhkThanhTien,
          nhom_cha: (xe.nhom_cha ||
            cauHinhNhom.nhom_cha) as ChiTietSanLuong['nhom_cha'],
          nhom_con: (xe.nhom_con ||
            cauHinhNhom.nhom_con) as ChiTietSanLuong['nhom_con'],
        });
      }
    } else {
      // Nếu không truyền mảng xe mới, bê nguyên mảng cũ từ DB ra xài tiếp
      mangChiTietCapNhat.push(
        ...(banGhiCu.chi_tiet_san_luong.map((item) => ({
          ...item,
          nhom_cha: item.nhom_cha as ChiTietSanLuong['nhom_cha'],
          nhom_con: item.nhom_con as ChiTietSanLuong['nhom_con'],
        })) || []),
      );
    }
    // =========================================================
    // BƯỚC 4: KHỐI TÍNH TOÁN DOANH THU - TRIỆT TIÊU SAI SỐ LỆCH 1 ĐỒNG
    // =========================================================

    // --- 4.1 KHỐI DOANH THU THEO VÉ (VÉ LƯỢT) ---
    const dt_theo_ve = mangChiTietCapNhat
      .filter((e) =>
        ['HANH_KHACH', 'XE_CAC_LOAI', 'THUE_BAO'].includes(e.nhom_cha),
      )
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const bhhk_thanh_tien = mangChiTietCapNhat
      .filter((e) =>
        ['HANH_KHACH', 'XE_CAC_LOAI', 'THUE_BAO'].includes(e.nhom_cha),
      )
      .reduce((total, e) => total + (e.bhhk_thanh_tien || 0), 0);

    // Lấy thuế VAT mới, nếu không truyền lấy thuế cũ trong DB, mặc định bằng 8
    const vat_ve_luot =
      dto.doanh_thu_theo_ve?.vat ?? banGhiCu.doanh_thu_theo_ve?.vat ?? 8;
    const doanhThuGocTinhThueLuot = dt_theo_ve - bhhk_thanh_tien;
    // Làm tròn 1 lần duy nhất trên tổng khối để triệt tiêu sai số lẻ
    const vat_thanh_tien_luot = Math.round(
      (doanhThuGocTinhThueLuot / (1 + vat_ve_luot / 100)) * (vat_ve_luot / 100),
    );
    const dtt_ve_luot = doanhThuGocTinhThueLuot - vat_thanh_tien_luot;

    const doanhThuTheoVe = {
      dtt_ve: dtt_ve_luot,
      dt_theo_ve: dt_theo_ve,
      bhhk_thanh_tien: bhhk_thanh_tien,
      vat: vat_ve_luot,
      vat_thanh_tien: vat_thanh_tien_luot,
    };

    // --- 4.2 KHỐI DOANH THU VÉ THÁNG ---
    const dt_theo_ve_thang = mangChiTietCapNhat
      .filter((e) => ['VE_THANG'].includes(e.nhom_cha))
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const vat_ve_thang =
      dto.doanh_thu_ve_thang?.vat ?? banGhiCu.doanh_thu_ve_thang?.vat ?? 8;
    const vat_thanh_tien_thang = Math.round(
      (dt_theo_ve_thang / (1 + vat_ve_thang / 100)) * (vat_ve_thang / 100),
    );
    const dtt_ve_thang = dt_theo_ve_thang - vat_thanh_tien_thang;

    const doanhThuTheoVeThang = {
      dtt_ve: dtt_ve_thang,
      dt_theo_ve: dt_theo_ve_thang,
      vat: vat_ve_thang,
      vat_thanh_tien: vat_thanh_tien_thang,
    };

    // --- 4.3 KHỐI DOANH THU VÉ QUÝ ---
    const dt_theo_ve_qui = mangChiTietCapNhat
      .filter((e) => ['VE_QUI'].includes(e.nhom_cha))
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const vat_ve_qui =
      dto.doanh_thu_ve_qui?.vat ?? banGhiCu.doanh_thu_ve_qui?.vat ?? 8;
    const vat_thanh_tien_qui = Math.round(
      (dt_theo_ve_qui / (1 + vat_ve_qui / 100)) * (vat_ve_qui / 100),
    );
    const dtt_ve_qui = dt_theo_ve_qui - vat_thanh_tien_qui;

    const doanhThuTheoVeQui = {
      dtt_ve: dtt_ve_qui,
      dt_theo_ve: dt_theo_ve_qui,
      vat: vat_ve_qui,
      vat_thanh_tien: vat_thanh_tien_qui,
    };

    // --- 4.4 KHỐI DOANH THU VÉ NĂM ---
    const dt_theo_ve_nam = mangChiTietCapNhat
      .filter((e) => ['VE_NAM'].includes(e.nhom_cha))
      .reduce((total, e) => total + (e.tong_doanh_thu || 0), 0);

    const vat_ve_nam =
      dto.doanh_thu_ve_nam?.vat ?? banGhiCu.doanh_thu_ve_nam?.vat ?? 8;
    const vat_thanh_tien_nam = Math.round(
      (dt_theo_ve_nam / (1 + vat_ve_nam / 100)) * (vat_ve_nam / 100),
    );
    const dtt_ve_nam = dt_theo_ve_nam - vat_thanh_tien_nam;

    const doanhThuTheoVeNam = {
      dtt_ve: dtt_ve_nam,
      dt_theo_ve: dt_theo_ve_nam,
      vat: vat_ve_nam,
      vat_thanh_tien: vat_thanh_tien_nam,
    };

    // --- 4.5 TỔNG DOANH THU THUẦN TỔNG CỘNG ---
    const doanhThuHDTaiChinh =
      dto.doanh_thu_hd_tai_chinh ?? banGhiCu.doanh_thu_hd_tai_chinh ?? 0;
    const doanhThuKhac = dto.doanh_thu_khac ?? banGhiCu.doanh_thu_khac ?? 0;

    // Cộng trực tiếp các số thuần lẻ sau khi đã triệt tiêu sai số tròn
    const doanhThuThuanTongCong =
      dtt_ve_luot + dtt_ve_thang + dtt_ve_qui + dtt_ve_nam + doanhThuHDTaiChinh;
    // =========================================================
    // BƯỚC 5: GHI DỮ LIỆU VÀO DATABASE VÀ HOÀN THÀNH HÀM
    // =========================================================

    const loaiDuLieuApDung =
      dto.loai_du_lieu || banGhiCu.loai_du_lieu || 'THUC_HIEN';

    const banGhiCapNhat = await this.sanLuongModel
      .findByIdAndUpdate(
        id,
        {
          ...dto, // Rải các trường khác từ Frontend gửi lên (nếu có)
          ngay_nhap: ngayNhapGoc, // 🌟 Khóa cứng: Luôn dùng ngày gốc của bản ghi trong DB
          ma_ben: maBenGoc, // 🌟 Khóa cứng: Luôn dùng bến gốc của bản ghi trong DB
          thang_nam: banGhiCu.thang_nam, // Giữ nguyên tháng năm cũ
          chi_tiet_san_luong: mangChiTietCapNhat,
          updated_by: userId, // Lưu vết ID tài khoản người thực hiện chỉnh sửa
          doanh_thu_theo_ve: doanhThuTheoVe,
          doanh_thu_ve_thang: doanhThuTheoVeThang,
          doanh_thu_ve_qui: doanhThuTheoVeQui,
          doanh_thu_ve_nam: doanhThuTheoVeNam,
          doanh_thu_hd_tai_chinh: doanhThuHDTaiChinh,
          doanh_thu_khac: doanhThuKhac,
          doanh_thu_thuan_tong_cong: doanhThuThuanTongCong,
          loai_du_lieu: loaiDuLieuApDung,
        },
        { new: true }, // 🌟 Trả về dữ liệu mới sau khi sửa để Frontend cập nhật lại State hiển thị
      )
      .exec();

    return banGhiCapNhat;
  }

  async checkVaLayDuLieu(
    query: GetSanLuongDto,
  ): Promise<SanLuongDoanhThu | null> {
    const { ngay, ma_ben } = query;

    // 1. Phân tích ngày bằng dayjs
    let ngayTruyVan = dayjs(ngay);
    const mocGioiHan = dayjs('2026-08-01');

    // 2. 🌟 Bẻ ngày: Nếu ngày nhập < 01/08/2026 thì lấy ngày 20 của tháng đó
    if (ngayTruyVan.isBefore(mocGioiHan)) {
      ngayTruyVan = ngayTruyVan.date(20);
    }

    const tuNgay = ngayTruyVan.startOf('day').toDate(); // Tạo Object Date: 2026-06-20T00:00:00
    const denNgay = ngayTruyVan.endOf('day').toDate(); // Tạo Object Date: 2026-06-20T23:59:59

    // 3. Query vào MongoDB của Mongoose bằng khoảng thời gian Date
    const data = await this.sanLuongModel
      .findOne({
        ngay_nhap: {
          $gte: tuNgay,
          $lte: denNgay,
        },
        ma_ben: ma_ben,
      })
      .exec();
    // Trả về Object dữ liệu nếu tìm thấy, không thì trả về null
    return data;
  }

  async remove(id: string) {
    return await this.sanLuongModel.findByIdAndDelete(id).exec();
  }
}
