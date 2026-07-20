"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

// Kiểu dữ liệu chi tiết của từng cột mốc (Khớp hoàn toàn với JSON Backend)
export interface ChiTietTyTrongResponse {
  readonly nhom: string;
  readonly nhan: string;
  readonly san_luong: number; // Đổi sang snake_case và kiểu number
  readonly doanh_thu: number;
  readonly ty_trong_san_luong: number;
  readonly ty_trong_doanh_thu: number; // Đổi sang snake_case và kiểu number
}

// Kiểu dữ liệu tổng quan sản lượng nhận từ API
export interface TyTrongChartResponse {
  readonly don_vi_san_luong: string;
  readonly don_vi_doanh_thu: string;
  readonly loai_nhom: string;
  readonly tu_ngay: string;
  readonly den_ngay: string;
  readonly ve_luot: ChiTietTyTrongResponse[]; // Khớp với trường "du_lieu" của API
  readonly ve_ky: ChiTietTyTrongResponse[]; // Khớp với trường "du_lieu" của API
}

export const BANG_MAU_THEO_NHOM: Record<string, string> = {
  HANH_KHACH: "#4F46E5",
  THUE_BAO: "#10B981",
  VE_NAM: "#F59E0B",
  VE_QUI: "#EF4444",
  VE_THANG: "#8B5CF6",
  XE_KHACH: "#EC4899",
  XE_TAI: "#14B8A6",
};
// Cấu trúc phản hồi chuẩn từ NestJS API
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface FilterToolbarDto {
  time?: string; // Mang giá trị: "THANG_NAY", "HOM_NAY",...
  location?: string; // ID Bến phà
  compare?: string;
  metric?: string;
  search?: string;
}

export function useDuLieuTyTrongChart(filters?: FilterToolbarDto) {
  const [duLieuTyTrongChart, setDuLieuTyTrongChart] =
    useState<TyTrongChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function goiApiLayDuLieu() {
      try {
        setIsLoading(true);

        // Đã bỏ dấu "?" dư thừa ở cuối URL để Axios tự sinh Query String chuẩn
        const response = await api.get<ApiResponse<TyTrongChartResponse>>(
          "/san-luong-doanh-thu/ttsanluongchart",
          {
            params: {
              time: filters?.time || "THANG_NAY",
              location: filters?.location || "ALL",
            },
          },
        );

        // Kiểm tra an toàn dữ liệu trước khi set state
        if (response.data && response.data.statusCode === 200) {
          setDuLieuTyTrongChart(response.data.data);
        }
      } catch (error) {
        // Ghi nhận log lỗi hệ thống nội bộ, không phá vỡ ứng dụng
        console.error("Lỗi gọi API thống kê sản lượng:", error);
      } finally {
        setIsLoading(false);
      }
    }

    goiApiLayDuLieu();
  }, [filters?.time, filters?.location]); // Chỉ re-run khi 2 params cốt lõi này thực sự thay đổi

  return {
    duLieuTyTrongChart,
    isLoading,
  };
}
