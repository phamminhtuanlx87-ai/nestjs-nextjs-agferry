"use client";
import InputSanLuong from "@/components/modules/doanh-thu/InputComponent";
import { NhomSanLuongCard } from "@/components/modules/doanh-thu/SanLuongCard";
import { ThanhTongHopDoanhThu } from "@/components/modules/doanh-thu/TinhDoanhThu";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import {
  getAllDanhMuc,
  SanLuongFormInputs,
  TicketType,
} from "@/services/sanLuongService";
import { parseToNumber } from "@/utils/formatnumber";
import { alertService } from "@/utils/swal";
import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export default function NhapLieuDoanhThuPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [danhMucVe, setDanhMucVe] = useState<TicketType[]>([]);
  const [maBen, setMaBen] = useState<string>("AH");

  // Khởi tạo ngày áp dụng mặc định là hôm nay
  const [ngayApDung, setNgayApDung] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SanLuongFormInputs>({
    defaultValues: {},
  });

  const values = useWatch<SanLuongFormInputs>({ control }) || {};
  const prevNgayRef = useRef<string>("");

  // Gọi API lấy danh mục vé khi ngày áp dụng thay đổi
  useEffect(() => {
    if (prevNgayRef.current === ngayApDung) return;

    const loadDanhMucVePha = async () => {
      setIsLoading(true);
      try {
        const data = await getAllDanhMuc(ngayApDung);
        setDanhMucVe(data);
        prevNgayRef.current = ngayApDung;

        // if (data && data.length > 0) {
        //   const defaultValues: SanLuongFormInputs = {};
        //   data.forEach((ticket) => {
        //     defaultValues[ticket._id] = 0;
        //   });
        //   reset(defaultValues);
        // }
      } catch (error) {
        console.error("Lỗi khi kết nối API danh mục vé:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDanhMucVePha();
  }, [ngayApDung, reset]);

  // Hàm phụ trợ bóc tách giá vé chuẩn theo bến
  const getGiaVe = (ticket: TicketType, benHienTai: string): number => {
    const lichSuGanNhat = ticket.lich_su_gia?.[0];
    if (!lichSuGanNhat?.gia_theo_ben) return 0;

    const giaTheoBenObj =
      lichSuGanNhat.gia_theo_ben.find((b) => b.ma_nhom_ben === benHienTai) ||
      lichSuGanNhat.gia_theo_ben.find((b) => b.ma_nhom_ben === "CHUNG");

    return giaTheoBenObj ? Number(giaTheoBenObj.gia_ve) : 0;
  };

  // Hàm tính tổng doanh thu động theo thời gian thực (Real-time)
  const tinhTongDoanhThu = () => {
    let tong = 0;

    danhMucVe.forEach((ticket) => {
      const qty = parseToNumber(String(values[ticket.ma_loai_ve])) || "0";

      const giaVe = parseToNumber(String(getGiaVe(ticket, maBen)));

      tong += Math.round((qty as number) * giaVe);
    });

    return tong;
  };

  // 1. Định nghĩa hàm xử lý khi submit thành công
  const onSubmit = async (formData: SanLuongFormInputs) => {
    try {
      setIsLoading(true);

      // 1. Duyệt qua dữ liệu từ Form để chuyển đổi sang cấu trúc API yêu cầu
      const recordsToSubmit = Object.keys(formData)
        .map((ticketId) => {
          const rawValue = formData[ticketId];
          // Ép chuỗi định dạng text (ví dụ "2.220") về dạng số nguyên (2220)
          const cleanSanLuong = rawValue
            ? Number(String(rawValue).replace(/\D/g, ""))
            : 0;

          return {
            ngay_nhap: ngayApDung, // Lấy từ state ngày trên giao diện (format YYYY-MM-DD)
            ma_ben: maBen || "AH", // Mã bến hiện tại (ví dụ: VC, AI, ...)
            ma_loai_ve: ticketId, // ID hoặc mã loại vé đăng ký trong Form key
            san_luong: cleanSanLuong,
          };
        })
        // 2. Lọc bỏ các dòng không nhập dữ liệu hoặc sản lượng bằng 0 để tránh rác Database
        .filter((record) => record.san_luong > 0);

      if (recordsToSubmit.length === 0) {
        // toast.warning("Vui lòng nhập sản lượng ít nhất cho một loại vé trước khi lưu!");
        return;
      }

      console.log(
        "🚀 Mảng dữ liệu chuẩn theo định dạng API gửi đi:",
        recordsToSubmit,
      );

      // 3. Tiến hành gọi API
      // Trường hợp A: Backend của anh hỗ trợ nhận một Mảng dữ liệu cùng lúc
      // const response = await sanLuongService.saveMultiple(recordsToSubmit);

      // Trường hợp B: Backend chỉ nhận từng Object lẻ (Gửi đồng thời bằng Promise.all)
      /*
    const apiRequests = recordsToSubmit.map(record => 
      sanLuongService.createOrUpdateSingle(record)
    );
    await Promise.all(apiRequests);
    */

      alertService.success("Cập nhật sản lượng thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi lưu sản lượng dữ liệu:", error);
      // toast.error("Có lỗi xảy ra trong quá trình lưu dữ liệu.");
    } finally {
      setIsLoading(false);
    }
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
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-md bg-white shadow-sm transition-colors"
        >
          ← Quay lại
        </button>
      </div>

      {/* FORM NHẬP LIỆU CHÍNH */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* BỘ ĐIỀU KHIỂN TRÊN ĐẦU: CHỌN NGÀY VÀ CHỌN BẾN PHÀ */}
        <div className="w-full bg-slate-100 p-4 rounded-xl border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {/* Bộ chọn Ngày */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Ngày áp dụng
                </label>
                <input
                  type="date"
                  value={ngayApDung}
                  onChange={(e) => setNgayApDung(e.target.value)}
                  className="font-bold text-base text-blue-600 border border-blue-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner mt-0.5"
                />
              </div>
            </div>

            {/* Bộ chọn Bến Phà */}
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-300 pt-3 sm:pt-0 sm:pl-4 w-full sm:w-auto">
              <span className="text-2xl">🚢</span>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Bến phà áp dụng
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

          <div className="text-xs text-slate-600 space-y-2.5 bg-white p-3 rounded-lg border border-slate-200 w-full lg:max-w-md shadow-sm">
            {/* Tiêu đề quy định */}
            <div className="flex items-center gap-1.5 font-bold text-slate-700 uppercase tracking-wide text-[11px] border-b border-slate-100 pb-1">
              <span>📋</span> Quy định nhập liệu
            </div>

            {/* Nội dung quy định chia dòng sạch sẽ */}
            <ul className="space-y-1.5 list-none pl-0 m-0 text-slate-600">
              <li className="flex items-start gap-1">
                <span className="text-blue-500 font-bold">•</span>
                <div>
                  Từ ngày{" "}
                  <span className="font-semibold text-slate-900">
                    01/08/2026
                  </span>
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
                  <span className="font-semibold text-slate-900">
                    01/08/2026
                  </span>
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
                <span className="font-medium text-amber-900">Lưu ý:</span> Giá
                vé hiển thị{" "}
                <span className="text-amber-700 font-bold bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">
                  Màu Cam
                </span>{" "}
                khi có sự khác biệt so với bến mặc định{" "}
                <strong className="text-amber-900 font-semibold">An Hòa</strong>
                .
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-sm text-gray-500">
            Đang tải danh mục vé...
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
            {/* CỘT 1: NHÓM HÀNH KHÁCH */}
            <NhomSanLuongCard title="Nhóm Hành Khách" icon="👥">
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
              </div>

              {/* CỘT 2: NHÓM XE CÁC LOẠI */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2 uppercase text-sm tracking-wider">
                  <span>🚛</span> Nhóm Xe Các Loại
                </h3>
                {Object.keys(nhomXeGomTheoPhanDoan).map((tenNhomCon) => (
                  <div
                    key={tenNhomCon}
                    className="bg-slate-50/60 p-2 rounded-lg border border-slate-100/80"
                  >
                    <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide mb-2 flex items-center gap-1">
                      {tenNhomCon === "XE_KHACH"
                        ? "🚌 Xe Khách"
                        : "🚚 Xe Tải / Xe Máy Chuyên Dùng"}
                    </h4>
                    <div className="space-y-1 bg-white p-2 rounded border border-gray-100">
                      {/* 🌟 THÊM ĐOẠN SORT NÀY VÀO TRƯỚC MAP */}
                      {[...nhomXeGomTheoPhanDoan[tenNhomCon]]
                        .sort((a, b) => {
                          const bangThuTu: { [key: string]: number } = {
                            "XK_THO_SO": 1, // Xe thô sơ lên đầu tiên
                            "XK_DUOI_7C": 2, // Xe dưới 7 chỗ tiếp theo (Anh thay mã ma_loai_ve cho đúng với DB của anh)
                            "XK_TU_7C_DEN_12C": 3,
                            "XK_TU_12C_DEN_16C": 4,
                            "XK_TU_16C_DEN_30C": 5,
                            "XK_TU_30C_DEN_45C": 6, // Xe từ 30 đến 45 ghế xếp gần cuối
                            "XK_45C": 7, // Xe từ 45 ghế trở lên bắt buộc nằm đáy (dưới cùng)
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
                  </div>
                ))}
              </div>
            </NhomSanLuongCard>

            {/* CỘT 4: NHÓM VÉ THÁNG */}
            <NhomSanLuongCard title="Nhóm Vé tháng" icon="💳">
              <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                {danhSachVeThang.map((ticket, index) => {
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
              <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2 uppercase text-sm tracking-wider mt-4">
                <span>📆</span> Nhóm Vé Quý
              </h3>
              <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                {danhSachVeQui.map((ticket, index) => {
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
              <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2 uppercase text-sm tracking-wider mt-4">
                <span>🎫</span> Nhóm Vé Năm
              </h3>
              <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                {danhSachVeNam.map((ticket, index) => {
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
              <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2 uppercase text-sm tracking-wider mt-4">
                <span>⛓️</span> Nhóm Thuê Bao Phà
              </h3>
              <div className="space-y-1 bg-white p-2 rounded border border-gray-100/60">
                {danhSachThueBao.map((ticket, index) => {
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
            </NhomSanLuongCard>
          </div>
        )}

        {/* THANH TỔNG HỢP DOANH THU & NÚT SUBMIT */}
        <ThanhTongHopDoanhThu
          tongDoanhThu={tinhTongDoanhThu()}
          isSubmitting={isLoading}
          onSave={handleSubmit(onSubmit)}
        />
      </form>
    </div>
  );
}
