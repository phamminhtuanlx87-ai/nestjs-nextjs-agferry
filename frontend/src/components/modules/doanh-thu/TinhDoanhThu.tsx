// 📂 FILE: components/ThanhTongHopDoanhThu.tsx
"use client";
import Button from "@/components/ui/Button";
import { MAPPING_BEN_PHA_FIELD } from "@/services/sanLuongService";
import { formatMoney } from "@/utils/formatnumber";
import { formatDate } from "date-fns";
import dayjs from "dayjs";
import React from "react";
import { NGAY_MAC_DINH } from "./nhap-lieu/constants/doanhThu";

interface ThanhTongHopProps {
  doanhThuNhomHanhKhach?: {
    tongDoanhThu: number;
    tongBHHK: number;
    vatThanhTien: number;
  };
  doanhThuNhomXeCacLoai?: {
    tongDoanhThu: number;
    tongBHHK: number;
    vatThanhTien: number;
  };
  doanhThuNhomThueBao?: {
    tongDoanhThu: number;
    tongBHHK: number;
    vatThanhTien: number;
  };
  doanhThuNhomVeThang?: {
    tongDoanhThu: number;
    tongBHHK: number;
    vatThanhTien: number;
  };
  doanhThuNhomVeQui?: {
    tongDoanhThu: number;
    tongBHHK: number;
    vatThanhTien: number;
  };
  doanhThuNhomVeNam?: {
    tongDoanhThu: number;
    tongBHHK: number;
    vatThanhTien: number;
  };

  doanhThuHoatDongTaiChinh?: number;
  doanhThuKhac?: number;
  isSubmitting?: boolean;
  maBen?: string;
  ngayApDung?: string;
  onSave?: () => void;
  isDirty: boolean;
}

export const ThanhTongHopDoanhThu: React.FC<ThanhTongHopProps> = ({
  doanhThuNhomHanhKhach = { tongDoanhThu: 0, tongBHHK: 0, vatThanhTien: 0 },
  doanhThuNhomXeCacLoai = { tongDoanhThu: 0, tongBHHK: 0, vatThanhTien: 0 },
  doanhThuNhomThueBao = { tongDoanhThu: 0, tongBHHK: 0, vatThanhTien: 0 },

  doanhThuNhomVeThang = { tongDoanhThu: 0, tongBHHK: 0, vatThanhTien: 0 },
  doanhThuNhomVeQui = { tongDoanhThu: 0, tongBHHK: 0, vatThanhTien: 0 },
  doanhThuNhomVeNam = { tongDoanhThu: 0, tongBHHK: 0, vatThanhTien: 0 },

  doanhThuHoatDongTaiChinh = 0,
  doanhThuKhac = 0,
  isSubmitting = false,
  maBen,
  ngayApDung,
  onSave,
  isDirty = false,
}) => {
  const dtVeLuot =
    doanhThuNhomHanhKhach?.tongDoanhThu +
    doanhThuNhomXeCacLoai?.tongDoanhThu +
    doanhThuNhomThueBao?.tongDoanhThu;
  const bhhkTongTien =
    doanhThuNhomHanhKhach?.tongBHHK +
    doanhThuNhomXeCacLoai?.tongBHHK +
    doanhThuNhomThueBao?.tongBHHK;

  const vatTongTien = Math.round(
    (doanhThuNhomHanhKhach?.vatThanhTien || 0) +
      (doanhThuNhomXeCacLoai?.vatThanhTien || 0) +
      (doanhThuNhomThueBao?.vatThanhTien || 0) +
      (doanhThuNhomVeThang?.vatThanhTien || 0) +
      (doanhThuNhomVeQui?.vatThanhTien || 0) +
      (doanhThuNhomVeNam?.vatThanhTien || 0),
  );

  const dttVeLuot =
    dtVeLuot -
    bhhkTongTien -
    ((doanhThuNhomHanhKhach?.vatThanhTien || 0) +
      (doanhThuNhomXeCacLoai?.vatThanhTien || 0) +
      (doanhThuNhomThueBao?.vatThanhTien || 0));

  const ddtVeThang =
    (doanhThuNhomVeThang.tongDoanhThu || 0) -
    (doanhThuNhomVeThang.vatThanhTien || 0);

  const ddtVeQui =
    (doanhThuNhomVeQui.tongDoanhThu || 0) -
    (doanhThuNhomVeQui.vatThanhTien || 0);

  const ddtVeNam =
    (doanhThuNhomVeNam.tongDoanhThu || 0) -
    (doanhThuNhomVeNam.vatThanhTien || 0);
    
  const doanhThuThuanTongCong = Math.round(
    dttVeLuot + ddtVeThang + ddtVeQui + ddtVeNam + doanhThuHoatDongTaiChinh,
  );
  // --- BƯỚC 2: XỬ LÝ MỐC THỜI GIAN THEO QUY ĐỊNH ---
  let ngayGhiNhan = dayjs(ngayApDung);
  const mocGioiHan = dayjs(NGAY_MAC_DINH); // Mốc quy định ngày 01/08/2026

  // Quy định nghiệp vụ: Trước 01/08/2026 là dữ liệu tháng -> Tự động bẻ ngày nhập về ngày 20 chuẩn chỉnh
  if (ngayGhiNhan.isBefore(mocGioiHan)) {
    ngayGhiNhan = ngayGhiNhan.date(20);
  }

  const finalNgayNhapStr = ngayGhiNhan.format("YYYY-MM-DD");

  return (
    <>
      {/* 📊 KHU VỰC TỔNG HỢP SỐ LIỆU PHIÊN NGÀY (CẤU TRÚC PHẲNG - CHUẨN KẾ TOÁN) */}
      <div className="mt-8 bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden mx-auto">
        {/* Header tối giản */}
        <div className="bg-slate-50 border-b border-slate-300 px-6 py-4 flex items-center justify-between ">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span>📊</span> Tổng hợp số liệu{" "}
            {MAPPING_BEN_PHA_FIELD[
              maBen as keyof typeof MAPPING_BEN_PHA_FIELD
            ] || MAPPING_BEN_PHA_FIELD.ALL}{" "}
            - phiên ngày{" "}
            {formatDate(
              finalNgayNhapStr ? new Date(finalNgayNhapStr) : new Date(),
              "dd/MM/yyyy",
            )}
          </h3>
        </div>

        <div className="p-6 space-y-6 max-w-2xl mx-auto card-soft">
          {/* 👑 HERO NUMBER: Độc quyền hiển thị Doanh thu thuần tổng cộng */}
          <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-950 shadow-inner flex flex-col justify-center items-center text-center h-30 card-soft">
            <span className="text-xl font-bold text-slate-400 uppercase tracking-widest">
              <span className="text-emerald-400">
                {MAPPING_BEN_PHA_FIELD[
                  maBen as keyof typeof MAPPING_BEN_PHA_FIELD
                ] || MAPPING_BEN_PHA_FIELD.ALL}
              </span>{" "}
              - PHIÊN NGÀY{" "}
              <span className="text-emerald-400">
                {" "}
                {formatDate(
                  finalNgayNhapStr ? new Date(finalNgayNhapStr) : new Date(),
                  "dd/MM/yyyy",
                )}
              </span>{" "}
              <br />
              DOANH THU THUẦN
            </span>
            <span className="text-4xl font-mono font-black text-emerald-400 mt-2 tracking-tight">
              {formatMoney(String(doanhThuThuanTongCong) ?? "0")}
            </span>
          </div>

          {/* 📋 BẢNG ĐỐI SOÁT CHI TIẾT THEO FORM BÁO CÁO TÀI CHÍNH */}
          <div className="border border-slate-200 rounded-xl overflow-hidden card-soft">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Dòng tiền</th>
                  <th className="py-3 px-4 text-right w-48">Giá trị (đ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <span className="font-bold ">
                      Tổng doanh thu (bao gồm VAT, Bhhk)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatMoney(
                      String(
                        doanhThuNhomHanhKhach?.tongDoanhThu +
                          doanhThuNhomXeCacLoai?.tongDoanhThu +
                          doanhThuNhomThueBao.tongDoanhThu +
                          doanhThuNhomVeThang.tongDoanhThu +
                          doanhThuNhomVeQui.tongDoanhThu +
                          doanhThuNhomVeNam.tongDoanhThu +
                          doanhThuHoatDongTaiChinh,
                      ) ?? "0",
                    )}
                  </td>
                </tr>
                {/* I. Doanh thu vé lượt */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">I. Doanh thu vé lượt</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-900">
                    {formatMoney(
                      String(
                        doanhThuNhomHanhKhach?.tongDoanhThu +
                          doanhThuNhomXeCacLoai?.tongDoanhThu +
                          doanhThuNhomThueBao?.tongDoanhThu,
                      ) ?? "0",
                    )}
                  </td>
                </tr>

                {/* Nhóm xe phân rã tham khảo (Thụt lề thụ động thụt dòng) */}
                <tr className="bg-slate-50/40 text-xs text-slate-500">
                  <td className="py-2 px-8">• Nhóm Hành khách</td>
                  <td className="py-2 px-4 text-right font-mono">
                    {formatMoney(
                      String(doanhThuNhomHanhKhach?.tongDoanhThu) ?? "0",
                    )}
                  </td>
                </tr>
                <tr className="bg-slate-50/40 text-xs text-slate-500">
                  <td className="py-2 px-8">• Nhóm Xe các loại</td>
                  <td className="py-2 px-4 text-right font-mono">
                    {formatMoney(
                      String(doanhThuNhomXeCacLoai?.tongDoanhThu) ?? "0",
                    )}
                  </td>
                </tr>
                <tr className="bg-slate-50/40 text-xs text-slate-500">
                  <td className="py-2 px-8">• Nhóm Thuê bao phà</td>
                  <td className="py-2 px-4 text-right font-mono">
                    {formatMoney(
                      String(doanhThuNhomThueBao?.tongDoanhThu) ?? "0",
                    )}
                  </td>
                </tr>

                {/* II. Nhóm  vé định kỳ */}
                <tr className="hover:bg-slate-50/50 text-slate-800">
                  <td className="py-3 px-4">II. Doanh thu theo vé định kỳ </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {formatMoney(
                      String(
                        doanhThuNhomVeThang.tongDoanhThu +
                          doanhThuNhomVeQui.tongDoanhThu +
                          doanhThuNhomVeNam.tongDoanhThu,
                      ) ?? "0",
                    )}
                  </td>
                </tr>
                <tr className="bg-slate-50/40 text-xs text-slate-500">
                  <td className="py-2 px-8">• Nhóm Vé tháng</td>
                  <td className="py-2 px-4 text-right font-mono">
                    {formatMoney(
                      String(doanhThuNhomVeThang?.tongDoanhThu) ?? "0",
                    )}
                  </td>
                </tr>
                <tr className="bg-slate-50/40 text-xs text-slate-500">
                  <td className="py-2 px-8">• Nhóm Vé quí</td>
                  <td className="py-2 px-4 text-right font-mono">
                    {formatMoney(
                      String(doanhThuNhomVeQui?.tongDoanhThu) ?? "0",
                    )}
                  </td>
                </tr>
                <tr className="bg-slate-50/40 text-xs text-slate-500">
                  <td className="py-2 px-8">• Nhóm Vé Năm</td>
                  <td className="py-2 px-4 text-right font-mono">
                    {formatMoney(
                      String(doanhThuNhomVeNam?.tongDoanhThu) ?? "0",
                    )}
                  </td>
                </tr>
                {/* V. Doanh thu ĐH Tài chính */}
                <tr className="hover:bg-slate-50/50 text-slate-900">
                  <td className="py-3 px-4">
                    V. Doanh thu hoạt động tài chính
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-900">
                    {formatMoney(String(doanhThuHoatDongTaiChinh) ?? "0")}
                  </td>
                </tr>

                {/* VI. Doanh thu khác */}
                <tr className="hover:bg-slate-50/50 text-slate-900">
                  <td className="py-3 px-4">VI. Doanh thu khác</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-900">
                    {formatMoney(String(doanhThuKhac) ?? "0")}
                  </td>
                </tr>

                {/* BHHK Khấu trừ */}
                <tr className="bg-amber-50/40 text-amber-900">
                  <td className="py-3 px-4 font-normal">
                    (-) Bảo hiểm hành khách
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                    -{formatMoney(String(bhhkTongTien) ?? "0")}
                  </td>
                </tr>
                {/* VAT Khấu trừ */}
                <tr className="bg-amber-50/40 text-amber-900">
                  <td className="py-3 px-4 font-normal">
                    (-) Thuế VAT đầu ra khấu trừ ước tính
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                    -{formatMoney(String(vatTongTien)) ?? "0"}
                  </td>
                </tr>
                <tr className="bg-amber-50/40 text-amber-900">
                  <td className="py-3 px-4 font-normal"> </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-700 w-2xs">
                    {/* Thanh hành động (Nút bấm lưu dính liền chân khối) */}
                    <div className="bg-slate-50 w-full border-t border-slate-400 rounded-lg flex justify-end ">
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={onSave}
                        disabled={isSubmitting}
                        className="px-6 py-2  text-white text-sm font-bold rounded-lg w-full"
                      >
                        {isSubmitting
                          ? "Đang xử lý..."
                          : "Xác nhận & Lưu dữ liệu"}
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            {isDirty && (
              <div className="text-white p-4 rounded-lg text-center relative overflow-hidden">
                {/* 🌟 DÒNG NHẮC NHỞ NỔI BẬT KHI CÓ THAY ĐỔI NHƯNG CHƯA BẤM LƯU */}
                <div className="absolute bottom-1 right-3 flex items-center gap-2">
                  {/* Chấm tròn hiệu ứng thở (Pulse) rất chậm và êm */}
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 duration-500"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <span className="text-xs text-amber-700 font-medium tracking-wider uppercase">
                    Số liệu có thay đổi - Chưa lưu dữ liệu!!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
