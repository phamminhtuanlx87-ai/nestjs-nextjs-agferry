'use client';
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Table from "@/components/ui/Table";
import { useState } from "react";

export default function PhaPage() {
  const dsTau = [
    {
      id: "P100",
      ten: "Phà An Giang 01",
      trọng_tải: "100 tấn",
      trang_thai: "Đang chạy",
    },
    {
      id: "P200",
      ten: "Phà An Giang 05",
      trọng_tải: "200 tấn",
      trang_thai: "Đang sửa chữa",
    },
  ];
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-8">
         <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Thêm Phà Vào Hệ Thống"
      >
        <div className="space-y-4 w-100">
          <Input label="Mã số phà" placeholder="Ví dụ: P-101"/>
          <Input label="Tên phà" placeholder="Ví dụ: Phà Vàm Cống 01" />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button>Lưu thông tin</Button>
          </div>
        </div>
      </Modal>
        <Button onClick={() => setIsModalOpen(true)}>
        + Thêm Phà Mới
      </Button>
      <h1 className="text-2xl font-bold mb-6">Quản lý Đội Phà</h1>

      <Table headers={[
        { key: "id", label: "Mã Phà" },
        { key: "ten", label: "Tên Phà" },
        { key: "trong_tai", label: "Trọng Tải" },
        { key: "trang_thai", label: "Trạng Thái" }
      ]}>
        {dsTau.map((tau) => (
          <tr
            key={tau.id}
            className="hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            <td className="px-6 py-4 hidden md:table-cell font-medium">{tau.id}</td>
            <td className="px-6 py-4">{tau.ten}</td>
            <td className="px-6 py-4">{tau.trọng_tải}</td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  tau.trang_thai === "Đang chạy"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {tau.trang_thai}
              </span>
            </td>
          </tr>
        ))}
      </Table>
     
    </div>
  );
}
