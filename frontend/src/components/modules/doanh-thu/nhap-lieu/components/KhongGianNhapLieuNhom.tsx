// 📂 FILE: components/modules/doanh-thu/KhongGianNhapLieuNhom.tsx
"use client";
import React from "react";
import { SanLuongFormInputs, TicketType } from "@/services/sanLuongService";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { GroupHeader } from "../../GroupHeader";
import InputSanLuong from "../../InputComponent";

// Định nghĩa Interface Props chuẩn hóa Strict Type 100%
interface KhongGianNhapLieuNhomProps {
  danhSachVe: TicketType[];
  maBen: string;
  title: string;
  nhom: string;
  total?: number;
  values: Partial<SanLuongFormInputs>; // Ép kiểu object form value theo service
  errors: FieldErrors<SanLuongFormInputs>; // Kiểu errors chuẩn của react-hook-form\
  register: UseFormRegister<SanLuongFormInputs>; // Kiểu register chuẩn không any
  getGiaVe: (ticket: TicketType, benHienTai: string) => number;
  msgEmpty?: string;
  tinhTongDoanhThuNhom: (nhomKey: string) => { tongDoanhThu: number } | undefined;
}

export const KhongGianNhapLieuNhom: React.FC<KhongGianNhapLieuNhomProps> = ({
  danhSachVe,
  maBen,
  values,
  errors,
  register,
  getGiaVe,
  title,
  total,
  msgEmpty = "Không có dữ liệu loại vé này",
}) => {

  return (
    <>
      <div className="flex justify-between items-center">
        <GroupHeader icon="🚛" title={title} total={total || 0} />
      </div>
      <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
        {danhSachVe.map((ticket, index) => {
          const giaHienTai = getGiaVe(ticket, maBen);
          const giaMacDinh = getGiaVe(ticket, "AH");

          // Trích xuất an toàn số lượng hiển thị từ values form
          const quantityValue = String(
            values[ticket.ma_loai_ve as keyof SanLuongFormInputs] ?? "0",
          );

          // Trích xuất thông báo lỗi nếu có
          const errorKey = ticket.ma_loai_ve as keyof SanLuongFormInputs;
          const errorMessage = errors[errorKey]?.message;

          return (
            <div
              key={ticket.ma_loai_ve}
              title={`Mã vé: ${ticket.ma_loai_ve}`}
              className="group relative"
            >
              <InputSanLuong
                isFirst={index === 0}
                label={ticket.ten_loai_ve}
                price={String(giaHienTai)}
                isHighlightPrice={giaHienTai !== giaMacDinh}
                quantity={quantityValue}
                maBen={maBen}
                error={errorMessage}
                {...register(ticket.ma_loai_ve, {
                  min: 0,
                })}
              />
            </div>
          );
        })}
        {danhSachVe.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">{msgEmpty}</p>
        )}
      </div>
    </>
  );
};
