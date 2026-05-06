"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { ProjectFormData } from "./ProjectFormData";
import { useRouter } from "next/navigation";
import { TongQuanForm } from "./giai-doan/TongQuanForm";
import Button from "@/components/ui/Button";

interface Props {
  onClose: () => void;
}

export default function ThemCongTrinhForm({ onClose }: Props) {
  const today = new Date().toLocaleDateString("en-CA");
  // Khai báo công cụ quản lý form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      donVi: "PKT", // Giá trị này phải khớp với 'value' trong OPTIONS_DU_TOAN
      donViChuQuan: "Cty Cổ phần Phà An Giang",
      ngayTao: today,
    },
  });

  const router = useRouter();
  const onSubmit = async (data: ProjectFormData) => {
    // Tạo payload khớp với class ProjectRequest ở Backend
    // const payload: AddProjectRequest = {
    //   tenCongTrinh: data.tenCongTrinh,
    //   ngayTao: data.ngayTao, // Đảm bảo format là "2026-04-09"
    //   donViChuQuan: data.donViChuQuan,
    //   maHieuGiaiDoan: data.trangThai || "DT", // Map trangThai từ Form sang MaHieuGiaiDoan
    // };
    onClose();
    router.refresh();
    try {
      console.log("Dữ liệu gửi đi:", data);
      //   await addProject(payload);
      router.push("/cong-trinh");
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };
  return (
    <div>
      {/* ----------------- */}
      <div className="flex-1 mx-auto w-full">
        <div className="">
          {/* FORM */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex bg-gray-50">
              {/* Main Content */}
              <div className="flex-1 p-4">
                <div className="max-w-6xl mx-auto">
                  <h1 className="text-2xl font-extrabold text-primary mb-8 uppercase border-b-2 border-primary pb-2 inline-block">
                    Hồ sơ chi tiết công trình
                  </h1>
                  <div className="space-y-8">
                    {/* Phần 1: Thông tin chung - Gọn gàng hơn */}
                    <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                      <TongQuanForm
                        register={register}
                        errors={errors}
                      ></TongQuanForm>
                    </section>
                    {/* Nút lưu luôn cố định hoặc ở góc dễ thấy */}
                    <div className="flex justify-center gap-4 pb-12">
                      <button
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300 transition"
                        onClick={onClose}
                      >
                        Hủy
                      </button>
                      <Button type="submit" variant="primary">
                        Lưu thay đổi
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
