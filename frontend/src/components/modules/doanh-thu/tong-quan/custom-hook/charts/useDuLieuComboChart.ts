"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

// Kiểu dữ liệu chi tiết của từng cột mốc (Khớp hoàn toàn với JSON Backend)
export interface ChiTietDuLieuResponse {
  readonly ngay: string;
  readonly nhan: string;
  readonly san_luong: number; // Đổi sang snake_case và kiểu number
  readonly doanh_thu: number; // Đổi sang snake_case và kiểu number
}

// Kiểu dữ liệu tổng quan sản lượng nhận từ API
export interface ComboChartResponse {
  readonly don_vi_san_luong: string;
  readonly don_vi_doanh_thu: string;
  readonly loai_nhom: string;
  readonly tu_ngay: string;
  readonly den_ngay: string;
  readonly du_lieu: ChiTietDuLieuResponse[]; // Khớp với trường "du_lieu" của API
}

// Cấu trúc phản hồi chuẩn từ NestJS API
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface FilterToolbarDto {
  time?: string;     // Mang giá trị: "THANG_NAY", "HOM_NAY",...
  location?: string; // ID Bến phà
  compare?: string;
  metric?: string;
  search?: string;
}

export function useDuLieuComboChart(filters?: FilterToolbarDto) {
  const [duLieuComboChart, setDuLieuComboChart] = useState<ComboChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function goiApiLayDuLieu() {
      try {
        setIsLoading(true);
        
        // Đã bỏ dấu "?" dư thừa ở cuối URL để Axios tự sinh Query String chuẩn
        const response = await api.get<ApiResponse<ComboChartResponse>>(
          "/san-luong-doanh-thu/chart",
          {
            params: {
              time: filters?.time || "THANG_NAY",
              location: filters?.location || "ALL",
            },
          },
        );

        // Kiểm tra an toàn dữ liệu trước khi set state
        if (response.data && response.data.statusCode === 200) {
          setDuLieuComboChart(response.data.data);
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
    duLieuComboChart,
    isLoading 
  };
}