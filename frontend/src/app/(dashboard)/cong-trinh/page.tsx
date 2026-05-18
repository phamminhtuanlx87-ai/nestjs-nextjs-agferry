"use client";
import CongTrinhTable from "@/components/modules/cong-trinh/CongTrinhTable";
import ThemCongTrinhForm from "@/components/modules/cong-trinh/ThemCongTrinhForm";
import Button from "@/components/ui/Button";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Modal from "@/components/ui/Modal";
import { getAllCongTrinh, ICongTrinh } from "@/services/congTrinhService";
import React, { useCallback, useEffect, useState } from "react";
import ProjectStatsBlock from "@/components/modules/cong-trinh/ProjectStatsBlock";

export default function CongTrinhpage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dsCongTrinh, setDsCongTrinh] = useState<ICongTrinh[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  // Gọi hook ngay dưới phần khai báo các State

  // Tại trang quản lý (Parent)
  const loadData = useCallback(async (month: number, year: number) => {
    try {
      // Giả định API của bạn hỗ trợ truyền params để lọc
      const data = await getAllCongTrinh(month, year);
      setDsCongTrinh(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setSelectedMonth(selectedMonth);
        setSelectedYear(selectedYear);
        await loadData(selectedMonth, selectedYear);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi load danh sách công trình:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, loadData]);

  if (loading) return <LoadingScreen />;
  // Kết quả trả về: "khoảng 15 phút trước" hoặc "vừa xong"

  return (
    <div>
      <div className="flex-1 p-6 overflow-y-auto md:ml-10 flex flex-col gap-6">
        <ProjectStatsBlock
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
        <section className="content-2 table-list bg-white border border-gray-50 border-shadow flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="text-sm md:text-2xl font-semibold">
              Danh sách công trình
            </h1>

            <Button
              type="button"
              variant="primary"
              className="text-sm font-semibold"
              onClick={() => setIsModalOpen(true)}
            >
              + Thêm công trình
            </Button>
          </div>
          <CongTrinhTable
            key={dsCongTrinh.length}
            onSuccess={() => loadData(selectedMonth, selectedYear)}
            data={dsCongTrinh}
            rowsPerPage={20}
          />
        </section>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm công trình"
      >
        <ThemCongTrinhForm
          onSuccess={() => loadData(selectedMonth, selectedYear)}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
