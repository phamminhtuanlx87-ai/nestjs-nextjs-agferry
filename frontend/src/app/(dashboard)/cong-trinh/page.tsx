"use client";
import CongTrinhTable from "@/components/modules/cong-trinh/CongTrinhTable";
import ThemCongTrinhForm from "@/components/modules/cong-trinh/ThemCongTrinhForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import React, { useState } from "react";

export default function CongTrinhpage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <CongTrinhTable rowsPerPage={5} />
        </div>
      </section>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm công trình"
      >
        <ThemCongTrinhForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
