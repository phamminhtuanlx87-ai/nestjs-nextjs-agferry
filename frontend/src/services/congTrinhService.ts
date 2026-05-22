import api from "@/lib/axios";

interface ApiResponse {
  message: string;
  data: ICongTrinh[];
}

export interface CongtrinhRequest {
  ma_cong_trinh?: string; // Tùy chọn, có thể để backend tự sinh
  ten_cong_trinh: string;
  ngay_tao_du_an?: string; // Định dạng "2026-04-09"
  don_vi_chu_quan?: string;
  isActive?: boolean; // Thêm trường isActive để quản lý trạng thái công trình
}
export type UpdateCongtrinhRequest = Partial<CongtrinhRequest> & {
  giai_doan?: IGiaiDoan[]; // Thêm mảng giai đoạn vào đây
};

export async function addProject(ctrData: CongtrinhRequest) {
  const response = await api.post<ApiResponse>("/congtrinh", ctrData);
  return response.data.data; // Giả sử API trả về { data: [...] }
}

export async function updateProject(
  id: string,
  ctrData: UpdateCongtrinhRequest,
) {
  const response = await api.patch<ApiResponse>(`/congtrinh/${id}`, ctrData);
  return response.data.data; // Giả sử API trả về { data: [...] }
}

export interface ICongTrinh {
  _id: string;
  ma_cong_trinh: string;
  ten_cong_trinh: string;
  don_vi_chu_quan: string;
  ngay_tao_du_an: string;
  giai_doan: IGiaiDoan[];
  updatedAt: string | Date; // Đảm bảo có trường này
  createdAt: string | Date;
}
export interface IGiaiDoan {
  ma_hieu: string;
  ten_giai_doan: string;
  ma_don_vi: string;
  ten_don_vi: string;
  so_ngay_tc_pgv?: number;
  so_ngay_tc_thuc_te?: number;
  chenh_lech_tgt?: string | number;
  chenh_lech_cpxd?: string | number;
  tong_gia_tri?: string | number;
  chi_phi_xay_dung?: string | number;
  dia_diem_tc?:string;
  ngay_thuc_hien?: string;
  ngay_hoan_thanh?: string;
  file_links?: ILinkFile[];
}

export interface ILinkFile {
  link_name: string;
  link_url: string;
}
export const getAllCongTrinh = async (
  month: number,
  year: number,
): Promise<ICongTrinh[]> => {
  const response = await api.get<ApiResponse>("/congtrinh", {
    params: {
      month,
      year,
    },
  });
  return response.data.data; // Giả sử API trả về { data: [...] }
};

export const getCongTrinh = async (id: string): Promise<ICongTrinh> => {
  const response = await api.get<ApiResponse>(`/congtrinh/${id}`);
  return response.data.data[0]; // Giả sử API trả về { data: [...] }
};

export const deleteSoftCongTrinh = async (
  id: string,
): Promise<ICongTrinh[]> => {
  const response = await api.patch<ApiResponse>(`/congtrinh/${id}/soft-delete`);
  return response.data.data; // Giả sử API trả về { data: [...] }
};
