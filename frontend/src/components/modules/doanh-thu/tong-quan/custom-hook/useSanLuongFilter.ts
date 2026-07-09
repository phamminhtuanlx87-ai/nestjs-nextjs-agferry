import { useState } from "react";
import { FilterToolbarDto } from "./useTQSanLuong";

const useSanLuongFilter = () => {
  const [filters, setFilters] = useState<FilterToolbarDto>({
    time: "THANG_NAY", // Mặc định chọn "Tháng này"
    location: "ALL", // Mặc định chọn "Tất cả bến phà" (Mã ALL)
    compare: "KY_TRUOC", // Mặc định chọn kiểu so sánh KY_TRUOC
  });
  const xuLyThayDoiBoLoc = (
    tenTruong: keyof FilterToolbarDto,
    giaTri: string,
  ) => {
    setFilters((stateTruocDo) => ({
      ...stateTruocDo,
      [tenTruong]: giaTri,
    }));
  };
  return {
    filters,
    xuLyThayDoiBoLoc,
  };
};

export default useSanLuongFilter;
