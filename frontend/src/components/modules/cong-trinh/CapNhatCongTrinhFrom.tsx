"use client";
import Button from "@/components/ui/Button";
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
       setLocalCongTrinh(congTrinh)
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
      giai_doan: data.giai_doan?.map((gd, index) => {
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
          ten_don_vi: gd.ten_don_vi || donViTuOptions?.label || "",
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
        router.refresh();
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alertService.error("Có lỗi xảy ra khi cập nhật công trình.");
    }
  };

  const [activeTab, setActiveTab] = useState("thong-tin-chung");

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <FormProvider {...methods}>
        <CongTrinhProvider data={congTrinh}>
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4">
            <div className="w-full mx-auto flex justify-between items-center">
              <div>
                <nav className="text-xs text-slate-500 flex gap-2 mb-1">
                  <span className="hover:text-primary cursor-pointer">
                    Công trình
                  </span>
                  <span>/</span>
                  <span className="font-medium text-slate-900">
                    Chi tiết hồ sơ
                  </span>
                </nav>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>{" "}
                  {/* Điểm nhấn side-bar nhỏ */}
                  Hồ sơ:{" "}
                  <span className="text-indigo-600 uppercase ml-1">
                    {/* Tên công trình */} {congTrinh.ten_cong_trinh}
                  </span>
                </h1>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="px-6 border-slate-300"
                  onClick={() => router.push("/cong-trinh")}
                >
                  Quay lại danh sách công trình
                </Button>
                <Button
                  variant="primary"
                  className="px-8 shadow-lg shadow-indigo-200"
                  onClick={handleSubmit(onSubmit)}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </header>
          <main className="w-full mx-auto px-8 py-10 flex gap-8">
            {/* Thanh điều hướng nhanh bên trái (Sticky Menu) */}
            {/* Sidebar riêng */}
            <CongTrinhSiderbar
              steps={GIAI_DOAN_SiDER.slice(0, localCongTrinh.giai_doan?.length)}
              activeId={activeTab}
              onStepClick={scrollToSection}
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

                <section id="quyet-toan" className="scroll-mt-30">
                  <QuyetToanForm stage={giaiDoans || []} />
                </section>
              </form>
            </div>
          </main>
        </CongTrinhProvider>
      </FormProvider>
    </div>
  );
}
