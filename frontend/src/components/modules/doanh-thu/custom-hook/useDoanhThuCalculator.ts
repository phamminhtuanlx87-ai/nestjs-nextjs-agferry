// file: custom-hook/useDoanhThuCalculator.ts

import { useMemo } from "react";
import dayjs from "dayjs";
import { TicketType, SanLuongFormInputs } from "@/services/sanLuongService";
import { parseToNumber } from "@/utils/formatnumber";
import { THUE_SUAT_MAC_DINH } from "../constants/doanhThu";

interface UseDoanhThuCalculatorProps {
  danhMucVe: TicketType[];
  values: Partial<SanLuongFormInputs>;
  maBen: string;
  ngayApDung: string;
}

interface KetQuaTinhToanNhom {
  tongDoanhThu: number;
  tongBHHK: number;
  vatThanhTien: number;
}

export function useDoanhThuCalculator({
  danhMucVe,
  values,
  maBen,
  ngayApDung,
}: UseDoanhThuCalculatorProps) {
  
  /**
   * 1. Lấy đơn giá vé Snapshot chuẩn theo bến đang chọn
   * Ưu tiên bến cụ thể, nếu không có thì lấy giá bến "CHUNG"
   */
  const layGiaVeTheoBen = useMemo(() => {
    return (ticket: TicketType, benHienTai: string): number => {
      const lichSuGanNhat = ticket.lich_su_gia?.[0];
      if (!lichSuGanNhat?.gia_theo_ben) return 0;

      const giaTheoBenObj =
        lichSuGanNhat.gia_theo_ben.find((b) => b.ma_nhom_ben === benHienTai) ||
        lichSuGanNhat.gia_theo_ben.find((b) => b.ma_nhom_ben === "CHUNG");

      return giaTheoBenObj ? Number(giaTheoBenObj.gia_ve) : 0;
    };
  }, []);

  /**
   * 2. Lấy đơn giá Bảo hiểm hành khách (BHHK) chuẩn theo năm
   * Khớp chính xác theo năm của ngày nhập liệu
   */
  const layGiaBhhkTheoNam = useMemo(() => {
    return (ticket: TicketType): number => {
      if (!ticket?.lich_su_bhhk || ticket.lich_su_bhhk.length === 0) return 0;

      const namDaChon = dayjs(ngayApDung).format("YYYY");
      const lichSuPhuHop = ticket.lich_su_bhhk.find((item) => {
        if (!item.ngay_ap_dung) return false;
        return dayjs(item.ngay_ap_dung).format("YYYY") === namDaChon;
      });

      return lichSuPhuHop ? Number(lichSuPhuHop.gia_bhhk) : 0;
    };
  }, [ngayApDung]);

  /**
   * 3. Lấy cấu hình thuế suất VAT hiện tại từ Form State
   * Nếu form chưa nhận dữ liệu, tự động rơi về cấu hình mặc định (Fallback)
   */
  const layVatTuForm = useMemo(() => {
    return (nhomKey: string): number => {
      const tenTruongForm = `thue_vat_${nhomKey.toLowerCase()}` as keyof SanLuongFormInputs;
      const thueSuatMacDinh = THUE_SUAT_MAC_DINH[nhomKey as keyof typeof THUE_SUAT_MAC_DINH] || 0;
      return Number(values[tenTruongForm]) || thueSuatMacDinh;
    };
  }, [values]);

  /**
   * 4. Hàm cốt lõi: Tính toán tổng số liệu Tài chính cho từng nhóm Vé
   * Áp dụng công thức tính VAT ngược loại bỏ hardcode 1.08 để bảo trì trên 10 năm
   */
  const tinhToanSoLieuNhom = useMemo(() => {
    return (nhomMucTieu: string): KetQuaTinhToanNhom => {
      let tongDoanhThu = 0;
      let tongBHHK = 0;

      danhMucVe.forEach((ticket) => {
        if (ticket.nhom_cha === nhomMucTieu || ticket.nhom_con === nhomMucTieu) {
          const chuoiSoLuong = String(values[ticket.ma_loai_ve as keyof SanLuongFormInputs] ?? "0");
          const soLuong = parseToNumber(chuoiSoLuong) || 0;
          
          const giaVe = layGiaVeTheoBen(ticket, maBen);
          const giaBhhk = layGiaBhhkTheoNam(ticket);

          tongDoanhThu += soLuong * giaVe;
          tongBHHK += Math.round(soLuong * giaBhhk);
        }
      });

      if (tongDoanhThu === 0) {
        return { tongDoanhThu: 0, tongBHHK: 0, vatThanhTien: 0 };
      }

      // ─── GIẢI QUYẾT BÀI TOÁN KHÔNG HARDCODE 1.08 ───
      const vatThueSuat = layVatTuForm(nhomMucTieu); // Ví dụ: 8 hoặc 10
      const doanhThuSauTruBhhk = tongDoanhThu - tongBHHK;
      
      // Tính doanh thu chưa thuế = Doanh thu sau bảo hiểm / (1 + thue_suat/100)
      const doanhThuChuaThue = doanhThuSauTruBhhk / (1 + vatThueSuat / 100);
      
      // Tiền VAT = Doanh thu chưa thuế * (thue_suat/100)
      const vatThanhTien = Math.round(doanhThuChuaThue * (vatThueSuat / 100));

      return {
        tongDoanhThu,
        tongBHHK,
        vatThanhTien,
      };
    };
  }, [danhMucVe, values, maBen, layGiaVeTheoBen, layGiaBhhkTheoNam, layVatTuForm]);

  return {
    layGiaVeTheoBen,
    layGiaBhhkTheoNam,
    tinhToanSoLieuNhom,
  };
}