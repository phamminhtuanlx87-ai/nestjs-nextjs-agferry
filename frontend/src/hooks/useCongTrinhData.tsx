import { useState, useEffect, useCallback } from "react";
import { getAllCongTrinh, ICongTrinh } from "@/services/congTrinhService"; // Điều chỉnh đường dẫn service của bạn

export function useCongTrinhData() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    now.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [dsCongTrinh, setDsCongTrinh] = useState<ICongTrinh[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  //  1. Đưa State quản lý bộ lọc Card vào đây
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  // Hàm loadData cố định danh tính bằng useCallback
  const loadData = useCallback(async (month: number, year: number) => {
    try {
      const data = await getAllCongTrinh(month, year);
      setDsCongTrinh(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách công trình từ Hook:", error);
    }
  }, []);

  // Tự động fetch lại dữ liệu khi người dùng đổi tháng hoặc năm trên UI
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadData(selectedMonth, selectedYear);
      } catch (error) {
        console.error("Lỗi hệ thống trong useEffect Hook:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, loadData]);

  const filteredTableData = dsCongTrinh.filter((item) => {
    if (filterStatus === "ALL") return true;

    // Lấy mã hiệu giai đoạn cuối cùng giống hệt logic cũ của bạn
    const lastMaHieu = item.giai_doan?.at(-1)?.ma_hieu || ""; //

    if (filterStatus === "THI_CONG") return ["TC", "NT"].includes(lastMaHieu); //
    if (filterStatus === "QUYET_TOAN")
      return ["DT_PS", "TTR_DT_PS", "PD_DT_PS"].includes(lastMaHieu); //
    if (filterStatus === "HOAN_THANH") return ["QT"].includes(lastMaHieu);

    return true;
  });
  // Trả ra toàn bộ state và hàm để các trang bên ngoài chỉ việc lôi ra dùng
  return {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    dsCongTrinh,
    filteredTableData, // Mảng ĐÃ LỌC động truyền cho Bảng hiển thị
    filterStatus, // State active hiện tại
    setFilterStatus, // Hàm click đổi bộ lọc
    loading,
    refreshData: () => loadData(selectedMonth, selectedYear), // Hàm bổ sung để ép tải lại khi cần (ví dụ sau khi thêm/sửa thành công)
  };
}
