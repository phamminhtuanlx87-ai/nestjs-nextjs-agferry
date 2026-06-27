"use client";
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

export const getAllDanhMuc = async (ngayApDung: string): Promise<TicketType[]> => {
  const response = await api.get<{ data: TicketType[] }>(
    `danh-muc-gia-ve?ngay=${ngayApDung}`
  );
  return response.data.data;
};