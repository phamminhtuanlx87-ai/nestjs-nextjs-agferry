"use client";
import CongTrinhTable from "@/components/modules/cong-trinh/CongTrinhTable";
import ThemCongTrinhForm from "@/components/modules/cong-trinh/ThemCongTrinhForm";
import Button from "@/components/ui/Button";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Modal from "@/components/ui/Modal";
import { getAllCongTrinh, ICongTrinh } from "@/services/congTrinhService";
import React, { useEffect, useState } from "react";

export default function CongTrinhpage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dsCongTrinh, setDsCongTrinh] = useState<ICongTrinh[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Tại trang quản lý (Parent)
  const loadData = async () => {
    const data = await getAllCongTrinh();

    setDsCongTrinh(data);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadData();
      } catch (error) {
        console.error("Lỗi khi load danh sách công trình:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <section className="flex-1 p-6 overflow-y-auto md:ml-10">
        <div className="content-2 table-list bg-white border border-gray-50 border-shadow flex flex-col gap-5">
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
            onSuccess={loadData}
            data={dsCongTrinh}
            rowsPerPage={5}
          />
        </div>
      </section>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm công trình"
      >
        <ThemCongTrinhForm
          onSuccess={loadData}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
