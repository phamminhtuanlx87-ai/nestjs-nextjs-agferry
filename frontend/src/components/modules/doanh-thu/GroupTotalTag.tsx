import { formatMoney } from "@/utils/formatnumber";

// Bốc đúng Union Type từ interface của anh ra để ép kiểu cho chặt chẽ
export type NhomType = 
  | 'HANH_KHACH' 
  | 'XE_CAC_LOAI' 
  | 'THUE_BAO' 
  | 'VE_THANG' 
  | 'VE_QUI' 
  | 'VE_NAM'
  | 'XE_KHACH'
  | 'XE_TAI';

interface GroupTotalTagProps {
  nhom: NhomType;
  label: string;
  // ✨ ĐÃ SỬA: Định nghĩa rõ hàm nhận vào một chuỗi thuộc NhomChaType và trả về số
  tinhTongFn: (nhom: NhomType) => number;
}

export const GroupTotalTag = ({
  nhom,
  label,
  tinhTongFn,
}: GroupTotalTagProps) => {
  const total = tinhTongFn(nhom) || 0;

  if (total <= 0) return null;

  return (
    <div
      title={`Tổng doanh thu ${label}: ${formatMoney(String(total))}`}
      className="flex justify-between items-center mt-3 pt-3 border-t-2 border-double border-gray-300 bg-slate-50/80 px-4 py-2 rounded-b-lg"
    >
      <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
        {label}
      </span>
      <span className="text-lg font-black font-mono text-emerald-600">
        {formatMoney(String(total))}{" "}
      </span>
    </div>
  );
};
