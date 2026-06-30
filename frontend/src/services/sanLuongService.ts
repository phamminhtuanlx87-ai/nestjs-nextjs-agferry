"use client";
import { MA_GIA_VE } from "@/constants/maDonGia";
import api from "@/lib/axios";

export interface TicketType {
  _id: string;
  ma_loai_ve: string;
  ten_loai_ve: string;
  nhom_cha: string;
  nhom_con?: string;
  lich_su_gia: {
    ngay_ap_dung: string;
    gia_theo_ben: {
      ma_nhom_ben: string;
      gia_ve: number | string; // Chấp nhận cả string từ DB và convert sau
    }[];
  }[];
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

//San luong doanh thu
export interface ChiTietSanLuongDto {
  _id?: string;
  ma_loai_ve: string;
  so_luot_xe: number;
  gia_ve_ap_dung?: number; // Thêm trường này nếu Frontend muốn hứng số đơn giá Backend tự bốc
  tong_doanh_thu?: number; // Thêm trường này nếu Frontend muốn hứng số tiền Backend tự nhân
  nhom_cha:
    | "HANH_KHACH"
    | "XE_CAC_LOAI"
    | "THUE_BAO"
    | "VE_THANG"
    | "VE_QUI"
    | "VE_NAM";
  nhom_con: "HANH_KHACH" | "XE_KHACH" | "XE_TAI";
}

export interface ChiTietDoanhThuNhomDto {
  dtt_ve: number;
  dt_theo_ve: number;
  bhhk?: number;
  bhhk_thanh_tien?: number;
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
  createdAt?: string; // Hứng thêm vết từ DB nếu cần
  updatedAt?: string;
}
interface SanLuongResponse {
  message: string;
  data: CreateSanLuongDoanhThuDto;
}

export const createSanLuongDoanhThu = async (
  sanluong: CreateSanLuongDoanhThuDto,
): Promise<CreateSanLuongDoanhThuDto> => {
  const response = await api.post<SanLuongResponse>(
    "/san-luong-doanh-thu",
    sanluong,
  );
  return response.data.data; // Chuẩn chỉnh 1 Object bản ghi sạch từ DB
};

// interface GetSanLuongResponse {
//   formatNgayString: string;
//   maBen: string;
//   data: CreateSanLuongDoanhThuDto;
// }

// export const getChiTietByNgay = async (
//   getsanluong: GetSanLuongResponse,
// ): Promise<CreateSanLuongDoanhThuDto> => {
//   const response = await api.get<GetSanLuongResponse>({`/san-luong-doanh-thu/ngay=${getsanluong.formatNgayString}&&maben=${getsanluong.maBen}`},);
//   return response.data.data; // Chuẩn chỉnh 1 Object bản ghi sạch từ DB
// };

export const MAPPING_NHOM_VE: Record<
  keyof typeof MA_GIA_VE,
  {
    nhom_cha: ChiTietSanLuongDto["nhom_cha"];
    nhom_con: ChiTietSanLuongDto["nhom_con"];
  }
> = {
  // 1. Nhóm Hành Khách
  HK: { nhom_cha: "HANH_KHACH", nhom_con: "HANH_KHACH" },

  // 2. Nhóm Xe Khách (Xe các loại)
  XK_THO_SO: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_DUOI_7C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_TU_7C_DEN_12C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_TU_12C_DEN_16C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_TU_16C_DEN_30C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_TU_30C_DEN_45C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },
  XK_45C: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_KHACH" },

  // 3. Nhóm Xe Tải (Xe các loại)
  XT_DUOI_3T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_TU_3T_DEN_5T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_TU_5T_DEN_7T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_TU_7T_DEN_10T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_TU_10T_DEN_15T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_TU_15T_DEN_20T: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },
  XT_20T_TRO_LEN: { nhom_cha: "XE_CAC_LOAI", nhom_con: "XE_TAI" },

  // 4. Nhóm Thuê Bao Phao / Phà
  TB_PHA_30T: { nhom_cha: "THUE_BAO", nhom_con: "XE_TAI" }, // Hoặc tùy anh quy ước nhom_con
  TB_PHA_60T: { nhom_cha: "THUE_BAO", nhom_con: "XE_TAI" },
  TB_PHA_100T: { nhom_cha: "THUE_BAO", nhom_con: "XE_TAI" },
  TB_PHA_200T: { nhom_cha: "THUE_BAO", nhom_con: "XE_TAI" },

  // 5. Nhóm Vé Tháng
  VE_THANG_HK: { nhom_cha: "VE_THANG", nhom_con: "HANH_KHACH" },
  VE_THANG_DUOI_7C: { nhom_cha: "VE_THANG", nhom_con: "XE_KHACH" },
  VE_THANG_TU_7C_DEN_12C: { nhom_cha: "VE_THANG", nhom_con: "XE_KHACH" },

  // 6. Nhóm Vé Quý
  VE_QUI_HK: { nhom_cha: "VE_QUI", nhom_con: "HANH_KHACH" },
  VE_QUI_7C: { nhom_cha: "VE_QUI", nhom_con: "XE_KHACH" },
  VE_QUI_TU_7C_DEN_12C: { nhom_cha: "VE_QUI", nhom_con: "XE_KHACH" },

  // 7. Nhóm Vé Năm
  VE_NAM_HK: { nhom_cha: "VE_NAM", nhom_con: "HANH_KHACH" },
  VE_NAM_DUOI_7C: { nhom_cha: "VE_NAM", nhom_con: "XE_KHACH" },
  VE_NAM_TU_7C_DEN_12C: { nhom_cha: "VE_NAM", nhom_con: "XE_KHACH" },
};
