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
  BiMapPin,
  BiTrendingUp,
  BiFileBlank,
  BiUserCheck,
  BiCheckCircle,
  BiLoaderCircle,
  BiTimeFive,
} from "react-icons/bi";
import { FiDollarSign, FiLayers } from "react-icons/fi";

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

  // Định nghĩa mảng các bước hồ sơ để ánh xạ động ra giao diện Trục dọc (Timeline)
  // const quyTrinhHoSo = [
  //   {
  //     label: "I. Thông tin chung & Pháp lý ban đầu",
  //     key: "giai_doan_1",
  //     status: "success",
  //   },
  //   {
  //     label: "II. Dự toán & Thẩm tra báo cáo",
  //     key: "giai_doan_2",
  //     status: "success",
  //   },
  //   {
  //     label: "III. Phê duyệt Dự toán công trình",
  //     key: "giai_doan_3",
  //     status: "active",
  //   },
  //   {
  //     label: "IV. Thi công & Nghiệm thu hiện trường",
  //     key: "giai_doan_4",
  //     status: "pending",
  //   },
  //   {
  //     label: "V. Dự toán & Thẩm tra (Điều chỉnh nếu có)",
  //     key: "giai_doan_5",
  //     status: "pending",
  //   },
  //   {
  //     label: "VI. Phê duyệt Dự toán (Điều chỉnh)",
  //     key: "giai_doan_6",
  //     status: "pending",
  //   },
  //   {
  //     label: "VII. Quyết toán dự án hoàn thành",
  //     key: "giai_doan_7",
  //     status: "pending",
  //   },
  // ];
  // 🌟 ĐỔ DỮ LIỆU ĐỘNG TỪ API VÀO MẢNG BẰNG USEMEMO
  const quyTrinhHoSo = useMemo(() => {
    // Lấy số lượng giai đoạn hiện tại từ dữ liệu công trình (giống hook useStageLock)
    const currentStageCount = congTrinh?.giai_doan?.length || 0;

    // Mảng gốc cấu trúc tĩnh của bạn
    const baseSteps = [
      {
        label: "I. Thông tin chung",
        key: "giai_doan_1",
      },
      {
        label: "II. Dự toán & Thẩm tra",
        key: "giai_doan_2",
      },
      {
        label: "III. Phê duyệt Dự toán",
        key: "giai_doan_3",
      },
      {
        label: "IV. Thi công & Nghiệm thu",
        key: "giai_doan_4",
      },
      {
        label: "V. Dự toán & Thẩm tra (Điều chỉnh nếu có)",
        key: "giai_doan_5",
      },
      {
        label: "VI. Phê duyệt Dự toán (Điều chỉnh)",
        key: "giai_doan_6",
      },
      {
        label: "VII. Quyết toán hồ sơ ", // Bổ sung thêm cho đủ 7 mục như sidebar của bạn
        key: "giai_doan_7",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            label: "Tổng giá trị dự toán",
            value: formatMoney(
              (congTrinh?.giai_doan?.[0]?.tong_gia_tri as string) || "0",
            ),
            icon: <FiDollarSign size={20} className="text-emerald-500" />,
            bgColor: "bg-emerald-500/8",
          },
          {
            label: "Giá trị quyết toán",
            value: formatMoney(
              (congTrinh?.giai_doan?.[8]?.tong_gia_tri as string) || "0",
            ),
            icon: <BiTrendingUp size={22} className="text-blue-500" />,
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

              // Tìm giai đoạn cuối cùng trong mảng dữ liệu trả về
              const lastGiaiDoan =
                congTrinh.giai_doan[congTrinh.giai_doan.length - 1];

              // Nếu giai đoạn cuối có trạng thái hoàn thành (ví dụ: 'success' hoặc 'done')
              return lastGiaiDoan?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu
                ? "Hoàn thành"
                : "Đang tiến hành";
            })(),
            icon: (() => {
              // 1. Kiểm tra nếu chưa có dữ liệu giai đoạn, trả về rỗng để tránh lỗi
              if (!congTrinh?.giai_doan || congTrinh.giai_doan.length === 0)
                return null;

              // 2. Tìm giai đoạn cuối cùng giống hệt dòng 188
              const lastGiaiDoan =
                congTrinh.giai_doan[congTrinh.giai_doan.length - 1];

              // 3. SO SÁNH LOGIC: Nếu giai đoạn cuối là Quyết toán (Hoàn thành)
              const isFinished =
                lastGiaiDoan?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu; //

              // 4. TRẢ VỀ KÝ HIỆU ĐƯỢC CHỈ ĐỊNH
              if (isFinished) {
                // 👉 ĐỔI THÀNH DẤU TÍCH HOÀN THÀNH (Checkmark màu xanh)
                // Bạn có thể dùng Heroicons, Ant Design Icons,...
                // Ví dụ dùng BiCheckCircle từ react-icons giống BiCalendar phía trên
                // return <BiCheckCircle size={20} className="text-emerald-500" />;

                // Nếu dùng icon có sẵn dạng text để nhanh:
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
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5 font-bold text-slate-800 text-sm tracking-wide bg-slate-50/50">
              <BiFileBlank size={18} className="text-slate-400" />
              Thông tin thực hiện dự án
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Đơn vị chủ quản / Chủ đầu tư
                </span>
                <p className="font-extrabold text-slate-800 text-base">
                  {congTrinh?.don_vi_chu_quan || "Công ty Cổ phần Phà An Giang"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-400 tracking-wider">
                  Đơn vị khảo sát lập dự toán
                </span>
                <p className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                  <BiMapPin className="text-rose-500 shrink-0" size={18} />
                  {congTrinh?.giai_doan[3]?.dia_diem_tc || "Chưa xác định"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Đơn vị chủ quản / Chủ đầu tư
                </span>
                <p className="font-extrabold text-slate-800 text-base">
                  {congTrinh?.don_vi_chu_quan || "Công ty Cổ phần Phà An Giang"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Địa điểm triển khai thi công
                </span>
                <p className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                  <BiMapPin className="text-rose-500 shrink-0" size={18} />
                  {congTrinh?.giai_doan[3]?.dia_diem_tc || "Chưa xác định"}
                </p>
              </div>
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
                Toàn trình: 7 Bước
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
                style={{ width: "35%" }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2.5">
              <span className="text-[11px] font-bold text-slate-400">
                Giai đoạn hiện tại: III
              </span>
              <p className="text-xs font-black text-indigo-600">
                35% Toàn dự án
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-[10vh]"></div>
    </div>
  );
};

export default ViewDetailCongTrinh;
