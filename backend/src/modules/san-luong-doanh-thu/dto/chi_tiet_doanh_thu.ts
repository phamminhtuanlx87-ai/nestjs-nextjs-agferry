export interface ChiTietDoanhThuNhom {
  dtt_ve: number;
  dt_theo_ve: number;
  vat: number;
  vat_thanh_tien: number;
}

export interface ChiTietSanLuong {
  ma_loai_ve: string;
  so_luot_xe: number;
  gia_ve_ap_dung: number;
  tong_doanh_thu?: number;
  bhhk_don_gia?: number;
  bhhk_thanh_tien?: number;
  nhom_cha:
    | 'HANH_KHACH'
    | 'XE_CAC_LOAI'
    | 'THUE_BAO'
    | 'VE_THANG'
    | 'VE_QUI'
    | 'VE_NAM';
  nhom_con: 'HANH_KHACH' | 'XE_KHACH' | 'XE_TAI';
}
export interface CreateSanLuongDoanhThu {
  _id?: string;

  ngay_nhap: string;
  loai_du_lieu: 'THUC_HIEN' | 'KE_HOACH';

  thang_nam?: string;

  ma_ben: string;

  chi_tiet_san_luong: ChiTietSanLuong[];

  doanh_thu_theo_ve: ChiTietDoanhThuNhom;

  doanh_thu_ve_thang: ChiTietDoanhThuNhom;

  doanh_thu_ve_qui: ChiTietDoanhThuNhom;

  doanh_thu_ve_nam: ChiTietDoanhThuNhom;

  doanh_thu_hd_tai_chinh: number;

  doanh_thu_khac: number;
  doanh_thu_thuan_tong_cong: number;
}

export const MA_GIA_VE = {
  HK: 'HK', //1

  XK_THO_SO: 'XK_THO_SO', //2
  XK_DUOI_7C: 'XK_DUOI_7C', //3
  XK_TU_7C_DEN_12C: 'XK_TU_7C_DEN_12C', //4
  XK_TU_12C_DEN_16C: 'XK_TU_12C_DEN_16C', //5
  XK_TU_16C_DEN_30C: 'XK_TU_16C_DEN_30C', //6
  XK_TU_30C_DEN_45C: 'XK_TU_30C_DEN_45C', //7
  XK_45C: 'XK_45C', //8

  XT_DUOI_3T: 'XT_DUOI_3T', //9
  XT_TU_3T_DEN_5T: 'XT_TU_3T_DEN_5T', //10
  XT_TU_5T_DEN_7T: 'XT_TU_5T_DEN_7T', //11
  XT_TU_7T_DEN_10T: 'XT_TU_7T_DEN_10T', //12
  XT_TU_10T_DEN_15T: 'XT_TU_10T_DEN_15T', //13
  XT_TU_15T_DEN_20T: 'XT_TU_15T_DEN_20T', //14
  XT_20T_TRO_LEN: 'XT_20T_TRO_LEN',

  TB_PHA_30T: 'TB_PHA_30T', //15
  TB_PHA_60T: 'TB_PHA_60T', //16
  TB_PHA_100T: 'TB_PHA_100T', //17
  TB_PHA_200T: 'TB_PHA_200T', //18

  VE_THANG_HK: 'VE_THANG_HK', //19
  VE_THANG_DUOI_7C: 'VE_THANG_DUOI_7C', //22
  VE_THANG_TU_7C_DEN_12C: 'VE_THANG_TU_7C_DEN_12C', //23

  VE_QUI_HK: 'VE_QUI_HK', //20
  VE_QUI_7C: 'VE_QUI_7C', //21
  VE_QUI_TU_7C_DEN_12C: 'VE_QUI_TU_7C_DEN_12C', //24

  VE_NAM_HK: 'VE_NAM_HK', //25
  VE_NAM_DUOI_7C: 'VE_NAM_DUOI_7C', //26
  VE_NAM_TU_7C_DEN_12C: 'VE_NAM_TU_7C_DEN_12C',
} as const;

export const MAPPING_NHOM_VE: Record<
  keyof typeof MA_GIA_VE,
  {
    nhom_cha: ChiTietSanLuong['nhom_cha'];
    nhom_con: ChiTietSanLuong['nhom_con'];
  }
> = {
  // 1. Nhóm Hành Khách
  HK: { nhom_cha: 'HANH_KHACH', nhom_con: 'HANH_KHACH' },

  // 2. Nhóm Xe Khách (Xe các loại)
  XK_THO_SO: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_KHACH' },
  XK_DUOI_7C: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_KHACH' },
  XK_TU_7C_DEN_12C: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_KHACH' },
  XK_TU_12C_DEN_16C: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_KHACH' },
  XK_TU_16C_DEN_30C: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_KHACH' },
  XK_TU_30C_DEN_45C: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_KHACH' },
  XK_45C: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_KHACH' },

  // 3. Nhóm Xe Tải (Xe các loại)
  XT_DUOI_3T: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_TAI' },
  XT_TU_3T_DEN_5T: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_TAI' },
  XT_TU_5T_DEN_7T: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_TAI' },
  XT_TU_7T_DEN_10T: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_TAI' },
  XT_TU_10T_DEN_15T: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_TAI' },
  XT_TU_15T_DEN_20T: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_TAI' },
  XT_20T_TRO_LEN: { nhom_cha: 'XE_CAC_LOAI', nhom_con: 'XE_TAI' },

  // 4. Nhóm Thuê Bao Phao / Phà
  TB_PHA_30T: { nhom_cha: 'THUE_BAO', nhom_con: 'XE_TAI' }, // Hoặc tùy anh quy ước nhom_con
  TB_PHA_60T: { nhom_cha: 'THUE_BAO', nhom_con: 'XE_TAI' },
  TB_PHA_100T: { nhom_cha: 'THUE_BAO', nhom_con: 'XE_TAI' },
  TB_PHA_200T: { nhom_cha: 'THUE_BAO', nhom_con: 'XE_TAI' },

  // 5. Nhóm Vé Tháng
  VE_THANG_HK: { nhom_cha: 'VE_THANG', nhom_con: 'HANH_KHACH' },
  VE_THANG_DUOI_7C: { nhom_cha: 'VE_THANG', nhom_con: 'XE_KHACH' },
  VE_THANG_TU_7C_DEN_12C: { nhom_cha: 'VE_THANG', nhom_con: 'XE_KHACH' },

  // 6. Nhóm Vé Quý
  VE_QUI_HK: { nhom_cha: 'VE_QUI', nhom_con: 'HANH_KHACH' },
  VE_QUI_7C: { nhom_cha: 'VE_QUI', nhom_con: 'XE_KHACH' },
  VE_QUI_TU_7C_DEN_12C: { nhom_cha: 'VE_QUI', nhom_con: 'XE_KHACH' },

  // 7. Nhóm Vé Năm
  VE_NAM_HK: { nhom_cha: 'VE_NAM', nhom_con: 'HANH_KHACH' },
  VE_NAM_DUOI_7C: { nhom_cha: 'VE_NAM', nhom_con: 'XE_KHACH' },
  VE_NAM_TU_7C_DEN_12C: { nhom_cha: 'VE_NAM', nhom_con: 'XE_KHACH' },
};
