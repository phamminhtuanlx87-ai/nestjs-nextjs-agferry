"use client";
import { MA_GIA_VE } from "@/constants/maDonGia";
import api from "@/lib/axios";

// ==========================================
// 🏛️ TẦNG 1: INTERFACES DANH MỤC GIÁ VÉ
// ==========================================
export interface LichSuBHHK {
  ngay_ap_dung: Date | string;
  gia_bhhk: number; // 🌟 Là kiểu số nguyên (number) chứ không phải mảng number[]
}

export interface GiaTheoBen {
  ma_nhom_ben: string;
  gia_ve: number | string;
}

export interface LichSuGia {
  ngay_ap_dung: Date | string;
  gia_theo_ben: GiaTheoBen[];
}

export interface TicketType {
  _id: string;
  ma_loai_ve: string;
  ten_loai_ve: string;
  nhom_cha: string;
  nhom_con?: string;
  lich_su_gia: LichSuGia[];
  lich_su_bhhk: LichSuBHHK[]; // 🌟 Sử dụng interface thành phần đã chuẩn hóa
}

export interface SanLuongFormInputs {
  [ticketId: string]: number;
}

export const getAllDanhMuc = async (
  ngayApDung: string,
): Promise<TicketType[]> => {
  const response = await api.get<{ data: TicketType[] }>(
    `danh-muc-gia-ve?ngay=${ngayApDung}`,
  );
  return response.data.data;
};

// ==========================================
// 📊 TẦNG 2: INTERFACES SẢN LƯỢNG DOANH THU (CHUẨN HOÁ GIỮA FE & BE)
// ==========================================
export interface ChiTietSanLuongDto {
  _id?: string;
  ma_loai_ve: string;
  so_luot_xe: number;
  gia_ve_ap_dung?: number;
  tong_doanh_thu?: number;
  bhhk_don_gia?: number;
  bhhk_thanh_tien?: number;
  nhom_cha:
    | "HANH_KHACH"
    | "XE_CAC_LOAI"
    | "THUE_BAO"
    | "VE_THANG"
    | "VE_QUI"
    | "VE_NAM";
  nhom_con:
    | "HANH_KHACH"
    | "XE_KHACH"
    | "XE_TAI"
    | "THUE_BAO"
    | "VE_THANG"
    | "VE_QUI"
    | "VE_NAM";
}

export interface ChiTietDoanhThuNhomDto {
  dtt_ve: number;
  dt_theo_ve: number;
  vat: number;
  vat_thanh_tien?: number;
}

export interface CreateSanLuongDoanhThuDto {
  _id?: string;
  ngay_nhap: string;
  thang_nam: string;
  ma_ben: string;
  chi_tiet_san_luong: ChiTietSanLuongDto[];
  doanh_thu_theo_ve?: ChiTietDoanhThuNhomDto;
  doanh_thu_ve_thang?: ChiTietDoanhThuNhomDto;
  doanh_thu_ve_qui?: ChiTietDoanhThuNhomDto;
  doanh_thu_ve_nam?: ChiTietDoanhThuNhomDto;
  doanh_thu_hd_tai_chinh?: number;
  doanh_thu_khac?: number;
  doanh_thu_thuan_tong_cong?: number;
  loai_du_lieu?: "THUC_HIEN" | "KE_HOACH";
  createdAt?: string;
  updatedAt?: string;
}

// 🌟 Chuẩn hóa gói phản hồi bọc từ NestJS API
export interface NestApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
}

// ==========================================
// 🚀 TẦNG 3: HỆ THỐNG SERVICES SẠCH BÓNG ANY
// ==========================================
export const sanLuongService = {
  /**
   * 🌟 Kiểm tra và bốc dữ liệu cũ/ngày 20 (Nhận dạng cấu trúc NestJS)
   */
  checkDataSanLuong: async (
    ngay: string,
    maBen: string,
  ): Promise<NestApiResponse<CreateSanLuongDoanhThuDto>> => {
    try {
      const response = await api.get<
        NestApiResponse<CreateSanLuongDoanhThuDto>
      >(`/san-luong-doanh-thu/check-data`, { params: { ngay, ma_ben: maBen } });
      return response.data;
    } catch (error) {
      console.error("Lỗi gọi API check sản lượng:", error);
      throw error;
    }
  },

  /**
   * 🌟 Lưu mới dữ liệu sản lượng doanh thu
   */
  createSanLuongDoanhThu: async (
    sanluong: CreateSanLuongDoanhThuDto,
  ): Promise<NestApiResponse<CreateSanLuongDoanhThuDto>> => {
    try {
      const response = await api.post<
        NestApiResponse<CreateSanLuongDoanhThuDto>
      >("/san-luong-doanh-thu", sanluong);
      return response.data;
    } catch (error) {
      console.error("Lỗi gọi API thêm mới sản lượng:", error);
      throw error;
    }
  },

  /**
   * 🌟 Cập nhật dữ liệu sản lượng doanh thu (Đã gạt bỏ an toàn 'any')
   */
  updateSanLuong: async (
    id: string,
    payload: CreateSanLuongDoanhThuDto,
  ): Promise<NestApiResponse<CreateSanLuongDoanhThuDto>> => {
    try {
      const response = await api.patch<
        NestApiResponse<CreateSanLuongDoanhThuDto>
      >(`/san-luong-doanh-thu/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Lỗi gọi API cập nhật sản lượng:", error);
      throw error;
    }
  },

  /**
   * 🌟 Cập nhật dữ liệu sản lượng doanh thu (Đã gạt bỏ an toàn 'any')
   */
  getAllSanLuong: async (): Promise<
    NestApiResponse<CreateSanLuongDoanhThuDto>
  > => {
    try {
      const response =
        await api.get<NestApiResponse<CreateSanLuongDoanhThuDto>>(
          `/san-luong-doanh-thu`,
        );
      return response.data;
    } catch (error) {
      console.error("Lỗi gọi API cập nhật sản lượng:", error);
      throw error;
    }
  },
  /**
   * 🎫 Hàm phụ trợ bóc tách giá vé chuẩn theo bến (An toàn 100% Strict Type)
   */
  getGiaVe: (ticket: TicketType, benHienTai: string): number => {
    const lichSuGanNhat = ticket.lich_su_gia?.[0];
    if (!lichSuGanNhat?.gia_theo_ben) return 0;

    // Tìm giá theo mã bến hiện tại (AH, CH, TC_VC...), nếu không có thì tìm giá "CHUNG"
    const giaTheoBenObj =
      lichSuGanNhat.gia_theo_ben.find((b) => b.ma_nhom_ben === benHienTai) ||
      lichSuGanNhat.gia_theo_ben.find((b) => b.ma_nhom_ben === "CHUNG");

    return giaTheoBenObj ? Number(giaTheoBenObj.gia_ve) : 0;
  },

  /**
   * 🛡️ Hàm phụ trợ lấy đơn giá Bảo Hiểm Hành Khách (Khớp chuẩn dữ liệu tầng 1 Service)
   */
  getGiaBHHK: (ticket: TicketType): number => {
    // Kiểm tra an toàn dữ liệu đầu vào
    if (!ticket || !ticket.lich_su_bhhk || ticket.lich_su_bhhk.length === 0) {
      return 0;
    }

    // Lấy bản ghi cấu hình bảo hiểm gần nhất [0]
    const bhhkGanNhat = ticket.lich_su_bhhk[0];

    // Trả về trường gia_bhhk kiểu số nguyên (number) chuẩn định dạng tầng 1
    return bhhkGanNhat?.gia_bhhk ? Number(bhhkGanNhat.gia_bhhk) : 0;
  },
};

// ==========================================
// 📑 TẦNG 4: DANH MỤC MAPPING NHÓM VÉ
// ==========================================
export const MAPPING_NHOM_VE: Record<
  keyof typeof MA_GIA_VE,
  {
    nhom_cha: ChiTietSanLuongDto["nhom_cha"];
    nhom_con: ChiTietSanLuongDto["nhom_con"];
  }
> = {
  HK: { nhom_cha: "HANH_KHACH", nhom_con: "HANH_KHACH" },

  XK_THO_SO: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_DUOI_7C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_TU_7C_DEN_12C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_TU_12C_DEN_16C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_TU_16C_DEN_30C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_TU_30C_DEN_45C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_45C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },

  XT_DUOI_3T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_TU_3T_DEN_5T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_TU_5T_DEN_7T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_TU_7T_DEN_10T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_TU_10T_DEN_15T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_TU_15T_DEN_20T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_20T_TRO_LEN: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },

  TB_PHA_30T: { nhom_cha: "THUE_BAO", nhom_con: "XE_TAI" },
  TB_PHA_60T: { nhom_cha: "THUE_BAO", nhom_con: "XE_TAI" },
  TB_PHA_100T: { nhom_cha: "THUE_BAO", nhom_con: "XE_TAI" },
  TB_PHA_200T: { nhom_cha: "THUE_BAO", nhom_con: "XE_TAI" },

  VE_THANG_HK: { nhom_cha: "VE_THANG", nhom_con: "HANH_KHACH" },
  VE_THANG_DUOI_7C: { nhom_cha: "VE_THANG", nhom_con: "XE_KHACH" },
  VE_THANG_TU_7C_DEN_12C: { nhom_cha: "VE_THANG", nhom_con: "XE_KHACH" },

  VE_QUI_HK: { nhom_cha: "VE_QUI", nhom_con: "HANH_KHACH" },
  VE_QUI_7C: { nhom_cha: "VE_QUI", nhom_con: "XE_KHACH" },
  VE_QUI_TU_7C_DEN_12C: { nhom_cha: "VE_QUI", nhom_con: "XE_KHACH" },

  VE_NAM_HK: { nhom_cha: "VE_NAM", nhom_con: "HANH_KHACH" },
  VE_NAM_DUOI_7C: { nhom_cha: "VE_NAM", nhom_con: "XE_KHACH" },
  VE_NAM_TU_7C_DEN_12C: { nhom_cha: "VE_NAM", nhom_con: "XE_KHACH" },
};

export const MAPPING_VAT_FIELD = {
  HANH_KHACH: "thue_vat_hanh_khach",
  XE_CAC_LOAI: "thue_vat_xe_cac_loai",
  XE_KHACH: "thue_vat_xe_khach",
  XE_TAI: "thue_vat_xe_tai",
  THUE_BAO: "thue_vat_thue_bao",
  VE_THANG: "thue_vat_ve_thang",
  VE_QUI: "thue_vat_ve_qui",
  VE_NAM: "thue_vat_ve_nam",
  undefined: "thue_vat_khac",
} as const;

export const MAPPING_BEN_PHA_FIELD = {
  ALL: "Tất cả bến phà",
  AH: "Bến phà An Hoà",
  OM: "Bến phà Ô Môi",
  TO: "Bến phà Trà Ôn",
  MR: "Bến phà Mương Ranh",
  NG: "Bến Phà Năng Gù",
  TG: "Bến phà Thuận Giang",
  TC: "Bến phà Tân Châu",
  VC: "Bến phà Vàm Cống",
} as const;
export type ma_ben = keyof typeof MAPPING_BEN_PHA_FIELD;
export const DANH_SACH_BEN_PHA_OPTIONS = Object.entries(
  MAPPING_BEN_PHA_FIELD,
).map(([key, value]) => ({
  value: key as ma_ben, // Ép kiểu chặt chẽ, không dùng any
  label: value,
}));

export const MAPPING_THOI_GIAN_FIELD = {
  HOM_NAY: "Hôm nay",
  BAY_NGAY_GAN_NHAT: "7 ngày gần nhất",
  BA_MUOI_NGAY_GAN_NHAT: "30 ngày gần nhất",
  THANG_NAY: "Tháng này",
  QUI_NAY: "Quý này",
  NAM_NAY: "Năm nay",
  TUY_CHON: "Tùy chọn",
} as const;
export type ngay_nhap = keyof typeof MAPPING_THOI_GIAN_FIELD;
export const DANH_SACH_THOI_GIAN_OPTIONS = Object.entries(
  MAPPING_THOI_GIAN_FIELD,
).map(([key, value]) => ({
  value: key as ngay_nhap, // Ép kiểu chặt chẽ, không dùng any
  label: value,
}));

export const MAPPING_SO_SANH_FIELD = {
  KHONG_DOI_CHIEU: "Không đối chiếu",
  KY_TRUOC: "Kỳ trước",
  CUNG_KY_NAM_TRUOC: "Cùng kỳ năm trước",
} as const;
export type so_sanh = keyof typeof MAPPING_SO_SANH_FIELD;
export const DANH_SACH_SO_SANH_OPTIONS = Object.entries(
  MAPPING_SO_SANH_FIELD,
).map(([key, value]) => ({
  value: key as so_sanh, // Ép kiểu chặt chẽ, không dùng any
  label: value,
}));
