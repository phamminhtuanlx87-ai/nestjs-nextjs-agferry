// file: custom-hook/useSanLuongForm.ts

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  SanLuongFormInputs,
  TicketType,
  ChiTietSanLuongDto,
  CreateSanLuongDoanhThuDto,
  getAllDanhMuc,
  sanLuongService,
} from "@/services/sanLuongService";
import { BEN_MAC_DINH, THUE_SUAT_MAC_DINH } from "../constants/doanhThu";
import dayjs from "dayjs";

// ✨ BÍ QUYẾT: Dùng Type định nghĩa bằng phép giao và bắt buộc kiểu number (không dùng ?)
export type SanLuongFormCustomInputs = SanLuongFormInputs & {
  doanh_thu_hd_tai_chinh: number;
  doanh_thu_khac: number;
  thue_vat_hanh_khach: number;
  thue_vat_xe_cac_loai: number;
  thue_vat_thue_bao: number;
  thue_vat_ve_thang: number;
  thue_vat_ve_qui: number;
  thue_vat_ve_nam: number;
};

export function useSanLuongForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [danhMucVe, setDanhMucVe] = useState<TicketType[]>([]);
  const [maBen, setMaBen] = useState<string>(BEN_MAC_DINH);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [ngayApDung, setNgayApDung] = useState<string>(() => {
    return dayjs().format("YYYY-MM-DD");
  });

  // Truyền Type Custom đã chuẩn hóa vào useForm
  const {
    register,
    handleSubmit: runHandleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<SanLuongFormCustomInputs>({
    defaultValues: {
      doanh_thu_hd_tai_chinh: 0,
      doanh_thu_khac: 0,
      thue_vat_hanh_khach: Number(THUE_SUAT_MAC_DINH.HANH_KHACH),
      thue_vat_xe_cac_loai: Number(THUE_SUAT_MAC_DINH.XE_CAC_LOAI),
      thue_vat_thue_bao: Number(THUE_SUAT_MAC_DINH.THUE_BAO),
      thue_vat_ve_thang: Number(THUE_SUAT_MAC_DINH.VE_THANG),
      thue_vat_ve_qui: Number(THUE_SUAT_MAC_DINH.VE_QUI),
      thue_vat_ve_nam: Number(THUE_SUAT_MAC_DINH.VE_NAM),
    },
  });

  // Ép kiểu cho useWatch để lấy ra đúng định dạng dữ liệu real-time
  const values = useWatch<SanLuongFormCustomInputs>({ control }) as unknown as SanLuongFormCustomInputs || {};
  const prevNgayRef = useRef<string>("");

  const taiDanhMucVeTheoNgay = useCallback(async (ngay: string) => {
    if (prevNgayRef.current === ngay) return;
    try {
      setIsLoading(true);
      const data = await getAllDanhMuc(ngay);
      if (Array.isArray(data)) {
        setDanhMucVe(data);
        prevNgayRef.current = ngay;
      }
    } catch (error) {
      console.error("Lỗi khi kết nối API danh mục vé:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const dongBoDuLieuTuDatabase = useCallback(
    async (ngay: string, ben: string) => {
      if (!ngay || !ben) return;

      try {
        setIsLoading(true);
        const response = await sanLuongService.checkDataSanLuong(ngay, ben);

        if (response && response.statusCode === 200 && response.data) {
          setIsEditMode(true);
          setCurrentRecordId(response.data._id || null);

          const dataSanLuong = response.data;

          // Khởi tạo payload khớp hoàn toàn 100% cấu hình Type Custom mới
          const formPayload: SanLuongFormCustomInputs = {
            doanh_thu_hd_tai_chinh: Number(dataSanLuong.doanh_thu_hd_tai_chinh || 0),
            doanh_thu_khac: Number(dataSanLuong.doanh_thu_khac || 0),
            thue_vat_hanh_khach: Number(THUE_SUAT_MAC_DINH.HANH_KHACH),
            thue_vat_xe_cac_loai: Number(THUE_SUAT_MAC_DINH.XE_CAC_LOAI),
            thue_vat_thue_bao: Number(THUE_SUAT_MAC_DINH.THUE_BAO),
            thue_vat_ve_thang: Number(dataSanLuong.doanh_thu_ve_thang?.vat || THUE_SUAT_MAC_DINH.VE_THANG),
            thue_vat_ve_qui: Number(dataSanLuong.doanh_thu_ve_qui?.vat || THUE_SUAT_MAC_DINH.VE_QUI),
            thue_vat_ve_nam: Number(dataSanLuong.doanh_thu_ve_nam?.vat || THUE_SUAT_MAC_DINH.VE_NAM),
          };

          if (Array.isArray(dataSanLuong.chi_tiet_san_luong)) {
            dataSanLuong.chi_tiet_san_luong.forEach((item) => {
              if (item.ma_loai_ve) {
                // Vì formPayload kế thừa [key: string]: number nên gán trực tiếp an toàn tuyệt đối
                formPayload[item.ma_loai_ve] = Number(item.so_luot_xe || 0);
              }
            });
          }

          reset(formPayload);
        } else {
          setIsEditMode(false);
          setCurrentRecordId(null);
          reset({
            doanh_thu_hd_tai_chinh: 0,
            doanh_thu_khac: 0,
            thue_vat_hanh_khach: Number(THUE_SUAT_MAC_DINH.HANH_KHACH),
            thue_vat_xe_cac_loai: Number(THUE_SUAT_MAC_DINH.XE_CAC_LOAI),
            thue_vat_thue_bao: Number(THUE_SUAT_MAC_DINH.THUE_BAO),
            thue_vat_ve_thang: Number(THUE_SUAT_MAC_DINH.VE_THANG),
            thue_vat_ve_qui: Number(THUE_SUAT_MAC_DINH.VE_QUI),
            thue_vat_ve_nam: Number(THUE_SUAT_MAC_DINH.VE_NAM),
          });
        }
      } catch (error) {
        console.error("Lỗi tự động đồng bộ dữ liệu Form:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [reset],
  );

  useEffect(() => {
    (async () => {
      await taiDanhMucVeTheoNgay(ngayApDung);
    })();
  }, [ngayApDung, taiDanhMucVeTheoNgay]);

  useEffect(() => {
    (async () => {
      await dongBoDuLieuTuDatabase(ngayApDung, maBen);
    })();
  }, [ngayApDung, maBen, dongBoDuLieuTuDatabase]);

  const thayDoiNgayApDung = (ngayMoi: string) => {
    setNgayApDung(ngayMoi);
  };

  const thayDoiBenApDung = (benMoi: string) => {
    setMaBen(benMoi);
  };

  // Cập nhật lại kiểu dữ liệu đầu vào của hàm xử lý chuỗi số lượng vé
  const lamSachSoLuongTuForm = (maVe: string, formData: SanLuongFormCustomInputs): number => {
    const rawValue = formData[maVe];
    if (!rawValue) return 0;
    return Number(String(rawValue).replace(/\D/g, ""));
  };

  // Hàm xử lý Submit chính nhận kiểu dữ liệu custom, sạch bóng mọi chữ 'any'
  const xuLyKhiGuiForm = async (data: SanLuongFormCustomInputs) => {
    try {
      setIsLoading(true);

      const chiTietSanLuongSnapshot: ChiTietSanLuongDto[] = danhMucVe.map((ticket) => {
        const soLuongVe = lamSachSoLuongTuForm(ticket.ma_loai_ve, data);

        const lichSuGanNhat = ticket.lich_su_gia?.[0];
        const giaTheoBenObj =
          lichSuGanNhat?.gia_theo_ben?.find((b) => b.ma_nhom_ben === maBen) ||
          lichSuGanNhat?.gia_theo_ben?.find((b) => b.ma_nhom_ben === "CHUNG");
        const giaVeApDung = giaTheoBenObj ? Number(giaTheoBenObj.gia_ve) : 0;
        const bhhkDonGia = ticket.lich_su_bhhk?.[0]?.gia_bhhk || 0;

        return {
          ma_loai_ve: ticket.ma_loai_ve,
          so_luot_xe: soLuongVe,
          gia_ve_ap_dung: giaVeApDung,
          tong_doanh_thu: soLuongVe * giaVeApDung,
          bhhk_don_gia: bhhkDonGia,
          bhhk_thanh_tien: soLuongVe * bhhkDonGia,
          nhom_cha: ticket.nhom_cha as ChiTietSanLuongDto["nhom_cha"],
          nhom_con: (ticket.nhom_con || ticket.nhom_cha) as ChiTietSanLuongDto["nhom_con"],
        };
      });

      const payloadDto: CreateSanLuongDoanhThuDto = {
        ngay_nhap: ngayApDung,
        thang_nam: dayjs(ngayApDung).format("YYYY-MM"),
        ma_ben: maBen,
        chi_tiet_san_luong: chiTietSanLuongSnapshot,
        doanh_thu_hd_tai_chinh: data.doanh_thu_hd_tai_chinh, // Nhận diện chuẩn kiểu number gốc
        doanh_thu_khac: data.doanh_thu_khac,                 // Nhận diện chuẩn kiểu number gốc
        loai_du_lieu: "THUC_HIEN",
      };

      if (isEditMode && currentRecordId) {
        await sanLuongService.updateSanLuong(currentRecordId, payloadDto);
        alert(`🎉 Đã hiệu chỉnh thành công dữ liệu sản lượng ngày ${ngayApDung}!`);
      } else {
        await sanLuongService.createSanLuongDoanhThu(payloadDto);
        alert(`✨ Đã khóa sổ và tạo mới thành công sản lượng ngày ${ngayApDung}!`);
      }

    } catch (error) {
      console.error("Lỗi hệ thống trong luồng xử lý gửi dữ liệu phà:", error);
      alert("Quá trình lưu dữ liệu thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    danhMucVe,
    maBen,
    ngayApDung,
    isEditMode,
    currentRecordId,
    isDirty,
    register,
    handleSubmit: runHandleSubmit(xuLyKhiGuiForm),
    errors,
    values,
    thayDoiNgayApDung,
    thayDoiBenApDung,
    lamSachSoLuongTuForm,
  };
}