"use client";
import Button from "@/components/ui/Button";
import React, { useState } from "react";
import CongTrinhTable from "./CongTrinhTable";
import Modal from "@/components/ui/Modal";
import { ICongTrinh } from "@/services/congTrinhService";
import ThemCongTrinhForm from "./ThemCongTrinhForm";
import { Guard } from "@/components/common/Guard";
import { UserPermission } from "@/store/useAuthStore";

interface DSCongTrinhProps {
  rowsPerPage?: number;
  data: ICongTrinh[];
  onRefresh?: () => void;
}

export default function DSCongTrinh({
  rowsPerPage = 5,
  data,
  onRefresh,
}: DSCongTrinhProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div>
      <section className="content-2 table-list bg-white border border-gray-50 border-shadow flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-sm md:text-2xl font-semibold">
            Danh sách công trình
          </h1>
          <Guard requiredPermission={UserPermission.PROJECT_CREATE}>
            <Button
              type="button"
              variant="primary"
              className="text-sm font-semibold"
              onClick={() => setIsModalOpen(true)}
            >
              + Thêm công trình
            </Button>
          </Guard>
        </div>
        <div className="w-full overflow-x-auto rounded-xl">
          <CongTrinhTable
           key={data.length}
            onSuccess={() => onRefresh?.()}
            data={data}
            rowsPerPage={rowsPerPage}
          />
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm công trình"
      >
        <ThemCongTrinhForm
          onSuccess={() => onRefresh?.()}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
