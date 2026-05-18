"use client";
import Button from "@/components/ui/Button";
import React, { useCallback, useEffect, useState } from "react";
import CongTrinhTable from "./CongTrinhTable";
import Modal from "@/components/ui/Modal";
import { getAllCongTrinh, ICongTrinh } from "@/services/congTrinhService";
import ThemCongTrinhForm from "./ThemCongTrinhForm";
import LoadingScreen from "@/components/ui/LoadingScreen";


interface DSCongTrinhProps {
  selectedMonth: number;
  selectedYear: number;
  rowsPerPage?: number;
}

export default function DSCongTrinh({
  selectedMonth,
  selectedYear,
  rowsPerPage = 5,
}: DSCongTrinhProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dsCongTrinh, setDsCongTrinh] = useState<ICongTrinh[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
  return (
    <div>
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
          rowsPerPage={rowsPerPage}
        />
      </section>

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
