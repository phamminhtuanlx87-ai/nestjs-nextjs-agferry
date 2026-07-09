"use client";
export interface BenCaoNhat {
  ma_ben: string;
  doanh_thu: string;
}
import { useState, useEffect } from "react";
import api from "@/lib/axios";

interface CompareFilters {
  type?: string;
  percentage?: string;
  text?: string;
}
// Kiểu dữ liệu tổng quan sản lượng nhận từ API
export interface TQSanLuongRes {
  tongDoanhThu: string;
  tongLuotXeCacLoai: string;
  tongLuotHanhKhach: string;
  tongLuotThueBao: string;
  tongLuotVeDinhKy: string;
  benCaoNhat: {
    ma_ben: string;
    doanh_thu: string;
  };
  trends: {
    tongDoanhThu?: CompareFilters;
    tongLuotXeCacLoai?: CompareFilters;
    tongLuotHanhKhach?: CompareFilters;
    tongLuotThueBao?: CompareFilters;
    tongLuotVeDinhKy?: CompareFilters;
    benCaoNhat?: CompareFilters;
  } | null;
}

// Cấu trúc phản hồi chuẩn từ NestJS API
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface FilterToolbarDto {
  time?: string; // Sẽ mang giá trị: "THANG_NAY", "HOM_NAY", "HOM_QUA",...
  location?: string; // (Nếu có dùng sau này)
  compare?: string; // (Nếu có dùng sau này)
  metric?: string;
  search?: string;
}

export function useTQSanLuong(filters?: FilterToolbarDto) {
  const [dulieu, setDulieu] = useState<TQSanLuongRes | null>(null);
  const [isLoading, setDangTai] = useState<boolean>(true);
  const [error, setLoi] = useState<string | null>(null);

  useEffect(() => {
    async function goiApiLayDuLieu() {
      try {
        setDangTai(true);
        // Đường dẫn gọi đến API Backend của bạn
        const response = await api.get<ApiResponse<TQSanLuongRes>>(
          "/san-luong-doanh-thu?",
          {
            params: {
              time: filters?.time || "THANG_NAY",
              location: filters?.location || "ALL",
              compare: filters?.compare || "KY_TRUOC",
            },
          },
        );
        console.log(response);
        if (response.data && response.data.data) {
          setDulieu(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi gọi API check sản lượng:", error);
        setLoi("Lỗi gọi API check sản lượng: " + error);
        throw error;
      } finally {
        setDangTai(false);
      }
    }

    goiApiLayDuLieu();
  }, [filters]);

  return { dulieu, isLoading, error };
}
