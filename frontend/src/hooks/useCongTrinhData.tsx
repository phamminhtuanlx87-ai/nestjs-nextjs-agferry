import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllCongTrinh, ICongTrinh } from "@/services/congTrinhService"; // Điều chỉnh đường dẫn service của bạn

export function useCongTrinhData() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [dsCongTrinh, setDsCongTrinh] = useState<ICongTrinh[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // 1. Hàm tải dữ liệu cố định identity
  const loadData = useCallback(async (month: number, year: number) => {
    try {
      const data = await getAllCongTrinh(month, year);
      setDsCongTrinh(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách công trình từ Hook:", error);
    }
  }, []);

  // 2. Hàm làm tươi dữ liệu được cố định bằng useCallback để tránh lệch reference khi truyền prop
  const refreshData = useCallback(() => {
    setLoading(true);
    loadData(selectedMonth, selectedYear).finally(() => setLoading(false));
  }, [selectedMonth, selectedYear, loadData]);

  // 3. Tự động fetch lại dữ liệu khi đổi tháng/năm trên UI
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    loadData(selectedMonth, selectedYear).finally(() => setLoading(false));
  }, [selectedMonth, selectedYear, loadData]);

  // 4. Bọc mảng lọc vào useMemo để tránh việc tính toán lại vô nghĩa và giúp React bắt đúng State mới
  const filteredTableData = useMemo(() => {
    return dsCongTrinh.filter((item) => {
      if (filterStatus === "ALL") return true;

      const lastMaHieu = item.giai_doan?.at(-1)?.ma_hieu || "";

      if (filterStatus === "THI_CONG") return ["TC", "NT"].includes(lastMaHieu);
      if (filterStatus === "QUYET_TOAN") return ["DT_PS", "TTR_DT_PS", "PD_DT_PS"].includes(lastMaHieu);
      if (filterStatus === "HOAN_THANH") return ["QT"].includes(lastMaHieu);

      return true;
    });
  }, [dsCongTrinh, filterStatus]);

  return {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    dsCongTrinh,
    filteredTableData, 
    filterStatus, 
    setFilterStatus, 
    loading,
    refreshData, // 🔥 Bây giờ là một hàm an toàn, không bị tạo mới sau mỗi lần re-render
  };
}
