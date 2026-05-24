"use client";
import React, { useEffect, useState } from "react";
import { TongQuanForm } from "./giai-doan/TongQuanForm";
import { GiaiDoanDto, ProjectFormData } from "./ProjectFormData";
import { FormProvider, useForm } from "react-hook-form";
import {
  ICongTrinh,
  ILinkFile,
  UpdateCongtrinhRequest,
  updateProject,
} from "@/services/congTrinhService";
import { alertService } from "@/utils/swal";
import { CongTrinhProvider } from "@/context/CongTrinhContext";
import { DuToanForm } from "./giai-doan/DuToanForm";
import { parseToNumber } from "@/utils/formatnumber";
import { MA_HIEU_MAPPING } from "./GiaiDoan";
import { useRouter } from "next/navigation";
import PDDuToanForm from "./giai-doan/PDDuToanForm";
import ThiCongForm from "./giai-doan/ThiCongForm";
import DuToanPSForm from "./giai-doan/DuToanPSForm";
import PDDuToanPSForm from "./giai-doan/PDDuToanPSForm";
import QuyetToanForm from "./giai-doan/QuyetToanForm";
import { CongTrinhSiderbar } from "./CongTrinhSiderbar";
import axios from "axios";
import TieuDeCongTrinh from "./TieuDeCongTrinh";
import Link from "next/link";

interface Props {
  congTrinh: ICongTrinh; // Sử dụng interface bạn đã định nghĩa
}
const OPTIONS_DU_TOAN = [
  { value: "KTC", label: "Cty CP Tư vấn Xây dựng giao thông KTC" },
  { value: "SR", label: "Cty TNHH Thiết kế Soài Rạp" },
  { value: "TNB", label: "Cty TNHH Tư vấn Xây dựng Tây Nam Bộ" },
  { value: "TP", label: "Cty TNHH TV Thiết kế Xây dựng Trường Phú" },
  { value: "XNCK", label: "XN Cơ khí Giao thông" },
  { value: "PKT", label: "Phòng Kỹ thuật - Vật tư" },
  {
    value: "HHTN",
    label: "Cty TNHH Xây Dựng Thương Mại Công Nghiệp Hàng Hải Tây Nam",
  },
  { value: "TL", label: "Cty TNHH Thiết kế Công nghiệp Thắng Lợi" },
  { value: "PDT", label: "Phòng Đầu tư" },
  { value: "IQ", label: "Cty TNHH Tư vấn Giao thông IQ" },
];

const GIAI_DOAN_SiDER = [
  { id: "thong-tin-chung", label: "I. Thông tin chung" },
  { id: "du-toan", label: "II. Dự toán & Thẩm tra" },
  { id: "pd-du-toan", label: "III. Phê duyệt Dự toán" },
  { id: "thi-cong", label: "IV. Thi công & Nghiệm thu" },
  { id: "du-toan-ps", label: "V. Dự toán & Thẩm tra (Điều chỉnh)" },
  { id: "pd-du-toan-ps", label: "VI. Phê duyệt Dự toán (Điều chỉnh))" },
  { id: "quyet-toan", label: "VII. Quyết toán" },
];

export default function CapNhatCongTrinhFrom({ congTrinh }: Props) {
  const router = useRouter();
  // const [data, setData] = useState();
  // 1. Khởi tạo state từ props
  const [localCongTrinh, setLocalCongTrinh] = useState(congTrinh);

  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  // Khai báo công cụ quản lý form
  const methods = useForm<ProjectFormData>({
    defaultValues: {
      ma_cong_trinh: congTrinh?.ma_cong_trinh || "",
      ten_cong_trinh: congTrinh?.ten_cong_trinh || "",
      don_vi_chu_quan: congTrinh?.don_vi_chu_quan || "",
      ngay_tao_du_an: congTrinh?.ngay_tao_du_an || "",
      giai_doan: congTrinh?.giai_doan
        ? congTrinh.giai_doan.map((gd) => ({
            ...gd,
            so_ngay_tc_pgv:
              gd.so_ngay_tc_pgv !== undefined && gd.so_ngay_tc_pgv !== null
                ? String(gd.so_ngay_tc_pgv)
                : "",
            so_ngay_tc_thuc_te:
              gd.so_ngay_tc_thuc_te !== undefined &&
              gd.so_ngay_tc_thuc_te !== null
                ? String(gd.so_ngay_tc_thuc_te)
                : "",
          }))
        : [
            {
              ma_hieu: "",
              ngay_thuc_hien: "",
              tong_gia_tri: "",
              chi_phi_xay_dung: "",
              ma_don_vi: "",
              so_ngay_tc_pgv: "",
              dia_diem_tc: "",
            },
          ],
    },
  });

  const { reset, handleSubmit } = methods;
  const [giaiDoans, setGiaiDoans] = useState<GiaiDoanDto[]>();

  useEffect(() => {
    if (congTrinh?.giai_doan) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGiaiDoans(
        congTrinh.giai_doan.map((gd) => ({
          ...gd,
          so_ngay_tc_pgv:
            gd.so_ngay_tc_pgv !== undefined && gd.so_ngay_tc_pgv !== null
              ? String(gd.so_ngay_tc_pgv)
              : "",
          so_ngay_tc_thuc_te:
            gd.so_ngay_tc_thuc_te !== undefined &&
            gd.so_ngay_tc_thuc_te !== null
              ? String(gd.so_ngay_tc_thuc_te)
              : "",
        })),
      );
      setLocalCongTrinh(congTrinh);
    }
  }, [congTrinh]);

  useEffect(() => {
    if (congTrinh) {
      reset({
        ...congTrinh,
        // Ép định dạng ngày về YYYY-MM-DD để input date hiểu được
        ngay_tao_du_an: congTrinh.ngay_tao_du_an
          ? congTrinh.ngay_tao_du_an.split("T")[0]
          : "",

        giai_doan: congTrinh.giai_doan.map((gd) => ({
          ...gd,
          ngay_thuc_hien: gd.ngay_thuc_hien
            ? gd.ngay_thuc_hien.split("T")[0]
            : "",
          ngay_hoan_thanh: gd.ngay_hoan_thanh
            ? gd.ngay_hoan_thanh.split("T")[0]
            : "",
          tong_gia_tri: gd.tong_gia_tri?.toLocaleString("vi-VN") ?? "",
          chi_phi_xay_dung: gd.chi_phi_xay_dung?.toLocaleString("vi-VN") ?? "",
          so_ngay_tc_pgv:
            gd.so_ngay_tc_pgv !== undefined && gd.so_ngay_tc_pgv !== null
              ? String(gd.so_ngay_tc_pgv)
              : "",
          so_ngay_tc_thuc_te:
            gd.so_ngay_tc_thuc_te !== undefined &&
            gd.so_ngay_tc_thuc_te !== null
              ? String(gd.so_ngay_tc_thuc_te)
              : "",
          chenh_lech_tgt:
            gd.chenh_lech_tgt !== undefined && gd.chenh_lech_tgt !== null
              ? String(gd.chenh_lech_tgt)
              : "",
          chenh_lech_cpxd:
            gd.chenh_lech_cpxd !== undefined && gd.chenh_lech_cpxd !== null
              ? String(gd.chenh_lech_cpxd)
              : "",
          dia_diem_tc:
            gd.dia_diem_tc !== undefined && gd.dia_diem_tc !== null
              ? String(gd.dia_diem_tc)
              : "",
        })),
      });
    }
  }, [congTrinh, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    // Tạo payload khớp với class ProjectRequest ở Backend
    const payload: UpdateCongtrinhRequest = {
      ma_cong_trinh: congTrinh?.ma_cong_trinh || "",
      ten_cong_trinh: data.ten_cong_trinh || "",
      don_vi_chu_quan: data.don_vi_chu_quan || "Cty Cổ phần Phà An Giang",
      ngay_tao_du_an: data.ngay_tao_du_an,
      giai_doan: data.giai_doan
        ?.filter((gd) => {
          const hasName = gd.ten_giai_doan && gd.ten_giai_doan.trim() !== "";
          const price = gd.tong_gia_tri ? Number(gd.tong_gia_tri) : 0;
          const hasPrice = price > 0;
          const hasDate = gd.ngay_thuc_hien && gd.ngay_thuc_hien.trim() !== "";
          return hasName || hasPrice || hasDate;
        })
        .map((gd, index) => {
          // Xác định mã hiệu của giai đoạn hiện tại

          const currentMaHieu =
            MA_HIEU_MAPPING[index]?.ma_hieu || gd.ma_hieu || "";
          // Hàm helper để đảm bảo chuỗi ngày hợp lệ hoặc null
          const formatDate = (dateStr: string | undefined) => {
            if (!dateStr || dateStr.trim() === "") return null;
            // Đảm bảo định dạng YYYY-MM-DD
            return dateStr;
          };
          const donViTuOptions = OPTIONS_DU_TOAN.find(
            (opt) => opt.value === gd.ma_don_vi,
          );

          return {
            ma_hieu: currentMaHieu,
            ten_giai_doan:
              MA_HIEU_MAPPING[index]?.ten_giai_doan || gd.ten_giai_doan,
            ngay_thuc_hien: formatDate(gd.ngay_thuc_hien) || undefined,

            // CHỈ GỬI ngay_hoan_thanh nếu là giai đoạn Thi Công (TC)
            // Nếu không phải TC, gán rỗng hoặc không gửi
            ngay_hoan_thanh:
              currentMaHieu === "TC"
                ? formatDate(gd.ngay_hoan_thanh) || undefined
                : undefined,
            so_ngay_tc_pgv:
              currentMaHieu === "TC" ? Number(gd.so_ngay_tc_pgv) || 0 : 0,
            so_ngay_tc_thuc_te:
              currentMaHieu === "NT" ? Number(gd.so_ngay_tc_thuc_te) || 0 : 0,
            tong_gia_tri: parseToNumber(gd.tong_gia_tri as string),
            chi_phi_xay_dung: parseToNumber(gd.chi_phi_xay_dung as string),
            ma_don_vi: gd.ma_don_vi || "",
            ten_don_vi: donViTuOptions?.label || "",
            dia_diem_tc: gd.dia_diem_tc || "",
            file_links: gd.file_links?.map((link: ILinkFile) => {
              return {
                link_name: link.link_name,
                link_url: link.link_url,
              };
            }),
          };
        }),
      isActive: true,
    };
    try {
      //   await addProject(payload);
      console.log("Payload gửi đi:", payload); // Kiểm tra payload trước khi gửi
      const response = await updateProject(congTrinh._id, payload);
      setIsLoading(true);
      if (response) {
        alertService.success("Cập nhật công trình thành công!");
        const updatedData = Array.isArray(response) ? response[0] : response;
        methods.reset({
          ma_cong_trinh: updatedData?.ma_cong_trinh || "",
          ten_cong_trinh: updatedData?.ten_cong_trinh || "",
          don_vi_chu_quan: updatedData?.don_vi_chu_quan || "",
          ngay_tao_du_an: updatedData?.ngay_tao_du_an
            ? updatedData.ngay_tao_du_an.split("T")[0]
            : "",
          giai_doan: updatedData?.giai_doan?.map((gd) => ({
            ...gd,
            ngay_thuc_hien: gd.ngay_thuc_hien
              ? gd.ngay_thuc_hien.split("T")[0]
              : "",
            ngay_hoan_thanh: gd.ngay_hoan_thanh
              ? gd.ngay_hoan_thanh.split("T")[0]
              : "",
            tong_gia_tri: gd.tong_gia_tri?.toLocaleString("vi-VN") ?? "",
            chi_phi_xay_dung:
              gd.chi_phi_xay_dung?.toLocaleString("vi-VN") ?? "",
            so_ngay_tc_pgv:
              gd.so_ngay_tc_pgv !== undefined && gd.so_ngay_tc_pgv !== null
                ? String(gd.so_ngay_tc_pgv)
                : "",
            so_ngay_tc_thuc_te:
              gd.so_ngay_tc_thuc_te !== undefined &&
              gd.so_ngay_tc_thuc_te !== null
                ? String(gd.so_ngay_tc_thuc_te)
                : "",
            chenh_lech_tgt:
              gd.chenh_lech_tgt !== undefined && gd.chenh_lech_tgt !== null
                ? String(gd.chenh_lech_tgt)
                : "",
            chenh_lech_cpxd:
              gd.chenh_lech_cpxd !== undefined && gd.chenh_lech_cpxd !== null
                ? String(gd.chenh_lech_cpxd)
                : "",
          })),
        });
        // Cập nhật state để React render lại giao diện
        setGiaiDoans(
          updatedData?.giai_doan?.map((gd) => ({
            ...gd,
            so_ngay_tc_pgv:
              gd.so_ngay_tc_pgv !== undefined && gd.so_ngay_tc_pgv !== null
                ? String(gd.so_ngay_tc_pgv)
                : "",
            so_ngay_tc_thuc_te:
              gd.so_ngay_tc_thuc_te !== undefined &&
              gd.so_ngay_tc_thuc_te !== null
                ? String(gd.so_ngay_tc_thuc_te)
                : "",
          })) ?? [],
        );
        setLocalCongTrinh(updatedData);
        setIsLoading(false);
      }
      router.refresh();
    } catch (error) {
      console.error("Lỗi:", error);
      alertService.error("Có lỗi xảy ra khi cập nhật công trình.");
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        // 1. Bắn thông báo cảnh cáo nghiêm túc
        alertService.error(
          "Hệ thống phát hiện hành vi spam dữ liệu liên tục! Bạn bị tạm khóa nút gửi trong 5 phút.",
        );

        // 2. Kích hoạt trạng thái khóa nút bấm
        setIsLoading(true);
        setCooldownTime(300); // 300 giây = 5 phút

        // 3. Chạy bộ đếm ngược hiển thị ra nút bấm
        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsLoading(false); // Mở khóa nút khi hết giờ
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return; // Thoát hàm, không chạy xuống finally
      }
    }
  };

  const [activeId, setActiveId] = useState("thong-tin-chung");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Khi khối form lọt vào tầm mắt (chiếm ưu thế trên màn hình)
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        // rootMargin cấu hình vùng quét tập trung tầm mắt ở nửa trên màn hình (đỉnh -20% đến đáy -60%)
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1, // Chỉ cần 10% diện tích khối form chạm vùng quét là kích hoạt
      },
    );

    // Bắt đầu theo dõi tất cả các ID khối form có trong mảng STEPS
    GIAI_DOAN_SiDER.forEach((step) => {
      const element = document.getElementById(step.id);
      if (element) observer.observe(element);
    });

    // Dọn dẹp bộ lắng nghe khi rời trang
    return () => {
      GIAI_DOAN_SiDER.forEach((step) => {
        const element = document.getElementById(step.id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const handleStepClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveId(id); // Ép trạng thái active cập nhật ngay lập tức
    }
  };

  const getStepSiderBar = () => {
    const listGiaiDoan = localCongTrinh?.giai_doan;

    if (!listGiaiDoan || listGiaiDoan.length === 0) return 1;

    // Tìm index của giai đoạn cuối cùng có dữ liệu ngày thực hiện hoặc đang Active
    let lastActiveIndex = listGiaiDoan?.length;
    if (lastActiveIndex >= 5) lastActiveIndex = lastActiveIndex - 2;
    // Số lượng item hiển thị sẽ bằng vị trí active cuối cùng cộng thêm 1
    return Math.min(lastActiveIndex + 1, GIAI_DOAN_SiDER.length)
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <FormProvider {...methods}>
        <CongTrinhProvider data={congTrinh}>
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
            <TieuDeCongTrinh
              congTrinh={congTrinh}
              mode="edit"
              isLoading={isLoading}
              onSave={handleSubmit(onSubmit)}
              cooldownTime={cooldownTime}
            />
          </div>
          <main className="w-full mx-auto px-8 py-10 flex gap-8">
            {/* Thanh điều hướng nhanh bên trái (Sticky Menu) */}
            {/* Sidebar riêng */}
            <CongTrinhSiderbar
              steps={GIAI_DOAN_SiDER.slice(0, getStepSiderBar())}
              activeId={activeId}
              onStepClick={handleStepClick}
            />

            {/* Content chính - Gom vào một khối liền mạch hoặc các Card bo góc lớn */}
            <div className="flex-1 space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Mỗi Section giờ là một Card trắng tinh tế */}
                <section id="thong-tin-chung" className="scroll-mt-30">
                  <TongQuanForm />
                </section>

                <section id="du-toan" className="scroll-mt-30">
                  <DuToanForm stage={giaiDoans || []} />
                </section>

                <section id="pd-du-toan" className="scroll-mt-30">
                  <PDDuToanForm stage={giaiDoans || []} />
                </section>

                <section id="thi-cong" className="scroll-mt-30">
                  <ThiCongForm stage={giaiDoans || []} />
                </section>

                <section id="du-toan-ps" className="scroll-mt-30">
                  <DuToanPSForm stage={giaiDoans || []} />
                </section>

                <section id="pd-du-toan-ps" className="scroll-mt-30">
                  <PDDuToanPSForm stage={giaiDoans || []} />
                </section>

                <section id="quyet-toan" className="scroll-mt-30 pb-[30vh]">
                  <QuyetToanForm stage={giaiDoans || []} />
                </section>
              </form>
            </div>
          </main>
          <section className="min-h-10"></section>
        </CongTrinhProvider>
      </FormProvider>
    </div>
  );
}
