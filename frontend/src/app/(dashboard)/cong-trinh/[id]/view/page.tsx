"use client";
import { MA_HIEU_MAPPING } from "@/components/modules/cong-trinh/GiaiDoan";
import TieuDeCongTrinh from "@/components/modules/cong-trinh/TieuDeCongTrinh";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getCongTrinh, ICongTrinh } from "@/services/congTrinhService";
import { formatMoney } from "@/utils/formatnumber";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  BiCalendar,
  BiUserCheck,
  BiCheckCircle,
  BiLoaderCircle,
  BiTimeFive,
} from "react-icons/bi";
import {
  FiActivity,
  FiBriefcase,
  FiCheckSquare,
  FiDollarSign,
  FiExternalLink,
  FiLayers,
  FiMapPin,
} from "react-icons/fi";

const ViewDetailCongTrinh = () => {
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [congTrinh, setCongTrinh] = useState<ICongTrinh>();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getCongTrinh(id as string);
        if (!data) throw new Error("Không tìm thấy dữ liệu công trình");
        setCongTrinh(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết công trình:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  // 🌟 ĐỔ DỮ LIỆU ĐỘNG TỪ API VÀO MẢNG BẰNG USEMEMO
  const quyTrinhHoSo = useMemo(() => {
    // Lấy số lượng giai đoạn hiện tại từ dữ liệu công trình (giống hook useStageLock)
    const currentStageCount = Number(congTrinh?.giai_doan?.length) + 1 || 0;

    // Mảng gốc cấu trúc tĩnh của bạn
    const baseSteps = [
      {
        label: "I. Thông tin chung",
        key: "giai_doan_1",
      },
      {
        label: "II. Khảo sát và lập Dự toán",
        key: "giai_doan_2",
      },
      {
        label: "III. Thẩm tra dự toán",
        key: "giai_doan_3",
      },
      {
        label: "IV. Phê duyệt Dự toán",
        key: "giai_doan_4",
      },
      {
        label: "V. Thi công",
        key: "giai_doan_5",
      },
      {
        label: "VI. Nghiệm thu",
        key: "giai_doan_6",
      },
      {
        label: "VII. Dự toán (Điều chỉnh)",
        key: "giai_doan_7",
      },
      {
        label: "VIII. Thẩm tra Dự toán (Điều chỉnh nếu có)",
        key: "giai_doan_8",
      },
      {
        label: "IX. Phê duyệt Dự toán (Điều chỉnh)",
        key: "giai_doan_9",
      },
      {
        label: "X. Quyết toán hồ sơ ", // Bổ sung thêm cho đủ 7 mục như sidebar của bạn
        key: "giai_doan_10",
      },
    ];

    // Map lại trạng thái status dựa trên tiến độ thực tế
    return baseSteps.map((step, index) => {
      let status: "success" | "active" | "pending" = "pending";

      if (index < currentStageCount) {
        status = "success"; // Các giai đoạn trước đó đã hoàn thành
      } else if (index === currentStageCount) {
        status = "active"; // Giai đoạn hiện tại đang xử lý
      } else {
        status = "pending"; // Các giai đoạn tương lai đang khóa
      }

      return {
        ...step,
        status, // Ghi đè trạng thái động vào đây
      };
    });
  }, [congTrinh]);

  const lastGiaiDoan = congTrinh?.giai_doan?.at(-1);
  const totalSteps = 10;
  const currentStageCount = congTrinh?.giai_doan?.length || 0;

  // Tính toán phần trăm và giới hạn tối đa 100% bằng Math.min để tránh tràn thanh tiến độ
  const progressWidth = `${Math.min(((currentStageCount + 1) / totalSteps) * 100, 100)}%`;
  // Hàm lấy toàn bộ danh sách file đính kèm của một công trình
  // 2. Viết lại hàm với dữ liệu định hình rõ ràng, xóa bỏ hoàn toàn chữ 'any'
  const getAllFilesFromProject = (congTrinh: ICongTrinh | undefined) => {
    if (!congTrinh?.giai_doan) return [];

    // Định nghĩa mảng trả về là một mảng Object thông thường
    return congTrinh.giai_doan.reduce<
      { ten_giai_doan: string; file_name: string; file_url: string }[]
    >((acc, gd) => {
      if (gd?.file_links && gd.file_links.length > 0) {
        // 🌟 Xóa bỏ hoàn toàn "Record<string, string>" tại đây để dùng Type gốc ILinkFile
        const files = gd.file_links.map((file) => ({
          ten_giai_doan: gd.ten_giai_doan || gd.ma_hieu || "",
          file_name: file.link_name || "", // Khớp với thuộc tính của ILinkFile
          file_url: file.link_url || "", // Khớp với thuộc tính của ILinkFile
        }));

        return [...acc, ...files];
      }
      return acc;
    }, []); // Hết sạch lỗi đỏ, không dùng any
  };
  if (loading) return <LoadingScreen />;
  return (
    <div className="bg-[#f8fafc] min-h-screen antialiased text-slate-800">
      <div className="px-8 py-2">
        <nav className="text-xs text-slate-500 flex gap-2 mb-1">
          <span className="hover:text-primary cursor-pointer">
            <Link href={"/cong-trinh"}>Công trình</Link>
          </span>
          <span>/</span>
          <span className="font-medium text-slate-900">Chi tiết hồ sơ</span>
        </nav>
      </div>
      <div className="sticky top-0 z-50 bg-[#f8fafc] pt-2 pb-4">
        <TieuDeCongTrinh congTrinh={congTrinh} mode="view" />
      </div>

      {/* 2. KHỐI THỐNG KÊ SỐ LIỆU TÀI CHÍNH NHANH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {[
          {
            label: "Tổng giá trị dự toán",
            value: formatMoney(
              (congTrinh?.giai_doan?.[2]?.tong_gia_tri as string) || "0",
            ),
            icon: <FiDollarSign size={20} className="text-emerald-500" />,
            bgColor: "bg-emerald-500/8",
          },
          {
            label: "Tổng dự toán (điều chỉnh)",
            value: formatMoney(
              (congTrinh?.giai_doan?.[7]?.tong_gia_tri as string) || "0",
            ),
            value_PST: "",
            value_PSG: "",
            icon: (
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-50 text-amber-500 shrink-0">
                <div className="relative">
                  <FiDollarSign size={18} className="stroke-[2.5]" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                </div>
              </div>
            ),
            bgColor: "bg-emerald-500/8",
          },
          {
            label: "Tông hợp quyết toán",
            value: formatMoney(
              (congTrinh?.giai_doan?.[8]?.tong_gia_tri as string) || "0",
            ),
            icon: (
              <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 shadow-sm border border-indigo-200">
                {/* Icon Đồng tiền chiến thắng */}
                <FiDollarSign
                  size={14}
                  className="relative text-indigo-600 font-bold"
                />

                {/* Dấu tích nhỏ hoàn thành cam kết dính ở góc */}
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-px text-[8px] font-bold shadow-sm">
                  ✓
                </span>
              </div>
            ),
            bgColor: "bg-blue-500/8",
          },
          {
            label: "Ngày khởi tạo dự án",
            value: congTrinh?.ngay_tao_du_an
              ? new Date(congTrinh?.ngay_tao_du_an).toLocaleDateString("vi-VN")
              : "---",
            icon: <BiCalendar size={22} className="text-amber-500" />,
            bgColor: "bg-amber-500/8",
          },
          {
            label: "Trạng thái hồ sơ",
            value: (() => {
              if (!congTrinh?.giai_doan) return "Đang tải...";

              // Nếu giai đoạn cuối có trạng thái hoàn thành (ví dụ: 'success' hoặc 'done')
              return lastGiaiDoan?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu
                ? "Hoàn thành"
                : "Đang tiến hành";
            })(),
            icon: (() => {
              // 1. Kiểm tra nếu chưa có dữ liệu giai đoạn, trả về rỗng để tránh lỗi
              if (!congTrinh?.giai_doan || congTrinh.giai_doan.length === 0)
                return null;

              // 3. SO SÁNH LOGIC: Nếu giai đoạn cuối là Quyết toán (Hoàn thành)
              const isFinished =
                lastGiaiDoan?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu; //

              // 4. TRẢ VỀ KÝ HIỆU ĐƯỢC CHỈ ĐỊNH
              if (isFinished) {
                return (
                  <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 shadow-sm animate-fade-in">
                    {/* Hiệu ứng sóng lan tỏa mờ phía sau */}
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-ping duration-1000" />

                    {/* Dấu tích chính ở tâm */}
                    <span className="relative text-xl text-emerald-600 font-bold leading-none scale-110">
                      ✓
                    </span>
                  </div>
                );
              } else {
                // 👉 GIỮ NGUYÊN DẤU TRÒN CHỚP NHÁY HIỆN TẠI (Đang tiến hành)
                return (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                  </span>
                );
              }
            })(),
            bgColor: "bg-indigo-50",
            valueClass: "text-indigo-600",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-[0_4px_12px_-5px_rgba(0,0,0,0.05)] flex items-center gap-4"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.bgColor}`}
            >
              {stat.icon}
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p
                className={`text-lg font-black tracking-tight text-slate-900 ${stat.valueClass || ""}`}
              >
                {stat.value}

                {/* 3. Khu vực hiển thị biến động Tăng / Giảm tinh gọn */}
                {stat.value_PSG && stat.value_PST && (
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    {/* Badge Phát sinh TĂNG */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-semibold shadow-sm">
                      <span className="text-[13px] font-bold leading-none">
                        +
                      </span>
                      <span> {stat.value_PST ? stat.value_PST : ""}</span>
                    </div>

                    {/* Badge Phát sinh GIẢM */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-semibold shadow-sm">
                      <span className="text-[13px] font-bold leading-none">
                        -
                      </span>
                      <span> {stat.value_PSG ? stat.value_PSG : ""}</span>
                    </div>
                  </div>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. BỐ CỤC CHI TIẾT 3 CỘT VIEW-ONLY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI + GIỮA (Chiếm 2/3 không gian): Thông tin chung & Quy trình */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin chủ sở hữu / Đơn vị */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-[0_4px_12px_-5px_rgba(0,0,0,0.05)]">
            {/* Tiêu đề Khối chính */}
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100">
              <FiLayers className="text-indigo-500 w-5 h-5" />
              <h3 className="text-base font-bold text-slate-800">
                Thông tin thực hiện dự án
              </h3>
            </div>

            {/* 🌟 PHẦN 1: TÁCH BIỆT ĐƠN VỊ CHỦ QUẢN (NẰM NGANG TRÊN CÙNG) */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Đơn vị chủ quản / Chủ đầu tư
                </span>
                <span className="text-base font-bold text-indigo-900">
                  {congTrinh?.don_vi_chu_quan || "Công ty Cổ phần Phà An Giang"}
                </span>
              </div>
              {/* Có thể thêm một Badge trạng thái nhỏ ở góc này nếu cần */}
              <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
                Chủ đầu tư
              </span>
            </div>

            {/* 🌟 PHẦN 2: CHỈNH 3 CỘT CÂN ĐỐI PHÍA DƯỚI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-2">
              {/* CỘT 1: KHẢO SÁT & LẬP DỰ TOÁN */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <FiBriefcase className="text-amber-500 w-4 h-4" />
                  <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Lập Dự toán
                  </h4>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-medium">
                    Đơn vị khảo sát lập dự toán
                  </span>
                  {congTrinh?.giai_doan[0]?.ten_don_vi ? (
                    <span className="text-sm font-semibold text-slate-700">
                      {congTrinh?.giai_doan[0]?.ten_don_vi}
                    </span>
                  ) : (
                    <span className="inline-flex self-start px-2 py-0.5 rounded bg-slate-50 text-slate-400 text-xs border border-slate-200/60">
                      Chưa xác định
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-medium">
                    Đơn vị lập dự toán (Điều chỉnh)
                  </span>
                  {congTrinh?.giai_doan[5]?.ten_don_vi ? (
                    <span className="text-sm font-semibold text-slate-700">
                      {congTrinh?.giai_doan[5]?.ten_don_vi}
                    </span>
                  ) : (
                    <span className="inline-flex self-start px-2 py-0.5 rounded bg-slate-50 text-slate-400 text-xs border border-slate-200/60">
                      Chưa xác định
                    </span>
                  )}
                </div>
              </div>

              {/* CỘT 2: THẨM TRA & PHÊ DUYỆT */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <FiCheckSquare className="text-indigo-500 w-4 h-4" />
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Thẩm tra
                  </h4>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-medium">
                    Đơn vị thẩm tra dự toán
                  </span>
                  {congTrinh?.giai_doan[1]?.ten_don_vi ? (
                    <span className="text-sm font-semibold text-slate-700">
                      {congTrinh?.giai_doan[1]?.ten_don_vi}
                    </span>
                  ) : (
                    <span className="inline-flex self-start px-2 py-0.5 rounded bg-slate-50 text-slate-400 text-xs border border-slate-200/60">
                      Chưa xác định
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-medium">
                    Đơn vị thẩm tra dự toán (Điều chỉnh)
                  </span>
                  {congTrinh?.giai_doan[6]?.ten_don_vi ? (
                    <span className="text-sm font-semibold text-slate-700">
                      {congTrinh?.giai_doan[6]?.ten_don_vi}
                    </span>
                  ) : (
                    <span className="inline-flex self-start px-2 py-0.5 rounded bg-slate-50 text-slate-400 text-xs border border-slate-200/60">
                      Chưa xác định
                    </span>
                  )}
                </div>
              </div>

              {/* CỘT 3: THI CÔNG & GIÁM SÁT THỰC ĐỊA */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <FiActivity className="text-emerald-500 w-4 h-4" />
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Thi công & Giám sát
                  </h4>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-medium">
                    Đơn vị thi công
                  </span>
                  {congTrinh?.giai_doan[3]?.ten_don_vi ? (
                    <span className="text-sm font-semibold text-slate-700">
                      {congTrinh?.giai_doan[3]?.ten_don_vi}
                    </span>
                  ) : (
                    <span className="inline-flex self-start px-2 py-0.5 rounded bg-slate-50 text-slate-400 text-xs border border-slate-200/60">
                      Chưa xác định
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-medium">
                    Giám sát thi công
                  </span>
                  {congTrinh?.giai_doan[4]?.ten_don_vi ? (
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                      {congTrinh.giai_doan[4]?.ten_don_vi}
                    </span>
                  ) : (
                    <span className="inline-flex self-start px-2 py-0.5 rounded  bg-slate-50 text-slate-400 text-xs font-medium border border-amber-100">
                      Chưa xác định
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* 🌟 PHẦN 3: ĐƯA ĐỊA ĐIỂM XUỐNG DƯỚI CÙNG & TÍCH HỢP GOOGLE MAPS LINK (BOTTOM) */}
            <div className="pt-4 border-t rounded-xl bg-slate-50/70 border p-4 border-slate-100 flex flex-col gap-1.5">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <FiMapPin className="text-slate-400 w-3.5 h-3.5" /> Địa điểm
                triển khai thi công
              </span>

              {congTrinh?.giai_doan[3]?.dia_diem_tc ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(congTrinh?.giai_doan[3]?.dia_diem_tc)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors w-fit"
                >
                  <span className="underline decoration-indigo-300 underline-offset-4 group-hover:decoration-indigo-600">
                    {congTrinh?.giai_doan[3]?.dia_diem_tc}
                  </span>
                  <FiExternalLink
                    size={14}
                    className="text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0"
                  />
                </a>
              ) : (
                <span className="inline-flex self-start px-2.5 py-1 rounded bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100/70">
                  Chưa cập nhật vị trí thực địa
                </span>
              )}
            </div>
          </div>

          {/* Trục tiến độ pháp lý dọc mềm mại */}
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <FiLayers className="text-slate-400" size={18} />
                <h2 className="font-black text-slate-900 text-base tracking-tight">
                  Quy trình thực hiện công trình
                </h2>
              </div>
              <span className="text-[11px] bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold px-2.5 py-1 rounded-md">
                Quy trình: 10 Bước
              </span>
            </div>

            {/* Trục Stepper Dọc nối liền */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-3 before:bg-slate-100">
              {quyTrinhHoSo.map((step, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-between group py-1"
                >
                  {/* Điểm Neo Tròn Tương Tác Trạng Thái */}
                  <div className="absolute -left-6 z-10">
                    {step.status === "success" && (
                      <BiCheckCircle
                        size={22}
                        className="text-emerald-500 bg-white rounded-full"
                      />
                    )}
                    {step.status === "active" && (
                      <div className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-indigo-600 flex items-center justify-center">
                        <BiLoaderCircle
                          size={14}
                          className="text-indigo-600 animate-spin"
                        />
                      </div>
                    )}
                    {step.status === "pending" && (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Nội dung nhãn tên giai đoạn */}
                  <div className="pl-4">
                    <p
                      className={`text-sm font-bold tracking-tight ${
                        step.status === "success"
                          ? "text-slate-700 font-semibold"
                          : step.status === "active"
                            ? "text-indigo-600 font-black"
                            : "text-slate-400 font-normal"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>

                  {/* Nhãn Badge Trạng Thái Đi Kèm */}
                  <div>
                    {step.status === "success" && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/60">
                        Đã duyệt
                      </span>
                    )}
                    {step.status === "active" && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 animate-pulse">
                        Đang xử lý
                      </span>
                    )}
                    {step.status === "pending" && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        Chờ tới lượt
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (Chiếm 1/3 không gian): Con người phụ trách & Tiến độ tổng */}
        <div className="space-y-6">
          {/* Box nhân sự chỉ hiển thị text tĩnh */}
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] p-5">
            <h3 className="font-bold text-slate-800 text-sm tracking-wide mb-4 flex items-center gap-2">
              <BiUserCheck size={18} className="text-slate-400" />
              Người theo dõi
            </h3>
            <div className="flex items-center gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-[0_4px_10px_-2px_rgba(79,70,229,0.4)]">
                T
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-slate-800 text-sm">
                  Phạm Minh Tuấn
                </p>
                <p className="text-[11px] font-semibold text-slate-400">
                  Phó Trưởng phòng Đầu tư
                </p>
              </div>
            </div>
          </div>

          {/* Biểu đồ tiến độ tuyến tính */}
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] p-5">
            <h3 className="font-bold text-slate-800 text-sm tracking-wide mb-3 flex items-center gap-2">
              <BiTimeFive size={16} className="text-slate-400" />
              Tiến độ hoàn thiện hồ sơ
            </h3>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: progressWidth }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2.5">
              <span className="text-[11px] font-bold text-slate-400">
                Giai đoạn hiện tại:{" "}
                <span className="text-accent">
                  {" "}
                  {lastGiaiDoan?.ten_giai_doan}
                </span>
              </span>
              <p className="text-xs font-black text-indigo-600">
                {progressWidth} tiến độ công trình
              </p>
            </div>
          </div>

          {/* --- CARD DANH MỤC TÀI LIỆU (CỘT PHẢI) --- */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="text-[11px] font-bold text-slate-500">
              <div className=" bg-slate-200 border border-slate-50 rounded-2xl p-2 inline">
                {"Để xem tài liệu vui lòng đăng nhập:  "}
                <a
                  href="https://angiang.vnptioffice.vn/vpdt/main?lang=vi"
                  target="blank"
                  className="text-blue-500 italic text-sm"
                >
                  angiang.vnptioffice.vn
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                📂 Danh mục tài liệu đính kèm
              </h3>
              <span className="text-sm font-medium bg-slate-100 text-blue-500 px-2 py-0.5 rounded-full">
                {getAllFilesFromProject(congTrinh).length} files
              </span>
            </div>

            {getAllFilesFromProject(congTrinh).length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                Chưa có tệp tin nào.
              </p>
            ) : (
              <div className="space-y-4 max-h-95 overflow-y-auto pr-1">
                {/* Nhóm dữ liệu và hiển thị theo yêu cầu */}

                {Object.entries(
                  getAllFilesFromProject(congTrinh).reduce(
                    (groups: Record<string, (typeof file)[]>, file) => {
                      const groupName =
                        file.ten_giai_doan || "Chưa rõ giai đoạn";
                      if (!groups[groupName]) groups[groupName] = [];
                      groups[groupName].push(file);
                      return groups;
                    },
                    {},
                  ),
                ).map(([giaiDoan, files]) => (
                  <div key={giaiDoan} className="space-y-1.5">
                    {/* 1. Tên giai đoạn (Dòng trên) */}
                    <h4 className="text-xs font-bold text-slate-700 block">
                      {giaiDoan}
                    </h4>

                    {/* 2. Các file thuộc giai đoạn đó (Các dòng bên dưới) */}
                    <div className="pl-2 space-y-1 border-l-2 border-slate-100">
                      {files.map((file, idx) => (
                        <a
                          key={idx}
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-indigo-600 hover:text-indigo-800 hover:underline py-0.5 truncate max-w-full"
                          title={file.file_name}
                        >
                          📄 {file.file_name}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pb-[10vh]"></div>
    </div>
  );
};

export default ViewDetailCongTrinh;
