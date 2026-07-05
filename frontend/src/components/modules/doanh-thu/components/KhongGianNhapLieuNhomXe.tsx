// 📂 FILE: components/modules/doanh-thu/KhongGianNhapLieuNhomXe.tsx
"use client";
import React from "react";
import { TicketType, SanLuongFormInputs } from "@/services/sanLuongService";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import InputSanLuong from "../InputComponent";

// Giả định NhomType từ hệ thống của anh, nếu chưa có hãy import đúng file định nghĩa của nó
type NhomType = "XE_KHACH" | "XE_TAI" | string;

// Định nghĩa Component tính tổng nội bộ GroupTotalTag nếu file cha của anh đang gọi nó
// (Thay đổi đường dẫn import GroupTotalTag thực tế của anh nếu cần)
interface GroupTotalTagProps {
  nhom: NhomType;
  label: string;
  tinhTongFn: (nhomKey: string) => { tongDoanhThu: number } | undefined;
}
// Nếu anh đã tách file GroupTotalTag riêng, hãy xóa đoạn component giả lập này và import file gốc vào nhé
const GroupTotalTagLocal: React.FC<GroupTotalTagProps> = ({ nhom, label, tinhTongFn }) => {
  const tongNhomCon = tinhTongFn(nhom)?.tongDoanhThu || 0;
  return (
    <div className="mt-2 flex justify-between items-center text-xs font-bold text-slate-600 bg-slate-100/50 p-2 rounded border border-slate-200/60 font-mono">
      <span>{label}:</span>
      <span className="text-indigo-600 text-sm">
        {tongNhomCon.toLocaleString("vi-VN")} đ
      </span>
    </div>
  );
};

interface KhongGianNhapLieuNhomXeProps {
  danhMucVeXe: TicketType[]; // Nhận toàn bộ danh mục vé từ file cha để tự lọc và gom nhóm
  maBen: string;
  values: Partial<SanLuongFormInputs>;
  errors: FieldErrors<SanLuongFormInputs>;
  register: UseFormRegister<SanLuongFormInputs>;
  getGiaVe: (ticket: TicketType, benHienTai: string) => number;
  tinhTongDoanhThuNhom: (nhomKey: string) => { tongDoanhThu: number } | undefined;
}

export const KhongGianNhapLieuNhomXe: React.FC<KhongGianNhapLieuNhomXeProps> = ({
  danhMucVeXe,
  maBen,
  values,
  errors,
  register,
  getGiaVe,
  tinhTongDoanhThuNhom,
}) => {
  
  // 🌟 1. ÁP DỤNG HÀM REDUCE GOM NHÓM TỰ ĐỘNG (Strict Type)
  const nhomXeGomTheoPhanDoan = danhMucVeXe
    .filter((t) => t.nhom_cha === "XE_CAC_LOAI")
    .reduce((acc: Record<string, TicketType[]>, ticket) => {
      const tenNhomCon = ticket.nhom_con || "Chưa phân loại";
      if (!acc[tenNhomCon]) acc[tenNhomCon] = [];
      acc[tenNhomCon].push(ticket);
      return acc;
    }, {});

  return (
    <div className="space-y-4 w-full">
      {Object.keys(nhomXeGomTheoPhanDoan).map((tenNhomCon) => (
        <div
          key={tenNhomCon}
          className="bg-slate-50/60 p-2 rounded-lg border border-slate-100/80"
        >
          {/* Tiêu đề nhóm con động: Xe Khách hoặc Xe Tải */}
          <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide mb-2 flex items-center gap-1">
            {tenNhomCon === "XE_KHACH" ? "🚌 Xe Khách" : "🚚 Xe Tải"}
          </h4>

          <div className="space-y-1 bg-white p-2 rounded border border-gray-100">
            {/* 🌟 2. GIỮ NGUYÊN BLOCK SORT ƯU TIÊN VÀ MAP ĐÚNG TYPE CỦA ANH */}
            {[...nhomXeGomTheoPhanDoan[tenNhomCon]]
              .sort((a, b) => {
                const bangThuTu: Record<string, number> = {
                  XK_THO_SO: 1, 
                  XK_DUOI_7C: 2, 
                  XK_TU_7C_DEN_12C: 3,
                  XK_TU_12C_DEN_16C: 4,
                  XK_TU_16C_DEN_30C: 5,
                  XK_TU_30C_DEN_45C: 6, 
                  XK_45C: 7, 
                };

                const uuTienA = bangThuTu[a.ma_loai_ve] || 99;
                const uuTienB = bangThuTu[b.ma_loai_ve] || 99;

                return uuTienA - uuTienB;
              })
              .map((ticket, index) => {
                const giaHienTai = getGiaVe(ticket, maBen);
                const giaMacDinh = getGiaVe(ticket, "AH");

                // Trích xuất an toàn value và message lỗi không dính any
                const quantityValue = String(values[ticket.ma_loai_ve as keyof SanLuongFormInputs] ?? "0");
                const errorKey = ticket.ma_loai_ve as keyof SanLuongFormInputs;
                const errorMessage = errors[errorKey]?.message;

                return (
                  <div
                    key={ticket.ma_loai_ve}
                    title={`Mã vé: ${ticket.ten_loai_ve}`}
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
                      // Đăng ký trường động an toàn với RHF
                      {...register(ticket.ma_loai_ve, {
                        min: 0,
                      })}
                    />
                  </div>
                );
              })}
          </div>

          {/* 🌟 3. THẺ TÍNH TỔNG DOANH THU NHÓM CON (XE KHÁCH / XE TẢI) */}
          <GroupTotalTagLocal
            nhom={tenNhomCon as NhomType}
            label={
              tenNhomCon === "XE_KHACH"
                ? "Doanh thu Nhóm Xe Khách"
                : "Doanh thu Nhóm Xe Tải"
            }
            tinhTongFn={tinhTongDoanhThuNhom}
          />
        </div>
      ))}
    </div>
  );
};