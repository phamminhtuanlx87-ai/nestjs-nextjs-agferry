"use client";
import Table from "@/components/ui/Table";
import React, { useState } from "react";
import { projectStatusMap } from "./ProjectStatus";
import { RiDeleteBinLine, RiEdit2Line, RiEyeLine } from "@remixicon/react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
interface IGiaiDoan {
  ma_hieu: string;
  ten_giai_doan: string;
  ma_don_vi: string;
  ten_don_vi: string;
  so_ngay_tc_pgv?: number;
  so_ngay_tc_thuc_te?: number;
  chenh_lech_tgt?: number;
  chenh_lech_cpxd?: number;
  tong_gia_tri?: number;
  chi_phi_xay_dung?: number;
  ngay_thuc_hien?: string;
  ngay_hoan_thanh?: string;
}

interface ICongTrinh {
  id: {
    $oid: string;
  };
  ma_cong_trinh: string;
  ten_cong_trinh: string;
  don_vi_chu_quan: string;
  ngay_tao_du_an: string;
  giai_doan: IGiaiDoan[];
}

interface CongTrinhTableProps {
  // projects: ICongTrinh[];
  rowsPerPage?: number;
}

export default function CongTrinhTable({
  rowsPerPage = 5,
}: CongTrinhTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const dsCongTrinh: ICongTrinh[] = [
    {
      id: {
        $oid: "69e1eb7877410d98b6aa555f",
      },
      ma_cong_trinh: "TDA10",
      ten_cong_trinh: "Sửa chữa trên đà A10 (AG-22436)",
      don_vi_chu_quan: "Cty Cổ phần Phà An Giang",
      ngay_tao_du_an: "2026-02-20T14:50:19+07:00",
      giai_doan: [
        {
          ma_hieu: "DT",
          ten_giai_doan: "Dự toán",
          ma_don_vi: "KTC",
          ten_don_vi: "KTC",
          tong_gia_tri: 520000000,
          chi_phi_xay_dung: 350000000,
          ngay_thuc_hien: "2026-04-17T14:50:19+07:00",
          ngay_hoan_thanh: "2026-04-17T14:50:19+07:00",
        },
        {
          ma_hieu: "TTR_DT",
          ten_giai_doan: "Thẩm tra Dự toán",
          ma_don_vi: "TNB",
          ten_don_vi: "Tây Nam Bộ",
          tong_gia_tri: 550000000,
          chi_phi_xay_dung: 380000000,
          ngay_thuc_hien: "2026-04-18T14:50:19+07:00",
          ngay_hoan_thanh: "2026-04-18T14:50:19+07:00",
        },
        {
          ma_hieu: "PD_DT",
          ten_giai_doan: "Phê duyệt Dự toán",
          ma_don_vi: "PDT",
          ten_don_vi: "Phòng Đầu tư",
          tong_gia_tri: 550000000,
          chi_phi_xay_dung: 380000000,
          ngay_thuc_hien: "2026-04-18T14:50:19+07:00",
        },
        {
          ma_hieu: "TC",
          ten_giai_doan: "Thi công",
          ma_don_vi: "XNCK",
          ten_don_vi: "XN Cơ khí Giao thông",
          so_ngay_tc_pgv: 30,
          ngay_thuc_hien: "2026-04-20T14:50:19+07:00",
        },
        {
          ma_hieu: "NT",
          ten_giai_doan: "Nghiệm thu",
          ma_don_vi: "PKT",
          ten_don_vi: "Phòng Kỹ thuật - Vật tư",
          so_ngay_tc_thuc_te: 30,
          ngay_thuc_hien: "2026-04-20T14:50:19+07:00",
          ngay_hoan_thanh: "2026-05-20T14:50:19+07:00",
        },
        {
          ma_hieu: "DT_PS",
          ten_giai_doan: "Dự toán Phát sinh",
          ma_don_vi: "KTC",
          ten_don_vi: "KTC",
          tong_gia_tri: 600000000,
          chi_phi_xay_dung: 450000000,
          chenh_lech_tgt: 52000000,
          chenh_lech_cpxd: 50000000,
          ngay_thuc_hien: "2026-05-20T14:50:19+07:00",
          ngay_hoan_thanh: "2026-04-26T14:50:19+07:00",
        },
        {
          ma_hieu: "TTR_DT_PS",
          ten_giai_doan: "Thẩm tra Dự toán Phát sinh",
          ma_don_vi: "TNB",
          ten_don_vi: "Tây Nam Bộ",
          tong_gia_tri: 620000000,
          chi_phi_xay_dung: 470000000,
          ngay_thuc_hien: "2026-05-20T14:50:19+07:00",
          ngay_hoan_thanh: "2026-04-26T14:50:19+07:00",
        },
        {
          ma_hieu: "PD_DT_PS",
          ten_giai_doan: "Phê duyệt Dự toán Phát sinh",
          ma_don_vi: "PDT",
          ten_don_vi: "Phòng Đầu tư",
          tong_gia_tri: 620000000,
          chi_phi_xay_dung: 470000000,
          ngay_thuc_hien: "2026-05-20T14:50:19+07:00",
        },
        {
          ma_hieu: "QT",
          ten_giai_doan: "Quyết toán",
          ma_don_vi: "PDT",
          ten_don_vi: "Phòng Đầu tư",
          tong_gia_tri: 620000000,
          chi_phi_xay_dung: 470000000,
          ngay_thuc_hien: "2026-05-20T14:50:19+07:00",
        },
      ],
    },
  ];
  const totalItems = dsCongTrinh?.length;
  const totalPages = Math.ceil(Number(totalItems) / rowsPerPage);

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  function renderStatus(statusId: string) {
    const status = projectStatusMap[statusId];

    if (!status) return null;

    return (
      <span
        className={`inline-flex items-center justify-center min-w-28 px-3 py-1 text-xs font-medium rounded-full ${status.color}`}
        title={status.full}
      >
        {status.short}
      </span>
    );
  }
  const TABLE_HEADERS = [
    { label: "Mã CT", key: "ma_cong_trinh", className: "w-20" },
    {
      label: "Tên công trình",
      key: "ten_cong_trinh",
      className: "min-w-[200px]",
    },
    { label: "Ngày khởi tạo", key: "ngay_tao_du_an", align: "center" as const },
    { label: "Dự toán", key: "du_toan", align: "right" as const }, // Căn phải cho số tiền
    {
      label: "Dự toán (Điều chỉnh)",
      key: "du_toan_dc",
      align: "right" as const,
    }, // Căn phải cho số tiền
    { label: "Quyết toán", key: "quyet_toan", align: "right" as const }, // Căn phải
    { label: "Trạng thái", key: "trang_thai", align: "center" as const },
    { label: "Hành động", key: "actions", align: "right" as const },
  ];
  return (
    <div>
      <Table headers={TABLE_HEADERS}>
        {dsCongTrinh?.map((project) => (
          <tr
            key={`${project.ma_cong_trinh}`}
            className="hover:bg-indigo-100 transition-colors"
          >
            <td className="px-6 py-4 hidden md:table-cell font-medium">
              {project.ma_cong_trinh}
            </td>

            <td className="px-6 py-4  text-gray-800 font-bold">
              {project.ten_cong_trinh}
            </td>
            <td className="px-6 py-4 hidden md:table-cell text-center">
              {project.ngay_tao_du_an
                ? new Date(project.ngay_tao_du_an).toLocaleDateString("vi-VN")
                : "---"}
            </td>

            <td className="px-6 py-4 text-right tabular-nums">
              {/* Dùng Number() để ép kiểu về số trước khi format, mặc định là 0 nếu null */}
              {Number(
                project.giai_doan?.find((gd) => gd.ma_hieu === "PD_DT")
                  ?.tong_gia_tri || 0,
              ).toLocaleString("vi-VN")}
              <span className="text-gray-400 text-xs"> ₫</span>
            </td>

            <td className="px-6 py-4 hidden md:table-cell text-right tabular-nums">
              {Number(
                project.giai_doan?.find((gd) => gd.ma_hieu === "PD_DT_PS")
                  ?.tong_gia_tri || 0,
              ).toLocaleString("vi-VN")}
              <span className="text-gray-400 text-xs"> ₫</span>
            </td>
            <td className="px-6 py-4 hidden md:table-cell text-right tabular-nums font-semibold">
              {Number(
                project.giai_doan?.find((gd) => gd.ma_hieu === "QT")
                  ?.tong_gia_tri || 0,
              ).toLocaleString("vi-VN")}
              <span className="text-gray-400 text-xs"> ₫</span>
            </td>
            <td className="px-6 py-4 text-center">
              {renderStatus(project.giai_doan?.at(-1)?.ma_hieu || "")}
            </td>

            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <Button
                  type="button"
                  className="p-2 rounded-lg text-indigo-600 bg-white hover:bg-indigo-300 transition-colors"
                >
                  <RiEyeLine size={18}></RiEyeLine>
                </Button>
                <Button
                  type="button"
                  className="p-2 rounded-lg text-indigo-600 bg-white hover:bg-indigo-300 transition-colors"
                  onClick={() => {
                    const targetId =
                      typeof project.id === "string"
                        ? project.id
                        : project.id.$oid;
                    router.push(`/cong-trinh/${targetId}`);
                  }}
                >
                  <RiEdit2Line size={18}></RiEdit2Line>
                </Button>
                <Button
                  type="button"
                  className="p-2 rounded-lg text-red-500 bg-white hover:bg-indigo-300 transition-colors"
                >
                  <RiDeleteBinLine size={18}></RiDeleteBinLine>
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
      {/* INFO + PAGINATION */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Hiển thị {start + 1} - {Math.min(end, Number(totalItems))} của{" "}
          {totalItems} công trình
        </p>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
