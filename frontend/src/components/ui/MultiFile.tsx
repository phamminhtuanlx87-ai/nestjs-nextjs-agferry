"use client"
import {
  useFieldArray,
  Control,
  FieldValues,
  ArrayPath,
  useWatch,
} from "react-hook-form";
import { FiPlus, FiTrash2, FiFileText, FiLink, FiEye } from "react-icons/fi";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: name as any,
  });

  return (
    <>
      <div className="bg-gray-100 col-span-2 mt-8 rounded-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full" />
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
              {label}
            </label>
            <span className="bg-blue-400 text-white text-sm font-semibold px-2 py-0.5 rounded-full">
              {fields.length}
            </span>
          </div>

          <button
            type="button"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => append({ link_name: "", link_url: "" } as any)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <FiPlus size={14} /> Thêm tài liệu
          </button>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          {/* List */}
          <div className="space-y-2">
            {fields.map((field, index) => {
              const currentUrl = watchedFields?.[index]?.link_url;
              const isUploaded = !!currentUrl;

              return (
                <div
                  key={field.id}
                  className={`group flex items-center gap-3 p-2 rounded-xl border transition-all ${
                    isUploaded
                      ? "bg-emerald-50/20 border-emerald-100"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  {/* Icon file */}
                  <div
                    className={`shrink-0 p-2.5 rounded-lg ${isUploaded ? "bg-emerald-100 text-emerald-600" : "bg-white text-slate-400 shadow-sm"}`}
                  >
                    <FiFileText size={18} />
                  </div>

                  {/* Inputs - Căn giữa hàng dọc bằng items-center */}
                  <div className="flex-1 grid grid-cols-2 gap-4 items-center">
                    <input
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      {...control.register(`${name}.${index}.link_name` as any)}
                      placeholder="Tên gợi nhớ tài liệu..."
                      className="w-full bg-transparent text-[13px] font-medium text-slate-700 focus:outline-none placeholder:text-slate-400"
                    />

                    <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-lg border border-slate-200/50 group-focus-within:border-blue-200 transition-colors">
                      <FiLink size={12} className="text-slate-400 shrink-0" />
                      <input
                        {...control.register(
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          `${name}.${index}.link_url` as any,
                        )}
                        placeholder="Dán đường dẫn (URL) vào đây..."
                        className="w-full bg-transparent text-[12px] text-blue-600 focus:outline-none truncate"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 pr-1 ">
                    {isUploaded && (
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Xem tài liệu"
                      >
                        <FiEye size={20} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Xóa dòng"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {fields.length === 0 && (
            <div className="py-2 text-center border-2 border-dashed border-slate-50 rounded-xl">
              <span className="text-slate-400 text-xs italic">
                Chưa có tệp đính kèm nào
              </span>
            </div>
          )}
        </div>
        <div className="text-[11px] font-bold text-slate-500 p-2">
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
    </>
  );
};
