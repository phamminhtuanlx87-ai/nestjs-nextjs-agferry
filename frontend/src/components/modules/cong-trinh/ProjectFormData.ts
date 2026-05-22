

export interface FileLinkDto {
  link_name: string;
  link_url: string;
}

export interface GiaiDoanDto {
  ma_hieu: string;
  ten_giai_doan: string;
  ma_don_vi?: string;
  ten_don_vi?: string;
  tong_gia_tri?: string | number;
  chi_phi_xay_dung?: string | number;
  ngay_thuc_hien?: string;
  ngay_hoan_thanh?: string;
  so_ngay_tc_pgv?:string;
  so_ngay_tc_thuc_te?:string;
  dia_diem_tc?:string;
  file_links?: FileLinkDto[];
}

export interface ProjectFormData {
  id: string;
  ma_cong_trinh?: string;
  don_vi_chu_quan?: string;
  ten_cong_trinh: string;
  ngay_tao_du_an?: string;
  giai_doan?: GiaiDoanDto[];
  isActieve?: boolean; // Thêm trường isActive để quản lý trạng thái công trình
}
