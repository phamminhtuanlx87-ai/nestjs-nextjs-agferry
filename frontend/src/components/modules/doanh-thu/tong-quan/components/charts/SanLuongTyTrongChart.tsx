"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  BANG_MAU_THEO_NHOM,
  ChiTietTyTrongResponse,
  TyTrongChartResponse,
} from "../../custom-hook/charts/useDuLieuTyTrongChart";
import { FilterToolbarDto } from "../../custom-hook/useTQSanLuong";
import {
  MAPPING_BEN_PHA_FIELD,
  MAPPING_THOI_GIAN_COMBO_CHART,
} from "@/services/sanLuongService";
import dayjs from "dayjs";
interface DuLieuChartProps {
  readonly duLieuTyTrongChart?: TyTrongChartResponse | null;
  readonly filters: FilterToolbarDto;
}

const SanLuongTyTrongChart = ({
  duLieuTyTrongChart,
  filters,
}: DuLieuChartProps) => {
  const filerLable = (label: string) => {
    if (label === "HOM_NAY") {
      const now = dayjs();
      return (
        MAPPING_THOI_GIAN_COMBO_CHART[
          label as keyof typeof MAPPING_THOI_GIAN_COMBO_CHART
        ] +
        " " +
        dayjs(now).subtract(1, "days").format("DD/MM/YYYY")
      );
    }

    if (label === "HOM_QUA") {
      const now = dayjs();
      return (
        MAPPING_THOI_GIAN_COMBO_CHART[
          label as keyof typeof MAPPING_THOI_GIAN_COMBO_CHART
        ] +
        " " +
        dayjs(now).subtract(2, "days").format("DD/MM/YYYY")
      );
    }
    return MAPPING_THOI_GIAN_COMBO_CHART[
      label as keyof typeof MAPPING_THOI_GIAN_COMBO_CHART
    ];
  };
  return (
    <>
      <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-dashed border-slate-300 flex flex-col justify-between min-h-70">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
          🍩 Biểu đồ tỷ trọng sản lượng -{" "}
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-full border border-blue-100">
            {filters?.time &&
            MAPPING_THOI_GIAN_COMBO_CHART[
              filters.time as keyof typeof MAPPING_THOI_GIAN_COMBO_CHART
            ]
              ? filerLable(filters?.time)
              : ""}
          </span>
          {/* 2. Trạng thái Phạm vi bến (Đảm bảo đồng bộ chuẩn mã ALL hoặc TAT_CA_BEN theo service của bạn) */}
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-100">
            {filters?.location &&
            MAPPING_BEN_PHA_FIELD[
              filters.location as keyof typeof MAPPING_BEN_PHA_FIELD
            ]
              ? MAPPING_BEN_PHA_FIELD[
                  filters.location as keyof typeof MAPPING_BEN_PHA_FIELD
                ]
              : "Tất cả bến phà"}
          </span>
        </h3>
        {/* biểu đồ sản lượng vé luot */}
        {duLieuTyTrongChart?.ve_luot &&
        duLieuTyTrongChart?.ve_luot.length > 0 ? (
          <div className="flex items-center gap-6">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={duLieuTyTrongChart?.ve_luot}
                    dataKey="san_luong"
                    nameKey="nhan"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    // Bỏ hẳn prop "label" -> không còn chữ % đè lên lát cắt nữa
                  >
                    {duLieuTyTrongChart?.ve_luot.map((item) => (
                      <Cell
                        key={item.nhom}
                        fill={
                          BANG_MAU_THEO_NHOM[
                            item.nhom as keyof typeof BANG_MAU_THEO_NHOM
                          ] ?? "#cccccc"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, item) => {
                      const duLieuGoc =
                        item.payload as unknown as ChiTietTyTrongResponse;
                      return [
                        `${Number(value).toLocaleString("vi-VN")} lượt (${duLieuGoc.ty_trong_san_luong}%)`,
                        name,
                      ];
                    }}
                  />
                  {/* Bỏ <Legend /> mặc định -> thay bằng danh sách tự viết bên phải */}
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-1/2 flex flex-col gap-2">
              {/* TODO 1: sắp xếp du_lieu giảm dần theo ty_trong_san_luong trước khi map,
              để nhóm lớn nhất hiện lên đầu danh sách (dễ đọc hơn thứ tự ngẫu nhiên từ API) */}
              {duLieuTyTrongChart?.ve_luot.map((item) => (
                <div
                  key={item.nhom}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {/* Chấm tròn màu, PHẢI dùng chung BANG_MAU_THEO_NHOM để khớp màu với donut */}
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{
                        backgroundColor:
                          BANG_MAU_THEO_NHOM[
                            item.nhom as keyof typeof BANG_MAU_THEO_NHOM
                          ] ?? "#cccccc",
                      }}
                    />
                    <span>{item.nhan}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      {/* TODO 2: format số bằng toLocaleString('vi-VN') giống Tooltip đã làm */}
                    </span>
                    <span className="font-semibold w-12 text-right">
                      {item.ty_trong_san_luong}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium italic">
            Không có dữ liệu hiển thị Vé lượt{" "}
          </div>
        )}
        {/* biểu đồ sản lượng vé kỳ */}
        {duLieuTyTrongChart?.ve_ky && duLieuTyTrongChart?.ve_ky.length > 0 ? (
          <div className="flex items-center gap-6">
            {/* Cột trái: chỉ vẽ donut, KHÔNG dùng label và KHÔNG dùng Legend mặc định */}
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={duLieuTyTrongChart?.ve_ky}
                    dataKey="san_luong"
                    nameKey="nhan"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    // Bỏ hẳn prop "label" -> không còn chữ % đè lên lát cắt nữa
                  >
                    {duLieuTyTrongChart?.ve_ky.map((item) => (
                      <Cell
                        key={item.nhom}
                        fill={
                          BANG_MAU_THEO_NHOM[
                            item.nhom as keyof typeof BANG_MAU_THEO_NHOM
                          ] ?? "#cccccc"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, item) => {
                      const duLieuGoc =
                        item.payload as unknown as ChiTietTyTrongResponse;
                      return [
                        `${Number(value).toLocaleString("vi-VN")} lượt (${duLieuGoc.ty_trong_san_luong}%)`,
                        name,
                      ];
                    }}
                  />
                  {/* Bỏ <Legend /> mặc định -> thay bằng danh sách tự viết bên phải */}
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Cột phải: danh sách chi tiết tự dựng */}
            <div className="w-1/2 flex flex-col gap-2">
              {/* TODO 1: sắp xếp du_lieu giảm dần theo ty_trong_san_luong trước khi map,
              để nhóm lớn nhất hiện lên đầu danh sách (dễ đọc hơn thứ tự ngẫu nhiên từ API) */}
              {duLieuTyTrongChart?.ve_ky.map((item) => (
                <div
                  key={item.nhom}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {/* Chấm tròn màu, PHẢI dùng chung BANG_MAU_THEO_NHOM để khớp màu với donut */}
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{
                        backgroundColor:
                          BANG_MAU_THEO_NHOM[
                            item.nhom as keyof typeof BANG_MAU_THEO_NHOM
                          ] ?? "#cccccc",
                      }}
                    />
                    <span>{item.nhan}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      {/* TODO 2: format số bằng toLocaleString('vi-VN') giống Tooltip đã làm */}
                    </span>
                    <span className="font-semibold w-12 text-right">
                      {item.ty_trong_san_luong}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium italic">
            Không có dữ liệu hiển thị Vé định kỳ
          </div>
        )}
      </div>
      <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-dashed border-slate-300 flex flex-col justify-between min-h-70">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
          🍩 Biểu đồ tỷ trọng doanh thu -{" "}
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-full border border-blue-100">
            {filters?.time &&
            MAPPING_THOI_GIAN_COMBO_CHART[
              filters.time as keyof typeof MAPPING_THOI_GIAN_COMBO_CHART
            ]
              ? filerLable(filters?.time)
              : ""}
          </span>
          {/* 2. Trạng thái Phạm vi bến (Đảm bảo đồng bộ chuẩn mã ALL hoặc TAT_CA_BEN theo service của bạn) */}
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-100">
            {filters?.location &&
            MAPPING_BEN_PHA_FIELD[
              filters.location as keyof typeof MAPPING_BEN_PHA_FIELD
            ]
              ? MAPPING_BEN_PHA_FIELD[
                  filters.location as keyof typeof MAPPING_BEN_PHA_FIELD
                ]
              : "Tất cả bến phà"}
          </span>
        </h3>
        {duLieuTyTrongChart?.ve_luot &&
        duLieuTyTrongChart?.ve_luot.length > 0 ? (
          <div className="flex items-center gap-6">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={duLieuTyTrongChart?.ve_luot}
                    dataKey="doanh_thu"
                    nameKey="nhan"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    // Bỏ hẳn prop "label" -> không còn chữ % đè lên lát cắt nữa
                  >
                    {duLieuTyTrongChart?.ve_luot.map((item) => (
                      <Cell
                        key={item.nhom}
                        fill={
                          BANG_MAU_THEO_NHOM[
                            item.nhom as keyof typeof BANG_MAU_THEO_NHOM
                          ] ?? "#cccccc"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, item) => {
                      const duLieuGoc =
                        item.payload as unknown as ChiTietTyTrongResponse;
                      return [
                        `${Number(value).toLocaleString("vi-VN")} đồng (${duLieuGoc.ty_trong_doanh_thu}%)`,
                        name,
                      ];
                    }}
                  />
                  {/* Bỏ <Legend /> mặc định -> thay bằng danh sách tự viết bên phải */}
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-1/2 flex flex-col gap-2">
              {duLieuTyTrongChart?.ve_luot.map((item) => (
                <div
                  key={item.nhom}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {/* Chấm tròn màu, PHẢI dùng chung BANG_MAU_THEO_NHOM để khớp màu với donut */}
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{
                        backgroundColor:
                          BANG_MAU_THEO_NHOM[
                            item.nhom as keyof typeof BANG_MAU_THEO_NHOM
                          ] ?? "#cccccc",
                      }}
                    />
                    <span>{item.nhan}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      {/* TODO 2: format số bằng toLocaleString('vi-VN') giống Tooltip đã làm */}
                    </span>
                    <span className="font-semibold w-12 text-right">
                      {item.ty_trong_doanh_thu}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium italic">
            Không có dữ liệu hiển thị Vé lượt{" "}
          </div>
        )}
        {/* biểu đồ sản lượng vé kỳ */}
        {duLieuTyTrongChart?.ve_ky && duLieuTyTrongChart?.ve_ky.length > 0 ? (
          <div className="flex items-center gap-6">
            {/* Cột trái: chỉ vẽ donut, KHÔNG dùng label và KHÔNG dùng Legend mặc định */}
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={duLieuTyTrongChart?.ve_ky}
                    dataKey="doanh_thu"
                    nameKey="nhan"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    // Bỏ hẳn prop "label" -> không còn chữ % đè lên lát cắt nữa
                  >
                    {duLieuTyTrongChart?.ve_ky.map((item) => (
                      <Cell
                        key={item.nhom}
                        fill={
                          BANG_MAU_THEO_NHOM[
                            item.nhom as keyof typeof BANG_MAU_THEO_NHOM
                          ] ?? "#cccccc"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, item) => {
                      const duLieuGoc =
                        item.payload as unknown as ChiTietTyTrongResponse;
                      return [
                        `${Number(value).toLocaleString("vi-VN")} đồng (${duLieuGoc.ty_trong_doanh_thu}%)`,
                        name,
                      ];
                    }}
                  />
                  {/* Bỏ <Legend /> mặc định -> thay bằng danh sách tự viết bên phải */}
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Cột phải: danh sách chi tiết tự dựng */}
            <div className="w-1/2 flex flex-col gap-2">
              {/* TODO 1: sắp xếp du_lieu giảm dần theo ty_trong_san_luong trước khi map,
              để nhóm lớn nhất hiện lên đầu danh sách (dễ đọc hơn thứ tự ngẫu nhiên từ API) */}
              {duLieuTyTrongChart?.ve_ky.map((item) => (
                <div
                  key={item.nhom}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {/* Chấm tròn màu, PHẢI dùng chung BANG_MAU_THEO_NHOM để khớp màu với donut */}
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{
                        backgroundColor:
                          BANG_MAU_THEO_NHOM[
                            item.nhom as keyof typeof BANG_MAU_THEO_NHOM
                          ] ?? "#cccccc",
                      }}
                    />
                    <span>{item.nhan}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      {/* TODO 2: format số bằng toLocaleString('vi-VN') giống Tooltip đã làm */}
                    </span>
                    <span className="font-semibold w-12 text-right">
                      {item.ty_trong_doanh_thu}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium italic">
            Không có dữ liệu hiển thị Vé định kỳ
          </div>
        )}
      </div>
    </>
  );
};

export default SanLuongTyTrongChart;
