"use client";
import { GroupHeader } from "@/components/modules/doanh-thu/GroupHeader";
import {
  GroupTotalTag,
  NhomType,
} from "@/components/modules/doanh-thu/GroupTotalTag";
import InputSanLuong from "@/components/modules/doanh-thu/InputComponent";
import { NhomSanLuongCard } from "@/components/modules/doanh-thu/SanLuongCard";
import { ThanhTongHopDoanhThu } from "@/components/modules/doanh-thu/TinhDoanhThu";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import {
  ChiTietDoanhThuNhomDto,
  ChiTietSanLuongDto,
  CreateSanLuongDoanhThuDto,
  getAllDanhMuc,
  MAPPING_VAT_FIELD,
  SanLuongFormInputs,
  sanLuongService,
  TicketType,
} from "@/services/sanLuongService";
import {
  formatMoney,
  formatNumberString,
  parseToNumber,
} from "@/utils/formatnumber";
import { alertService } from "@/utils/swal";
import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import VatSelectComponent from "@/components/modules/doanh-thu/VatSelectComponent";
import { NGAY_MAC_DINH } from "@/components/modules/doanh-thu/constants/doanhThu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function NhapLieuDoanhThuPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [danhMucVe, setDanhMucVe] = useState<TicketType[]>([]);
  const [maBen, setMaBen] = useState<string>("AH");
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  // Khởi tạo ngày áp dụng mặc định là hôm nay
  const [ngayApDung, setNgayApDung] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<SanLuongFormInputs>({
    defaultValues: {},
  });
  const values = useWatch<SanLuongFormInputs>({ control }) || {};
  const prevNgayRef = useRef<string>("");

  const [isCollapseVeLuot, setIsCollapseVeLuot] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  // Gọi API lấy danh mục vé khi ngày áp dụng thay đổi
  useEffect(() => {
    if (prevNgayRef.current === ngayApDung) return;

    const loadDanhMucVePha = async () => {
      setIsLoading(true);
      try {
        const data = await getAllDanhMuc(ngayApDung);
        setDanhMucVe(data);
        prevNgayRef.current = ngayApDung;
      } catch (error) {
        console.error("Lỗi khi kết nối API danh mục vé:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDanhMucVePha();
  }, [ngayApDung, reset]);

  // Hàm xử lý gọi API kiểm tra dữ liệu
  // const fetchAndCheckData = async (ngay: string, ben: string) => {
  //   try {
  //     // 1. Gọi API Backend (Axios trả về response bọc trong trường data gốc)
  //     const response = await sanLuongService.checkDataSanLuong(ngay, ben);

  //     // 2. Kiểm tra dựa trên cấu trúc mới: statusCode === 200 và có object dữ liệu bên trong
  //     if (response && response.statusCode === 200 && response.data) {
  //       // 👉 TRƯỜNG HỢP 1: CÓ DỮ LIỆU -> Chuyển sang chế độ CẬP NHẬT
  //       setIsEditMode(true);

  //       const dataSanLuong = response.data; // Đây chính là object chứa chi_tiet_san_luong

  //       // 3. Khớp mảng chi tiết an toàn không lo bug ngầm
  //       dataSanLuong.chi_tiet_san_luong.forEach((item: ChiTietSanLuongDto) => {
  //         setValue(item.ma_loai_ve, item.so_luot_xe);
  //       });
  //       setValue(
  //         "doanh_thu_hd_tai_chinh",
  //         dataSanLuong.doanh_thu_hd_tai_chinh || 0,
  //       );
  //       setValue("doanh_thu_khac", dataSanLuong.doanh_thu_khac || 0);

  //       // Điền chính xác trường dữ liệu vào form
  //     } else {
  //       // 👉 TRƯỜNG HỢP 2: KHÔNG CÓ DỮ LIỆU -> Chuyển sang chế độ THÊM MỚI
  //       setIsEditMode(false);
  //       // resetFormVeMacDinh();
  //     }
  //   } catch (error) {
  //     console.error("Lỗi xử lý đồng bộ dữ liệu form:", error);
  //   }
  // };
  // 🌟 3. Cấu hình useEffect để lắng nghe sự thay đổi của Ngày và Bến
  useEffect(() => {
    const fetchAndCheckData = async () => {
      // Nếu chưa chọn đủ ngày hoặc bến thì không chạy
      if (!ngayApDung || !maBen) return;

      try {
        setIsLoading(true);

        // 1. Gọi API check data sạch bóng any từ service
        const response = await sanLuongService.checkDataSanLuong(
          ngayApDung,
          maBen,
        );

        // 2. Kiểm tra nếu Backend phản hồi có dữ liệu tồn tại (Status 200)
        if (response && response.statusCode === 200 && response.data) {
          // 👉 BẬT CHẾ ĐỘ CẬP NHẬT
          setIsEditMode(true);
          setCurrentRecordId(response.data._id || null); // Găm _id lại để lúc ấn Submit còn biết đường Update

          // 3. Đổ dữ liệu từ mảng chi tiết của Backend vào các ô Input trên Form
          const dataSanLuong = response.data;

          if (
            dataSanLuong.chi_tiet_san_luong &&
            Array.isArray(dataSanLuong.chi_tiet_san_luong)
          ) {
            dataSanLuong.chi_tiet_san_luong.forEach((item) => {
              // setValue của react-hook-form: Đặt giá trị cho ô nhập có tên trùng với ma_loai_ve
              setValue(item.ma_loai_ve, item.so_luot_xe);
            });
            setValue(
              "doanh_thu_hd_tai_chinh",
              dataSanLuong.doanh_thu_hd_tai_chinh || 0,
            );
            setValue("doanh_thu_khac", dataSanLuong.doanh_thu_khac || 0);
            setValue(
              "thue_vat_hanh_khach",
              dataSanLuong.doanh_thu_theo_ve?.vat || 8,
            );
            setValue(
              "thue_vat_xe_cac_loai",
              dataSanLuong.doanh_thu_theo_ve?.vat || 8,
            );
            setValue(
              "thue_vat_thue_bao",
              dataSanLuong.doanh_thu_theo_ve?.vat || 8,
            );

            setValue(
              "thue_vat_ve_thang",
              dataSanLuong.doanh_thu_theo_ve?.vat || 10,
            );
            setValue(
              "thue_vat_ve_qui",
              dataSanLuong.doanh_thu_theo_ve?.vat || 10,
            );
            setValue(
              "thue_vat_ve_nam",
              dataSanLuong.doanh_thu_theo_ve?.vat || 10,
            );
          }
        } else {
          // 👉 TRƯỜNG HỢP KHÔNG CÓ DỮ LIỆU: CHUYỂN SANG CHẾ ĐỘ THÊM MỚI
          setIsEditMode(false);
          setCurrentRecordId(null);

          // Xóa toàn bộ số liệu cũ của ngày trước đó để nhân viên nhập mới hoàn toàn
          reset();
        }
      } catch (error) {
        console.error(
          "❌ Lỗi tự động đồng bộ dữ liệu Form khi đổi bộ lọc:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Kích hoạt hàm thực thi ngầm
    fetchAndCheckData();
  }, [ngayApDung, maBen, setValue, reset]);

  // Hàm phụ trợ bóc tách giá vé chuẩn theo bến
  const getGiaVe = (ticket: TicketType, benHienTai: string): number => {
    const lichSuGanNhat = ticket.lich_su_gia?.[0];
    if (!lichSuGanNhat?.gia_theo_ben) return 0;

    const giaTheoBenObj =
      lichSuGanNhat.gia_theo_ben.find((b) => b.ma_nhom_ben === benHienTai) ||
      lichSuGanNhat.gia_theo_ben.find((b) => b.ma_nhom_ben === "CHUNG");

    return giaTheoBenObj ? Number(giaTheoBenObj.gia_ve) : 0;
  };

  const getGiaBHHK = (ticket: TicketType): number => {
    if (!ticket || !ticket.lich_su_bhhk) return 0;
    if (!ticket.lich_su_bhhk || ticket.lich_su_bhhk.length === 0) return 0;

    // 1. Trích xuất năm đang chọn trên giao diện (Ví dụ: "2026")
    const selectedYear = dayjs(ngayApDung).format("YYYY");

    // 2. Tìm mốc lịch sử có năm trùng khớp hoàn toàn
    const matchedHistory = ticket.lich_su_bhhk.find((item) => {
      if (!item.ngay_ap_dung) return false;

      // Chuyển đổi an toàn về chuỗi năm bất kể là Date hay String ISO
      const historyYear = dayjs(item.ngay_ap_dung).format("YYYY");
      return historyYear === selectedYear;
    });
    // 3. Nếu tìm thấy mốc năm đó, trả về giá tiền, ngược lại trả về 0
    return matchedHistory ? Number(matchedHistory.gia_bhhk) : 0;
  };

  const getVAT = (nhom?: string): number => {
    if (!nhom) return 0;

    // 🟢 Kiểm tra xem nhom truyền vào có thực sự nằm trong danh sách key của MAPPING_VAT_FIELD không
    if (nhom in MAPPING_VAT_FIELD) {
      // Ép kiểu cụ thể để TypeScript hiểu và cho phép bốc tên trường ra
      const fieldName =
        MAPPING_VAT_FIELD[nhom as keyof typeof MAPPING_VAT_FIELD];
      return values?.[fieldName] || 0;
    }

    // Nếu truyền vào một chuỗi lạ hoắc không có trong danh sách map thì trả về 0 luôn cho an toàn
    return 0;
  };

  const tinhTongDoanhThuNhom = (nhom: string) => {
    if (!nhom) return { tongDoanhThu: 0, tongBHHK: 0, vatThanhTien: 0 };
    let tongDoanhThu = 0;
    let tongBHHK = 0;
    let vatThanhTien = 0;
    danhMucVe.forEach((ticket) => {
      // 🌟 Kiểm tra: Chỉ cần khớp nhóm cha HOẶC nhóm con là gom tiền vào luôn
      if (ticket.nhom_cha === nhom || ticket.nhom_con === nhom) {
        const qty = parseToNumber(String(values[ticket.ma_loai_ve])) || 0;
        const giaVe = parseToNumber(String(getGiaVe(ticket, maBen))) || 0;
        tongDoanhThu += qty * giaVe;

        tongBHHK += Math.round((qty as number) * getGiaBHHK(ticket));

        // Tính VAT theo nhóm cha hoặc nhóm con
      }
    });
    vatThanhTien += Math.round(
      (((tongDoanhThu - tongBHHK) / 1.08) * getVAT(nhom) || 0) / 100,
    );
    if (tongDoanhThu === 0 && tongBHHK === 0) {
      return { tongDoanhThu: 0, tongBHHK: 0, vatThanhTien: 0 };
    }

    return {
      tongDoanhThu: tongDoanhThu,
      tongBHHK: tongBHHK,
      vatThanhTien: vatThanhTien,
    };
  };

  // Phân tách danh mục dữ liệu động ra giao diện
  const danhSachHanhKhach = danhMucVe.filter(
    (t) => t.nhom_cha === "HANH_KHACH",
  );

  const nhomXeGomTheoPhanDoan = danhMucVe
    .filter((t) => t.nhom_cha === "XE_CAC_LOAI")
    .reduce((acc: { [subGroup: string]: TicketType[] }, ticket) => {
      const tenNhomCon = ticket.nhom_con || "Chưa phân loại";
      if (!acc[tenNhomCon]) acc[tenNhomCon] = [];
      acc[tenNhomCon].push(ticket);
      return acc;
    }, {});

  const danhSachThueBao = danhMucVe.filter((t) => t.nhom_cha === "THUE_BAO");
  const danhSachVeThang = danhMucVe.filter((t) => t.nhom_cha === "VE_THANG");
  const danhSachVeQui = danhMucVe.filter((t) => t.nhom_cha === "VE_QUI");
  const danhSachVeNam = danhMucVe.filter((t) => t.nhom_cha === "VE_NAM");

  const getSanLuongTuForm = (
    maVe: string,
    dataForm: SanLuongFormInputs,
  ): number => {
    const rawValue = dataForm[maVe as keyof SanLuongFormInputs];
    return rawValue ? Number(String(rawValue).replace(/\D/g, "")) : 0;
  };

  // 1. Định nghĩa hàm xử lý khi submit thành công
  const onSubmit = async (formData: SanLuongFormInputs) => {
    try {
      setIsLoading(true);
      console.time("Submit");
      // --- BƯỚC 1: LỌC VÀ ĐÓNG GÓI MẢNG CHI TIẾT SẢN LƯỢNG SẠCH THỦ CÔNG ---
      const mangChiTietSanLuong: ChiTietSanLuongDto[] = [];

      // ========================================================
      // NHÓM 1: GOM HÀNH KHÁCH (CÓ BẢO HIỂM)
      // ========================================================
      danhSachHanhKhach.forEach((ticket) => {
        const soLuot = getSanLuongTuForm(ticket.ma_loai_ve, formData);
        if (soLuot > 0) {
          const donGiaBHHK = getGiaBHHK(ticket) || 0;
          mangChiTietSanLuong.push({
            ma_loai_ve: ticket.ma_loai_ve,
            so_luot_xe: soLuot,
            nhom_cha: "HANH_KHACH",
            nhom_con: "HANH_KHACH" as const, // Fix lỗi TypeScript string
            bhhk_don_gia: donGiaBHHK,
            bhhk_thanh_tien: Math.round(soLuot * donGiaBHHK),
          });
        }
      });

      // ========================================================
      // NHÓM 2: GOM XE CÁC LOẠI (CÓ BẢO HIỂM)
      // ========================================================
      Object.keys(nhomXeGomTheoPhanDoan).forEach((subGroup) => {
        const danhSachXeTrongNhom = nhomXeGomTheoPhanDoan[subGroup];
        danhSachXeTrongNhom.forEach((ticket) => {
          const soLuot = getSanLuongTuForm(ticket.ma_loai_ve, formData);
          if (soLuot > 0) {
            const donGiaBHHK = getGiaBHHK(ticket) || 0;
            mangChiTietSanLuong.push({
              ma_loai_ve: ticket.ma_loai_ve,
              so_luot_xe: soLuot,
              nhom_cha: "XE_CAC_LOAI",
              nhom_con: (ticket.nhom_con || subGroup) as "XE_KHACH" | "XE_TAI", // Fix lỗi ép kiểu literal của DTO
              bhhk_don_gia: donGiaBHHK,
              bhhk_thanh_tien: Math.round(soLuot * donGiaBHHK),
            });
          }
        });
      });

      // ========================================================
      // NHÓM 3: GOM THUÊ BAO PHÀ (KHÔNG CÓ BẢO HIỂM - TRÁNH LỖI BACKEND)
      // ========================================================
      danhSachThueBao.forEach((ticket) => {
        const thongTinGiaNode =
          ticket.lich_su_gia &&
          (ticket.lich_su_gia[0] as unknown as { ma_loai_ve: string });
        const maVeChuan = thongTinGiaNode?.ma_loai_ve || ticket.ma_loai_ve;
        if (maVeChuan) {
          const soLuot = getSanLuongTuForm(ticket.ma_loai_ve, formData);
          if (soLuot > 0) {
            mangChiTietSanLuong.push({
              ma_loai_ve: ticket.ma_loai_ve,
              so_luot_xe: soLuot,
              nhom_cha: "THUE_BAO",
              nhom_con: "XE_KHACH" as const, // Hoặc "XE_TAI" tùy DTO quy định cho nhóm này, gán tạm literal hợp lệ để tránh đỏ code
            });
          }
        }
      });

      // ========================================================
      // NHÓM 4: GOM VÉ THÁNG Định kỳ (KHÔNG CÓ BẢO HIỂM)
      // ========================================================
      danhSachVeThang.forEach((ticket) => {
        const thongTinGiaNode =
          ticket.lich_su_gia &&
          (ticket.lich_su_gia[0] as unknown as { ma_loai_ve: string });
        const maVeChuan = thongTinGiaNode?.ma_loai_ve || ticket.ma_loai_ve;

        if (maVeChuan) {
          const soLuot = getSanLuongTuForm(maVeChuan, formData);
          if (soLuot > 0) {
            mangChiTietSanLuong.push({
              ma_loai_ve: maVeChuan,
              so_luot_xe: soLuot,
              nhom_cha: "VE_THANG",
              nhom_con: "VE_THANG" as const, // Giữ literal chuẩn của DTO
            });
          }
        }
      });

      // ========================================================
      // NHÓM 5: GOM VÉ QUÝ Định kỳ (KHÔNG CÓ BẢO HIỂM)
      // ========================================================
      danhSachVeQui.forEach((ticket) => {
        const thongTinGiaNode =
          ticket.lich_su_gia &&
          (ticket.lich_su_gia[0] as unknown as { ma_loai_ve: string });
        const maVeChuan = thongTinGiaNode?.ma_loai_ve || ticket.ma_loai_ve;

        if (maVeChuan) {
          const soLuot = getSanLuongTuForm(maVeChuan, formData);
          if (soLuot > 0) {
            mangChiTietSanLuong.push({
              ma_loai_ve: maVeChuan,
              so_luot_xe: soLuot,
              nhom_cha: "VE_QUI",
              nhom_con: "VE_QUI" as const,
            });
          }
        }
      });

      // ========================================================
      // NHÓM 6: GOM VÉ NĂM ĐỊNH KỲ
      // ========================================================
      danhSachVeNam.forEach((ticket) => {
        const thongTinGiaNode =
          ticket.lich_su_gia &&
          (ticket.lich_su_gia[0] as unknown as { ma_loai_ve: string });
        const maVeChuan = thongTinGiaNode?.ma_loai_ve || ticket.ma_loai_ve;

        if (maVeChuan) {
          const soLuot = getSanLuongTuForm(maVeChuan, formData);
          if (soLuot > 0) {
            mangChiTietSanLuong.push({
              ma_loai_ve: maVeChuan,
              so_luot_xe: soLuot,
              nhom_cha: "VE_NAM",
              nhom_con: "VE_NAM" as const,
            });
          }
        }
      });

      // Chặn hạ tầng: Nếu nhân viên quên chưa nhập bất kỳ ô sản lượng nào thì cảnh báo dừng lại
      if (mangChiTietSanLuong.length === 0) {
        alertService.warning(
          "Vui lòng nhập sản lượng của ít nhất một loại vé trước khi lưu số liệu!",
        );
        setIsLoading(false);
        return;
      }

      // --- BƯỚC 2: XỬ LÝ MỐC THỜI GIAN THEO QUY ĐỊNH ---
      let ngayGhiNhan = dayjs(ngayApDung);
      const mocGioiHan = dayjs(NGAY_MAC_DINH); // Mốc quy định ngày 01/08/2026

      // Quy định nghiệp vụ: Trước 01/08/2026 là dữ liệu tháng -> Tự động bẻ ngày nhập về ngày 20 chuẩn chỉnh
      if (ngayGhiNhan.isBefore(mocGioiHan)) {
        ngayGhiNhan = ngayGhiNhan.date(20);
      }

      const finalNgayNhapStr = ngayGhiNhan.format("YYYY-MM-DD");
      const chuoiThangNam = ngayGhiNhan.format("YYYY-MM");

      // --- BƯỚC 3: LÀM SẠCH CÁC KHOẢN DOANH THU KHÁC (BẪY STRING/FORMAT) ---
      const doanhThuHdTaiChinh = formData["doanh_thu_hd_tai_chinh"]
        ? Number(String(formData["doanh_thu_hd_tai_chinh"]).replace(/\D/g, ""))
        : 0;

      const doanhThuKhac = formData["doanh_thu_khac"]
        ? Number(String(formData["doanh_thu_khac"]).replace(/\D/g, ""))
        : 0;

      const doanhThuTheoVeLuot: ChiTietDoanhThuNhomDto = {
        dt_theo_ve: 0,
        vat: Number(formData?.thue_vat_hanh_khach) || 8, // 🌟 Thay đổi tại đây
        vat_thanh_tien: 0,
        dtt_ve: 0,
      };

      // --- BƯỚC 5: TẠO PAYLOAD ĐÚNG CHUẨN DTO ---
      const payloadToSubmit: CreateSanLuongDoanhThuDto = {
        ngay_nhap: finalNgayNhapStr,
        thang_nam: chuoiThangNam,
        ma_ben: maBen || "AH",
        chi_tiet_san_luong: mangChiTietSanLuong, // Mảng gom tay đầy đủ, không lo sót, không dính lỗi bảo hiểm
        doanh_thu_theo_ve: doanhThuTheoVeLuot,
        doanh_thu_ve_thang: {
          dt_theo_ve: 0,
          vat: Number(formData?.thue_vat_ve_thang) || 8, // 🌟 Thay đổi tại đây
          vat_thanh_tien: 0,
          dtt_ve: 0,
        },
        doanh_thu_ve_qui: {
          dt_theo_ve: 0,
          vat: Number(formData?.thue_vat_ve_qui) || 8, // 🌟 Thay đổi tại đây
          vat_thanh_tien: 0,
          dtt_ve: 0,
        },
        doanh_thu_ve_nam: {
          dt_theo_ve: 0,
          vat: Number(formData?.thue_vat_ve_nam) || 8, // 🌟 Thay đổi tại đây
          vat_thanh_tien: 0,
          dtt_ve: 0,
        },
        doanh_thu_hd_tai_chinh: doanhThuHdTaiChinh,
        doanh_thu_khac: doanhThuKhac,
        doanh_thu_thuan_tong_cong: 0,
        loai_du_lieu: "THUC_HIEN",
      };
      try {
        setIsLoading(true);

        let response;
        if (isEditMode && currentRecordId) {
          response = await sanLuongService.updateSanLuong(
            currentRecordId,
            payloadToSubmit,
          );
        } else {
          response =
            await sanLuongService.createSanLuongDoanhThu(payloadToSubmit);
        }

        // 🌟 Giải pháp: Nhặt dữ liệu thực tế (Phòng hờ Axios interceptor đã bóc tách hoặc chưa)
        const dataPhanHoi = (response?.data || response) as {
          _id?: string;
          data?: { _id?: string };
        };

        // Nếu có dữ liệu trả về tức là API đã chạy thành công (Axios tự bắt status 200/201)
        if (dataPhanHoi) {
          // 1. Hiển thị thông báo thành công chuẩn theo chế độ
          alertService.success(
            isEditMode
              ? "Cập nhật bản ghi doanh thu thành công!"
              : "Nạp mới sản lượng doanh thu thành công!",
          );

          setIsDirty(false);
          // 2. Găm lại ID bản ghi để giữ trạng thái sửa (Edit mode)
          // Kiểm tra cả cấu hình lồng data hoặc object phẳng
          console.timeEnd("Submit");
          const recordId =
            dataPhanHoi._id || dataPhanHoi.data?._id || currentRecordId;
          if (recordId) {
            setCurrentRecordId(recordId);
            setIsEditMode(true);
          }
        } else {
          // Trường hợp hiếm gặp: API chạy thành công nhưng không trả về nội dung gì
          alertService.error("Máy chủ không trả về dữ liệu cấu trúc bản ghi.");
        }
      } catch (error) {
        console.error("❌ Lỗi hệ thống khi submit:", error);
        // Bóc tách câu báo lỗi nghiệp vụ từ Backend ném về nếu có (ví dụ: lỗi trùng phiên...)
        const messageGoc = "Không thể kết nối đến máy chủ.";
        alertService.error(messageGoc);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("❌ Lỗi nghiêm trọng khi thực thi onSubmit:", error);
      alertService.error(
        "Xử lý dữ liệu thất bại! Vui lòng kiểm tra lại đường truyền mạng.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 mx-auto space-y-6 max-w-400">
      <DynamicBreadcrumb />

      {/* TIÊU ĐỀ TRANG VÀ ĐIỀU HƯỚNG */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 gap-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Cập nhật Sản lượng Doanh thu
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Nhập số liệu sản lượng doanh thu cho các bến phà một cách chính xác.
          </p>
        </div>
        <div className="text-xs text-slate-600 space-y-2.5 bg-white p-3 rounded-lg border border-slate-200 w-full md:max-w-md lg:max-w-lg  xl:max-w-xl shadow-sm">
          {/* Tiêu đề quy định */}
          <div className="flex items-center gap-1.5 font-bold text-slate-700 uppercase tracking-wide text-xs border-b border-slate-100 pb-1">
            <span>📋</span> Quy định nhập liệu
          </div>

          {/* Nội dung quy định chia dòng sạch sẽ */}
          <ul className="space-y-1.5 list-none pl-0 m-0 text-slate-600">
            <li className="flex items-start gap-1">
              <span className="text-blue-500 font-bold">•</span>
              <div>
                Từ ngày{" "}
                <span className="font-semibold text-slate-900">01/08/2026</span>
                : Nhập sản lượng & doanh thu{" "}
                <span className="font-semibold text-blue-600 bg-blue-50 px-1 rounded">
                  theo ngày
                </span>
                .
              </div>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-slate-400 font-bold">•</span>
              <div>
                Trước ngày{" "}
                <span className="font-semibold text-slate-900">01/08/2026</span>
                : Nhập dữ liệu{" "}
                <span className="font-semibold text-slate-700 bg-slate-50 px-1 rounded">
                  theo tháng
                </span>{" "}
                (hệ thống tự động ghi nhận vào{" "}
                <span className="font-semibold text-slate-800">ngày 20</span>{" "}
                của tháng đó).
              </div>
            </li>
          </ul>

          {/* Khối cảnh báo Highlight */}
          <div className="pt-1.5 border-t border-slate-100 flex items-start gap-1.5 text-amber-800 bg-amber-50/50 -mx-3 -mb-3 p-2.5 rounded-b-lg">
            <span className="shrink-0 text-amber-600 text-sm">⚠️</span>
            <p className="m-0 leading-normal">
              <span className="font-medium text-amber-900">Lưu ý:</span> Giá vé
              hiển thị{" "}
              <span className="text-amber-700 font-bold bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">
                Màu Cam
              </span>{" "}
              khi có sự khác biệt so với bến mặc định{" "}
              <strong className="text-amber-900 font-semibold">An Hòa</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* FORM NHẬP LIỆU CHÍNH */}

      {/* BỘ ĐIỀU KHIỂN TRÊN ĐẦU: CHỌN NGÀY VÀ CHỌN BẾN PHÀ */}
      <div className="w-full bg-slate-100 p-4 rounded-xl border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          {/* Bộ chọn Ngày */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Ngày nhập liệu
              </label>
              {/* <input
                  type="date"
                  value={ngayApDung}
                  onChange={(e) => setNgayApDung(e.target.value)}
                  className="font-bold text-base text-blue-600 border border-blue-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner mt-0.5"
                /> */}
              <DatePicker
                selected={dayjs(ngayApDung).toDate()}
                onChange={(date: Date | null) => {
                  if (date) {
                    setNgayApDung(dayjs(date).format("YYYY-MM-DD"));
                  }
                }}
                dateFormat="dd/MM/yyyy"
                // onChangeRaw={(e) => {
                //   e?.preventDefault();
                // }}
                minDate={dayjs("2025-01-01").toDate()}
                maxDate={dayjs().endOf("year").toDate()}
                className="font-bold text-base text-blue-600 border border-blue-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner mt-0.5"
              />
            </div>
          </div>

          {/* Bộ chọn Bến Phà */}
          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-300 pt-3 sm:pt-0 sm:pl-4 w-full sm:w-auto">
            <span className="text-2xl">🚢</span>
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Bến phà
              </label>
              <select
                value={maBen}
                onChange={(e) => setMaBen(e.target.value)}
                className="font-bold text-base text-teal-700 border border-teal-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner mt-0.5 min-w-40"
              >
                <option value="AH">Bến Phà An Hoà</option>
                <option value="OM">Bến Phà Ô Môi</option>
                <option value="TO">Bến Phà Trà Ôn</option>
                <option value="VC">Bến Phà Vàm Cống</option>
                <option value="MR">Bến Phà Mương Ranh</option>
                <option value="NG">Bến Phà Năng Gù</option>
                <option value="TG">Bến Phà Thuận Giang</option>
                <option value="TC">Bến Phà Tân Châu</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-sm text-gray-500">
          Đang tải danh mục vé...
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onChange={() => setIsDirty(true)}
            className="space-y-6 w-full"
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
              {/* CỘT 1: NHÓM HÀNH KHÁCH */}
              <NhomSanLuongCard
                title="Nhóm Hành Khách"
                icon="👥"
                total={tinhTongDoanhThuNhom("HANH_KHACH")?.tongDoanhThu || 0}
              >
                <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                  {danhSachHanhKhach.map((ticket, index) => {
                    const giaHienTai = getGiaVe(ticket, maBen);
                    const giaMacDinh = getGiaVe(ticket, "AH");
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
                          quantity={String(values[ticket.ma_loai_ve] ?? "0")} // 🌟 Đổi sang ma_loai_ve
                          maBen={maBen}
                          error={errors[ticket.ma_loai_ve]?.message} // 🌟 Đổi sang ma_loai_ve
                          {...register(ticket.ma_loai_ve, {
                            min: 0,
                          })}
                        />
                      </div>
                    );
                  })}
                  {danhSachHanhKhach.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Không có dữ liệu hành khách
                    </p>
                  )}
                  <div
                    key="vat_hanh_khach"
                    title={`Thuế VAT Hành Khách`}
                    className="group relative"
                  ></div>
                </div>

                {/* CỘT 2: NHÓM XE CÁC LOẠI */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    {/* <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2 uppercase text-sm tracking-wider">
                    <span>🚛</span> Nhóm Xe Các Loại
                  </h3> */}
                    <GroupHeader
                      icon="🚛"
                      title="Nhóm Xe Các Loại"
                      total={
                        tinhTongDoanhThuNhom("XE_CAC_LOAI")?.tongDoanhThu || 0
                      }
                    />
                  </div>
                  {Object.keys(nhomXeGomTheoPhanDoan).map((tenNhomCon) => (
                    <div
                      key={tenNhomCon}
                      className="bg-slate-50/60 p-2 rounded-lg border border-slate-100/80"
                    >
                      <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide mb-2 flex items-center gap-1">
                        {tenNhomCon === "XE_KHACH"
                          ? "🚌 Xe Khách"
                          : "🚚 Xe Tải"}
                      </h4>
                      <div className="space-y-1 bg-white p-2 rounded border border-gray-100">
                        {/* 🌟 THÊM ĐOẠN SORT NÀY VÀO TRƯỚC MAP */}
                        {[...nhomXeGomTheoPhanDoan[tenNhomCon]]
                          .sort((a, b) => {
                            const bangThuTu: { [key: string]: number } = {
                              XK_THO_SO: 1, // Xe thô sơ lên đầu tiên
                              XK_DUOI_7C: 2, // Xe dưới 7 chỗ tiếp theo (Anh thay mã ma_loai_ve cho đúng với DB của anh)
                              XK_TU_7C_DEN_12C: 3,
                              XK_TU_12C_DEN_16C: 4,
                              XK_TU_16C_DEN_30C: 5,
                              XK_TU_30C_DEN_45C: 6, // Xe từ 30 đến 45 ghế xếp gần cuối
                              XK_45C: 7, // Xe từ 45 ghế trở lên bắt buộc nằm đáy (dưới cùng)

                              XT_DUOI_3T: 8,
                              XT_TU_3T_DEN_5T: 9,
                              XT_TU_5T_DEN_7T: 10,
                              XT_TU_7T_DEN_10T: 11,
                              XT_TU_10T_DEN_15T: 12,
                              XT_TU_15T_DEN_20T: 13,
                              XT_20T_TRO_LEN: 14,
                            };

                            // 2. Lấy trọng số dựa vào ma_loai_ve. Nếu mã lạ chưa cấu hình, mặc định cho điểm là 99 (nằm cuối)
                            const uuTienA = bangThuTu[a.ma_loai_ve] || 99;
                            const uuTienB = bangThuTu[b.ma_loai_ve] || 99;

                            // 3. Sắp xếp tăng dần theo trọng số điểm
                            return uuTienA - uuTienB;
                          })
                          .map((ticket, index) => {
                            const giaHienTai = getGiaVe(ticket, maBen);
                            const giaMacDinh = getGiaVe(ticket, "AH");
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
                                  quantity={String(
                                    values[ticket.ma_loai_ve] ?? "0",
                                  )}
                                  maBen={maBen}
                                  error={errors[ticket.ma_loai_ve]?.message}
                                  {...register(ticket.ma_loai_ve, {
                                    min: 0,
                                  })}
                                />
                              </div>
                            );
                          })}
                      </div>
                      <GroupTotalTag
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
              </NhomSanLuongCard>

              {/* CỘT 4: NHÓM THUE BAO */}
              <NhomSanLuongCard
                title="Nhóm Thuê Bao Phà"
                icon="⛓️"
                total={tinhTongDoanhThuNhom("THUE_BAO")?.tongDoanhThu || 0}
              >
                {/* Nhóm thuê bao */}
                <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                  {danhSachThueBao
                    .sort((a, b) => {
                      const bangThuTu: { [key: string]: number } = {
                        TB_PHA_30T: 1, // Xe thô sơ lên đầu tiên
                        TB_PHA_60T: 2, // Xe dưới 7 chỗ tiếp theo (Anh thay mã ma_loai_ve cho đúng với DB của anh)
                        TB_PHA_100T: 3,
                        TB_PHA_200T: 4,
                      };

                      // 2. Lấy trọng số dựa vào ma_loai_ve. Nếu mã lạ chưa cấu hình, mặc định cho điểm là 99 (nằm cuối)
                      const uuTienA = bangThuTu[a.ma_loai_ve] || 99;
                      const uuTienB = bangThuTu[b.ma_loai_ve] || 99;

                      // 3. Sắp xếp tăng dần theo trọng số điểm
                      return uuTienA - uuTienB;
                    })
                    .map((ticket, index) => {
                      const giaHienTai = getGiaVe(ticket, maBen);
                      const giaMacDinh = getGiaVe(ticket, "AH");
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
                            quantity={String(values[ticket.ma_loai_ve] ?? "0")} // 🌟 Đổi sang ma_loai_ve
                            maBen={maBen}
                            error={errors[ticket.ma_loai_ve]?.message} // 🌟 Đổi sang ma_loai_ve
                            {...register(ticket.ma_loai_ve, {
                              // 🌟 Đổi sang ma_loai_ve
                              min: 0,
                            })}
                          />
                        </div>
                      );
                    })}
                  {danhSachThueBao.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Không có dữ liệu thuê bao
                    </p>
                  )}
                </div>
                {/* Nhóm vé tháng */}
                <div className="flex justify-between items-center">
                  <GroupHeader
                    icon="💳"
                    title="Nhóm Vé Tháng"
                    total={tinhTongDoanhThuNhom("VE_THANG")?.tongDoanhThu || 0}
                  />
                </div>
                <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                  {danhSachVeThang
                    .sort((a, b) => {
                      const bangThuTu: { [key: string]: number } = {
                        VE_THANG_HK: 1, // Xe thô sơ lên đầu tiên
                        VE_THANG_DUOI_7C: 2, // Xe dưới 7 chỗ tiếp theo (Anh thay mã ma_loai_ve cho đúng với DB của anh)
                        VE_THANG_TU_7C_DEN_12C: 3,
                      };

                      // 2. Lấy trọng số dựa vào ma_loai_ve. Nếu mã lạ chưa cấu hình, mặc định cho điểm là 99 (nằm cuối)
                      const uuTienA = bangThuTu[a.ma_loai_ve] || 99;
                      const uuTienB = bangThuTu[b.ma_loai_ve] || 99;

                      // 3. Sắp xếp tăng dần theo trọng số điểm
                      return uuTienA - uuTienB;
                    })
                    .map((ticket, index) => {
                      const giaHienTai = getGiaVe(ticket, maBen);
                      const giaMacDinh = getGiaVe(ticket, "AH");
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
                            quantity={String(values[ticket.ma_loai_ve] ?? "0")} // 🌟 Đổi sang ma_loai_ve
                            maBen={maBen}
                            error={errors[ticket.ma_loai_ve]?.message} // 🌟 Đổi sang ma_loai_ve
                            {...register(ticket.ma_loai_ve, {
                              // 🌟 Đổi sang ma_loai_ve
                              min: 0,
                            })}
                          />
                        </div>
                      );
                    })}
                  {danhSachVeThang.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Không có dữ liệu vé tháng
                    </p>
                  )}
                </div>

                {/* CỘT 5: NHÓM VÉ QUÝ */}

                <div className="flex justify-between items-center">
                  <GroupHeader
                    icon="📆"
                    title="Nhóm Vé Quý"
                    total={tinhTongDoanhThuNhom("VE_QUI")?.tongDoanhThu || 0}
                  />
                </div>
                <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                  {danhSachVeQui
                    .sort((a, b) => {
                      const bangThuTu: { [key: string]: number } = {
                        VE_QUI_HK: 1, // Xe thô sơ lên đầu tiên
                        VE_QUI_DUOI_7C: 2, // Xe dưới 7 chỗ tiếp theo (Anh thay mã ma_loai_ve cho đúng với DB của anh)
                        VE_QUI_TU_7C_DEN_12C: 3,
                      };

                      // 2. Lấy trọng số dựa vào ma_loai_ve. Nếu mã lạ chưa cấu hình, mặc định cho điểm là 99 (nằm cuối)
                      const uuTienA = bangThuTu[a.ma_loai_ve] || 99;
                      const uuTienB = bangThuTu[b.ma_loai_ve] || 99;

                      // 3. Sắp xếp tăng dần theo trọng số điểm
                      return uuTienA - uuTienB;
                    })
                    .map((ticket, index) => {
                      const giaHienTai = getGiaVe(ticket, maBen);
                      const giaMacDinh = getGiaVe(ticket, "AH");
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
                            quantity={String(values[ticket.ma_loai_ve] ?? "0")} // 🌟 Đổi sang ma_loai_ve
                            maBen={maBen}
                            error={errors[ticket.ma_loai_ve]?.message} // 🌟 Đổi sang ma_loai_ve
                            {...register(ticket.ma_loai_ve, {
                              // 🌟 Đổi sang ma_loai_ve
                              min: 0,
                            })}
                          />
                        </div>
                      );
                    })}
                  {danhSachVeQui.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Không có dữ liệu vé quý
                    </p>
                  )}
                </div>

                {/* CỘT 6: NHÓM VÉ NĂM */}

                <div className="flex justify-between items-center">
                  <GroupHeader
                    icon="🎫"
                    title="Nhóm Vé Năm"
                    total={tinhTongDoanhThuNhom("VE_NAM")?.tongDoanhThu || 0}
                  />
                </div>
                <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                  {danhSachVeNam
                    .sort((a, b) => {
                      const bangThuTu: { [key: string]: number } = {
                        VE_NAM_HK: 1, // Xe thô sơ lên đầu tiên
                        VE_NAM_DUOI_7C: 2, // Xe dưới 7 chỗ tiếp theo (Anh thay mã ma_loai_ve cho đúng với DB của anh)
                        VE_NAM_TU_7C_DEN_12C: 3,
                      };

                      // 2. Lấy trọng số dựa vào ma_loai_ve. Nếu mã lạ chưa cấu hình, mặc định cho điểm là 99 (nằm cuối)
                      const uuTienA = bangThuTu[a.ma_loai_ve] || 99;
                      const uuTienB = bangThuTu[b.ma_loai_ve] || 99;

                      // 3. Sắp xếp tăng dần theo trọng số điểm
                      return uuTienA - uuTienB;
                    })
                    .map((ticket, index) => {
                      const giaHienTai = getGiaVe(ticket, maBen);
                      const giaMacDinh = getGiaVe(ticket, "AH");
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
                            quantity={String(values[ticket.ma_loai_ve] ?? "0")} // 🌟 Đổi sang ma_loai_ve
                            maBen={maBen}
                            error={errors[ticket.ma_loai_ve]?.message} // 🌟 Đổi sang ma_loai_ve
                            {...register(ticket.ma_loai_ve, {
                              // 🌟 Đổi sang ma_loai_ve
                              min: 0,
                            })}
                          />
                        </div>
                      );
                    })}
                  {danhSachVeNam.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Không có dữ liệu vé năm
                    </p>
                  )}
                </div>

                {/* 📝 KHỐI NHẬP LIỆU DOANH THU */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 📝 KHỐI NHẬP LIỆU DOANH THU HĐ TÀI CHÍNH */}
                  <div>
                    <div className="flex justify-between items-center">
                      <GroupHeader
                        icon="📈"
                        title="Doanh thu hoạt động tài chính"
                      />
                    </div>
                    <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                      <div
                        title="Doanh thu hoạt động tài chính"
                        className="group relative max-w-80"
                      >
                        <input
                          type="text"
                          placeholder="0"
                          className="w-full input-primary text-right"
                          value={
                            values["doanh_thu_hd_tai_chinh"]
                              ? formatNumberString(
                                  String(values["doanh_thu_hd_tai_chinh"]),
                                )
                              : ""
                          }
                          onChange={(e) => {
                            const rawNum = e.target.value.replace(/\D/g, "");
                            const numValue = rawNum ? Number(rawNum) : 0;
                            setValue("doanh_thu_hd_tai_chinh", numValue, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* 📝 KHỐI NHẬP LIỆU DOANH THU KHÁC */}
                  <div>
                    <div className="flex justify-between items-center">
                      <GroupHeader icon="💰" title="Doanh thu khác" />
                    </div>
                    <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                      <div
                        title="Doanh thu khác"
                        className="group relative max-w-80"
                      >
                        <input
                          type="text"
                          placeholder="0"
                          className="w-full input-primary text-right"
                          value={
                            values["doanh_thu_khac"]
                              ? formatNumberString(
                                  String(values["doanh_thu_khac"]),
                                )
                              : ""
                          }
                          onChange={(e) => {
                            const rawNum = e.target.value.replace(/\D/g, "");
                            const numValue = rawNum ? Number(rawNum) : 0;
                            setValue("doanh_thu_khac", numValue, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </NhomSanLuongCard>
            </div>
            {/* 🧾 CARD LỚN: CẤU HÌNH THUẾ VAT & BẢO HIỂM HÀNH KHÁCH */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ---------------- CỘT TRÁI: KHU VỰC THUẾ VAT ---------------- */}
              <div className="space-y-4 border-r border-gray-100 pr-0 lg:pr-6">
                <div className="flex justify-between items-center">
                  <GroupHeader
                    icon="💰"
                    title="Cấu hình & Thành tiền Thuế VAT"
                  />
                </div>

                {/* ================= NHÓM 1: VAT THEO VÉ LƯỢT ================= */}
                <div className="bg-slate-50/60 p-3 rounded-xl border border-gray-200/50 space-y-2">
                  <div
                    onClick={() => setIsCollapseVeLuot(!isCollapseVeLuot)}
                    className="flex items-center justify-between pb-1 border-b border-gray-200/60 cursor-pointer hover:opacity-80 select-none transition-opacity"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] text-slate-400 transition-transform duration-200 block ${isCollapseVeLuot ? "" : "rotate-90"}`}
                      >
                        ▶
                      </span>
                      <span className="text-xs">🎟️</span>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        VAT theo vé lượt
                      </h4>
                    </div>
                    <div className="text-sm font-extrabold text-amber-600 font-mono pr-1 bg-amber-50/60 px-2 py-0.5 rounded border border-amber-100 shadow-sm">
                      Tổng VAT:{" "}
                      {formatMoney(
                        String(
                          (tinhTongDoanhThuNhom("HANH_KHACH")?.vatThanhTien ||
                            0) +
                            (tinhTongDoanhThuNhom("XE_CAC_LOAI")
                              ?.vatThanhTien || 0) +
                            (tinhTongDoanhThuNhom("THUE_BAO")?.vatThanhTien ||
                              0),
                        ),
                      )}
                    </div>
                  </div>

                  <div
                    className={`space-y-1 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 ${
                      isCollapseVeLuot
                        ? "max-h-0 p-0 border-0 shadow-none"
                        : "max-h-125 p-2"
                    }`}
                  >
                    <VatSelectComponent
                      label="Thuế VAT nhóm Hành Khách"
                      value={Number(values?.thue_vat_hanh_khach) || 8}
                      {...register("thue_vat_hanh_khach", {
                        valueAsNumber: true,
                      })}
                      vatThanhTien={
                        tinhTongDoanhThuNhom("HANH_KHACH")?.vatThanhTien || 0
                      }
                    />
                    <VatSelectComponent
                      label="Thuế VAT nhóm Xe Các Loại"
                      value={Number(values?.thue_vat_xe_cac_loai) || 8}
                      {...register("thue_vat_xe_cac_loai", {
                        valueAsNumber: true,
                      })}
                      vatThanhTien={
                        tinhTongDoanhThuNhom("XE_CAC_LOAI")?.vatThanhTien || 0
                      }
                    />
                    <VatSelectComponent
                      label="Thuế VAT nhóm Thuê Bao"
                      value={Number(values?.thue_vat_thue_bao) || 8}
                      {...register("thue_vat_thue_bao", {
                        valueAsNumber: true,
                      })}
                      vatThanhTien={
                        tinhTongDoanhThuNhom("THUE_BAO")?.vatThanhTien || 0
                      }
                    />
                  </div>
                </div>

                {/* ================= NHÓM 2: VAT THEO VÉ ĐỊNH KỲ ================= */}
                <div className="bg-slate-50/60 p-3 rounded-xl border border-gray-200/50 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-gray-200/60">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">📅</span>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        VAT theo vé định kỳ
                      </h4>
                    </div>
                    <div className="text-sm font-extrabold text-amber-600 font-mono pr-1 bg-amber-50/60 px-2 py-0.5 rounded border border-amber-100 shadow-sm">
                      Tổng VAT:{" "}
                      {formatMoney(
                        String(
                          (tinhTongDoanhThuNhom("VE_THANG")?.vatThanhTien ||
                            0) +
                            (tinhTongDoanhThuNhom("VE_QUI")?.vatThanhTien ||
                              0) +
                            (tinhTongDoanhThuNhom("VE_NAM")?.vatThanhTien || 0),
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                    <VatSelectComponent
                      label="Thuế VAT nhóm Vé Tháng"
                      value={Number(values?.thue_vat_ve_thang) || 8}
                      {...register("thue_vat_ve_thang", {
                        valueAsNumber: true,
                      })}
                      vatThanhTien={
                        tinhTongDoanhThuNhom("VE_THANG")?.vatThanhTien || 0
                      }
                    />
                    <VatSelectComponent
                      label="Thuế VAT nhóm Vé Quí"
                      value={Number(values?.thue_vat_ve_qui) || 8}
                      {...register("thue_vat_ve_qui", { valueAsNumber: true })}
                      vatThanhTien={
                        tinhTongDoanhThuNhom("VE_QUI")?.vatThanhTien || 0
                      }
                    />
                    <VatSelectComponent
                      label="Thuế VAT nhóm Vé Năm"
                      value={Number(values?.thue_vat_ve_nam) || 8}
                      {...register("thue_vat_ve_nam", { valueAsNumber: true })}
                      vatThanhTien={
                        tinhTongDoanhThuNhom("VE_NAM")?.vatThanhTien || 0
                      }
                    />
                  </div>
                </div>
                {/* Tổng cộng toàn bộ tiền BHHK phiên làm việc */}
                <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-lg flex justify-between items-center mt-4 shadow-sm">
                  <span className="text-xs font-bold uppercase  text-amber-600 tracking-wider flex items-center gap-1">
                    <span>💰</span> Tổng cộng tiền VAT phiên:
                  </span>
                  <span className="text-base font-black  text-amber-600 font-mono bg-white px-3 py-1 rounded-md border border-blue-200 shadow-sm">
                    {formatMoney(
                      String(
                        (tinhTongDoanhThuNhom("HANH_KHACH")?.vatThanhTien ||
                          0) +
                          (tinhTongDoanhThuNhom("XE_CAC_LOAI")?.vatThanhTien ||
                            0) +
                          (tinhTongDoanhThuNhom("THUE_BAO")?.vatThanhTien ||
                            0) +
                          (tinhTongDoanhThuNhom("VE_THANG")?.vatThanhTien ||
                            0) +
                          (tinhTongDoanhThuNhom("VE_QUI")?.vatThanhTien || 0) +
                          (tinhTongDoanhThuNhom("VE_NAM")?.vatThanhTien || 0),
                      ),
                    )}{" "}
                  </span>
                </div>
              </div>

              {/* ---------------- CỘT PHẢI: KHU VỰC BẢO HIỂM HÀNH KHÁCH (BHHK) ---------------- */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <GroupHeader icon="🛡️" title="Bảo hiểm hành khách (BHHK)" />
                </div>

                <div className="bg-slate-50/60 p-3 rounded-xl border border-gray-200/50 flex-1 flex flex-col justify-between min-h-77.5">
                  {/* Danh sách các nhóm BHHK theo Vé lượt */}
                  <div className="space-y-1 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                    {/* 1. Nhóm Hành Khách */}
                    <div className="flex justify-between items-center px-3 py-2.5 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🔹</span>
                        <span className="text-sm text-gray-600 font-medium">
                          BHHK nhóm Hành Khách
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm text-blue-600 bg-blue-50/40 px-2 py-0.5 rounded border border-blue-100/50">
                        {formatMoney(
                          String(
                            tinhTongDoanhThuNhom("HANH_KHACH")?.tongBHHK || 0,
                          ),
                        )}
                      </span>
                    </div>

                    {/* 2. Nhóm Xe Các Loại */}
                    <div className="flex justify-between items-center px-3 py-2.5 border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🔹</span>
                        <span className="text-sm text-gray-600 font-medium">
                          BHHK nhóm Xe Các Loại
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm text-blue-600 bg-blue-50/40 px-2 py-0.5 rounded border border-blue-100/50">
                        {formatMoney(
                          String(
                            tinhTongDoanhThuNhom("XE_CAC_LOAI")?.tongBHHK || 0,
                          ),
                        )}
                      </span>
                    </div>

                    {/* 3. Nhóm Thuê Bao */}
                    <div className="flex justify-between items-center px-3 py-2.5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🔹</span>
                        <span className="text-sm text-gray-600 font-medium">
                          BHHK nhóm Thuê Bao
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm text-blue-600 bg-blue-50/40 px-2 py-0.5 rounded border border-blue-100/50">
                        {formatMoney(
                          String(
                            tinhTongDoanhThuNhom("THUE_BAO")?.tongBHHK || 0,
                          ),
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Tổng cộng toàn bộ tiền BHHK phiên làm việc */}
                <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-lg flex justify-between items-center mt-4 shadow-sm">
                  <span className="text-xs font-bold uppercase text-blue-700 tracking-wider flex items-center gap-1">
                    <span>🛡️</span> Tổng cộng tiền BHHK phiên:
                  </span>
                  <span className="text-base font-black text-blue-700 font-mono bg-white px-3 py-1 rounded-md border border-blue-200 shadow-sm">
                    {formatMoney(
                      String(
                        (tinhTongDoanhThuNhom("HANH_KHACH")?.tongBHHK || 0) +
                          (tinhTongDoanhThuNhom("XE_CAC_LOAI")?.tongBHHK || 0) +
                          (tinhTongDoanhThuNhom("THUE_BAO")?.tongBHHK || 0),
                      ),
                    )}{" "}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </>
      )}

      {/* THANH TỔNG HỢP DOANH THU & NÚT SUBMIT */}
      <ThanhTongHopDoanhThu
        doanhThuNhomHanhKhach={tinhTongDoanhThuNhom("HANH_KHACH") || 0}
        doanhThuNhomXeCacLoai={tinhTongDoanhThuNhom("XE_CAC_LOAI") || 0}
        doanhThuNhomThueBao={tinhTongDoanhThuNhom("THUE_BAO") || 0}
        doanhThuHoatDongTaiChinh={Number(values["doanh_thu_hd_tai_chinh"]) || 0}
        doanhThuNhomVeThang={tinhTongDoanhThuNhom("VE_THANG") || 0}
        doanhThuNhomVeQui={tinhTongDoanhThuNhom("VE_QUI") || 0}
        doanhThuNhomVeNam={tinhTongDoanhThuNhom("VE_NAM") || 0}
        doanhThuKhac={Number(values["doanh_thu_khac"]) || 0}
        isSubmitting={isLoading}
        maBen={maBen}
        ngayApDung={ngayApDung}
        onSave={handleSubmit(onSubmit)}
        isDirty={isDirty}
      />
    </div>
  );
}
