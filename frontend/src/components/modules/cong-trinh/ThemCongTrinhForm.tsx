"use client";
import React, { useState } from "react";
import { ProjectFormData } from "./ProjectFormData";
import { TongQuanForm } from "./giai-doan/TongQuanForm";
import Button from "@/components/ui/Button";
import {
  addProject,
  CongtrinhRequest,
  ICongTrinh,
} from "@/services/congTrinhService";
import { alertService } from "@/utils/swal";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
  congTrinh?: ICongTrinh;
}

export default function ThemCongTrinhForm({ onClose, onSuccess }: Props) {
  // Khai báo công cụ quản lý form
  const methods = useForm<ProjectFormData>();
  const { handleSubmit } = methods;
  const today = new Date().toLocaleDateString("en-CA");
  const [isSubmiting, setisSubmitting] = useState(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const generateMaCongTrinh = (ten: string, ngay: string): string => {
    // 1. Xác định Tiền tố (Prefix)
    let prefix = "K";
    const tenUpper = ten.toUpperCase();

    if (tenUpper.includes("TRÊN ĐÀ")) {
      prefix = "TĐ";
    } else if (tenUpper.includes("HOÁN CẢI")) {
      prefix = "HC";
    } else if (tenUpper.includes("SỬA CHỮA")) {
      prefix = "SC";
    } else if (tenUpper.includes("DỰ ÁN")) {
      prefix = "DA";
    }

    // 2. Lấy Năm và Tháng (YYMM) từ ngay_tao_du_an (định dạng YYYY-MM-DD)
    const date = new Date(ngay);
    const yy = date.getFullYear().toString().slice(-2);
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");

    // 3. Kết hợp lại thành định dạng TĐ2605 (Chưa bao gồm STT - Backend sẽ tự cộng đuôi -01, -02)
    return `${prefix}${yy}${mm}`;
  };

  const onSubmit = async (data: ProjectFormData) => {
    //khoá submit button
    try {
      setisSubmitting(true);
      // Tạo payload khớp với class ProjectRequest ở Backend
      const payload: CongtrinhRequest = {
        ma_cong_trinh: generateMaCongTrinh(
          data.ten_cong_trinh,
          data.ngay_tao_du_an || today,
        ), // Backend sẽ tự động thêm đuôi -01, -02... nên frontend chỉ cần gửi phần đầu
        ten_cong_trinh: data.ten_cong_trinh,
        ngay_tao_du_an: data.ngay_tao_du_an || today, // Nếu người dùng không chọn ngày, dùng ngày hiện tại
        don_vi_chu_quan: data.don_vi_chu_quan || "Cty Cổ phần Phà An Giang", // Nếu người dùng không nhập, dùng giá trị mặc định
        isActive: true, // Mặc định khi tạo mới sẽ là active
      };

      await addProject(payload);
      alertService.success("Thêm công trình thành công!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi:", error);
      let serverMessage = "";
      let isRateLimit = false;

      if (axios.isAxiosError(error)) {
        serverMessage = error.response?.data?.message;
        // Kiểm tra xem có phải đúng lỗi 429 không
        if (error.response?.status === 429) {
          isRateLimit = true;
        }
      }

      if (serverMessage) {
        alertService.error(serverMessage);
      } else {
        alertService.error(
          "Có lỗi xảy ra khi thêm công trình. Vui lòng thử lại!",
        );
      }

      // 💡 NẾU LÀ LỖI SPAM, KHÓA NÚT THÊM 5 GIÂY RỒI MỚI CHO BẤM LẠI
      if (isRateLimit) {
        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setisSubmitting(false); // Mở khóa nút khi hết giờ
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return; // Thoát hàm, không chạy xuống finally
      }
    }
  };
  return (
    <div>
      {/* ----------------- */}
      <div className="flex-1 mx-auto w-full">
        <FormProvider {...methods}>
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
                        <TongQuanForm></TongQuanForm>
                      </section>
                      {/* Nút lưu luôn cố định hoặc ở góc dễ thấy */}
                      <div className="flex justify-center gap-4 pb-12">
                        <Button
                          variant="secondary"
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300 transition"
                          onClick={onClose}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isSubmiting}
                        >
                          {isSubmiting ? "...Đang lưu dữ liệu" : "Lưu thay đổi"}
                          <br />
                          {cooldownTime > 0
                            ? `Vui lòng đợi (${Math.floor(cooldownTime / 60)}p:${cooldownTime % 60}s)`
                            : ""}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
