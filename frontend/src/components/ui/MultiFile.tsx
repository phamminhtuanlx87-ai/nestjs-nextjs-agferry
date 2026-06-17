/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useFieldArray,
  Control,
  FieldValues,
  ArrayPath,
  useWatch,
} from "react-hook-form";
import { FiPlus, FiTrash2, FiFileText, FiLink, FiEye } from "react-icons/fi";
import { VnptWarningFooter } from "./VnptWarningFooter";
import { alertService } from "@/utils/swal";

interface MultiFileControlProps<T extends FieldValues> {
  control: Control<T>;
  name: ArrayPath<T>;
  label: string;
}

export const MultiFileControl = <T extends FieldValues>({
  control,
  name,
  label,
}: MultiFileControlProps<T>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  // Watch dữ liệu để kiểm tra link URL thực tế cho nút "Xem"
  const watchedFields = useWatch({
    control,
    name: name as any,
  });

  const handleFileClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    linkUrl: string,
  ) => {
    if (typeof window !== "undefined") {
      const now = new Date().getTime();
      const remindedTime = localStorage.getItem("ioffice_reminded_time");

      // Khoảng thời gian hết hạn phiên iOffice (10 phút = 10 * 60 * 1000 miligiây)
      const TIMEOUT_LIMIT = 10 * 60 * 1000;

      // Kiểm tra: Nếu chưa từng nhắc HOẶC lần nhắc cuối cùng đã quá 10 phút trước
      const isExpired =
        !remindedTime || now - parseInt(remindedTime) > TIMEOUT_LIMIT;

      if (isExpired) {
        // 1. Chặn hành vi mở link mặc định của thẻ <Link> ngay lập tức
        e.preventDefault();

        // 2. Hiện thông báo SweetAlert2 nhắc nhở
        const result = await alertService.confirmLoginOffice();

        // 3. Người dùng tương tác xong -> Cập nhật/Ghi đè mốc thời gian hiện tại vào kho lưu trữ
        localStorage.setItem("ioffice_reminded_time", now.toString());

        if (result.isConfirmed) {
          // Chọn "Đến trang đăng nhập": Mở trang iOffice để nạp lại phiên 10 phút mới và mở file
          window.open("https://angiang.vnptioffice.vn/", "_blank");
          window.open(linkUrl, "_blank");
        } else {
          // Chọn "Tôi đã đăng nhập rồi": Tiếp tục mở thẳng file
          window.open(linkUrl, "_blank");
        }
      }
      // NẾU CÒN TRONG VÒNG 10 PHÚT:
      // Mắc định không chạy vào IF -> Không bị e.preventDefault() chặn -> Link tự mở mượt mà bằng thẻ <Link>
    }
  };

  return (
    <>
      <div className="w-full col-span-1 md:col-span-3 mt-4">
        {/* Container chính bọc toàn bộ khối */}
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-sm">
          {/* Header: Tiêu đề & Nút Thêm */}
          <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-500 rounded-full" />
              <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">
                {label}
              </label>
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
                {fields.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => append({ link_name: "", link_url: "" } as any)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 cursor-pointer rounded-lg transition-all"
            >
              <FiPlus size={14} /> Thêm tài liệu
            </button>
          </div>

          {/* Danh sách tệp đính kèm */}
          <div className="space-y-3">
            {fields.map((field, index) => {
              const currentUrl = watchedFields?.[index]?.link_url;
              const isUploaded = !!currentUrl;

              return (
                <div
                  key={field.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl border transition-all ${
                    isUploaded
                      ? "bg-emerald-50/10 border-emerald-100 shadow-sm"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  {/* Hàng ngang chứa Icon và các nút Thao tác trên Mobile */}
                  <div className="flex items-center justify-between w-full sm:w-auto shrink-0 gap-2 border-b border-slate-100 pb-2 sm:pb-0 sm:border-0">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-lg ${isUploaded ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                      >
                        <FiFileText size={18} />
                      </div>
                      {/* Số thứ tự hiển thị rõ ràng trên mobile */}
                      <span className="text-xs font-bold text-slate-500 sm:hidden">
                        Tài liệu #{index + 1}
                      </span>
                    </div>

                    {/* Nhóm nút bấm thao tác di chuyển lên góc trên đối với Mobile */}
                    <div className="flex items-center gap-1 sm:hidden">
                      {isUploaded && (
                        <a
                          onClick={(e) => handleFileClick(e, currentUrl)}
                          href={currentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Xem tài liệu"
                        >
                          <FiEye size={18} />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Xóa"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Khu vực Form Điền thông tin: Tự động chia 1 cột trên Mobile, 2 cột trên PC */}
                  <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                    {/* Ô nhập tên tài liệu */}
                    <div className="w-full bg-slate-50/50 px-3 py-2 rounded-lg border border-slate-200/70 focus-within:border-blue-400 focus-within:bg-white transition-all">
                      <input
                        {...control.register(
                          `${name}.${index}.link_name` as any,
                        )}
                        placeholder="Tên gợi nhớ tài liệu... (Ví dụ: Quyết định số 556)"
                        className="w-full bg-transparent text-[13px] font-medium text-slate-700 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {/* Ô nhập link URL */}
                    <div className="w-full flex items-center gap-2 bg-slate-50/50 px-3 py-2 rounded-lg border border-slate-200/70 focus-within:border-blue-400 focus-within:bg-white transition-all">
                      <FiLink size={13} className="text-slate-400 shrink-0" />
                      <input
                        {...control.register(
                          `${name}.${index}.link_url` as any,
                        )}
                        placeholder="Dán đường dẫn (URL) tài liệu vào đây..."
                        className="w-full bg-transparent text-[12px] text-blue-600 font-medium focus:outline-none truncate placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Nhóm nút bấm thao tác mặc định hiển thị trên Desktop */}
                  <div className="hidden sm:flex items-center gap-1 shrink-0 pl-1">
                    {isUploaded && (
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Xem tài liệu"
                      >
                        <FiEye size={18} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Xóa dòng"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trạng thái trống */}
          {fields.length === 0 && (
            <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
              <span className="text-slate-400 text-xs font-medium italic">
                Chưa có tệp đính kèm nào được thêm vào danh sách
              </span>
            </div>
          )}
        </div>

        {/* Gọi Component Footer Cảnh báo VNPT tĩnh riêng biệt đặt tại đây */}
        <VnptWarningFooter />
      </div>
    </>
  );
};
