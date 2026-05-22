import { ICongTrinh } from "@/services/congTrinhService";
import { useMemo } from "react";
import { MA_HIEU_MAPPING } from "./GiaiDoan";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";

interface UseProjectStatsParams {
  dsCongTrinh: ICongTrinh[];
  selectedMonth: number;
  selectedYear: number;
}

export const useCongTrinhCard = ({
  dsCongTrinh,
  selectedMonth,
  selectedYear,
}: UseProjectStatsParams) => {
  return useMemo(() => {
    // Trả về giá trị mặc định nếu dữ liệu chưa hợp lệ
    if (!dsCongTrinh || !Array.isArray(dsCongTrinh)) {
      return {
        total: { current: 0, last: 0, change: "0" },
        thiCong: { current: 0, last: 0, change: "0" },
        quyetToan: { current: 0, last: 0, change: "0" },
        hoanThanh: { current: 0, last: 0, change: "0" },
      };
    }

    // 1. Tính toán mốc thời gian tháng trước
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;

    // Hàm helper dùng chung để kiểm tra xem một công trình có thuộc tháng/năm cụ thể hay không
    const isProjectInTime = (
      createdAt: string | Date,
      month: number,
      year: number,
    ) => {
      const date = new Date(createdAt);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    };

    // Hàm helper tính toán phần trăm/số lượng chênh lệch dạng hiển thị (+1, -2, 0)
    const getChangeText = (current: number, last: number) => {
      const diff = current - last;
      return diff >= 0 ? `+ ${diff} công trình` : `${diff} công trình`;
    };

    // --- CARD 1: TỔNG CÔNG TRÌNH ---
    const currentTotal = dsCongTrinh.filter((e) =>
      isProjectInTime(e.createdAt, selectedMonth, selectedYear),
    ).length;
    const lastTotal = dsCongTrinh.filter((e) =>
      isProjectInTime(e.createdAt, prevMonth, prevYear),
    ).length;

    // --- CARD 2: ĐANG THI CÔNG (Mã hiệu cuối cùng là "TC") ---
    const currentThiCong = dsCongTrinh.filter(
      (e) =>
        isProjectInTime(e.createdAt, selectedMonth, selectedYear) &&
        e.giai_doan
          ?.at(-1)
          ?.ma_hieu.includes(
            MA_HIEU_MAPPING[3].ma_hieu || MA_HIEU_MAPPING[4].ma_hieu,
          ),
    ).length;
    const lastThiCong = dsCongTrinh.filter(
      (e) =>
        isProjectInTime(e.createdAt, prevMonth, prevYear) &&
        e.giai_doan
          ?.at(-1)
          ?.ma_hieu.includes(
            MA_HIEU_MAPPING[3].ma_hieu || MA_HIEU_MAPPING[4].ma_hieu,
          ),
    ).length;

    // --- CARD 3: ĐANG QUYẾT TOÁN (Mã hiệu cuối cùng là "QT") ---
    // (Bạn hãy check lại mã hiệu viết tắt của Đang quyết toán trong DB của bạn xem có phải "QT" không nhé)
    const currentQuyetToan = dsCongTrinh.filter(
      (e) =>
        isProjectInTime(e.createdAt, selectedMonth, selectedYear) &&
        e.giai_doan
          ?.at(-1)
          ?.ma_hieu.includes(
            MA_HIEU_MAPPING[5].ma_hieu ||
              MA_HIEU_MAPPING[6].ma_hieu ||
              MA_HIEU_MAPPING[7].ma_hieu,
          ),
    ).length;
    const lastQuyetToan = dsCongTrinh.filter(
      (e) =>
        isProjectInTime(e.createdAt, prevMonth, prevYear) &&
        e.giai_doan
          ?.at(-1)
          ?.ma_hieu.includes(
            MA_HIEU_MAPPING[5].ma_hieu ||
              MA_HIEU_MAPPING[6].ma_hieu ||
              MA_HIEU_MAPPING[7].ma_hieu,
          ),
    ).length;

    // --- CARD 4: HOÀN THÀNH (Mã hiệu cuối cùng là "HT") ---
    // (Bạn hãy check lại mã hiệu viết tắt của Hoàn thành trong DB của bạn xem có phải "HT" không nhé)
    const currentHoanThanh = dsCongTrinh.filter(
      (e) =>
        isProjectInTime(e.createdAt, selectedMonth, selectedYear) &&
        e.giai_doan?.at(-1)?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu,
    ).length;
    const lastHoanThanh = dsCongTrinh.filter(
      (e) =>
        isProjectInTime(e.createdAt, prevMonth, prevYear) &&
        e.giai_doan?.at(-1)?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu,
    ).length;
    // --- Tìm đến phần return ở cuối useMemo của file useProjectStats.ts ---
    const thiCongRatio =
      currentTotal > 0 ? Math.round((currentThiCong / currentTotal) * 100) : 0;

    const quyetToanRatio =
      currentTotal > 0
        ? Math.round((currentQuyetToan / currentTotal) * 100)
        : 0;

    const hoanThanhRatio =
      currentTotal > 0
        ? Math.round((currentHoanThanh / currentTotal) * 100)
        : 0;

    const getTimeAgo = (filteredProjects: ICongTrinh[]) => {
      if (!filteredProjects || filteredProjects.length === 0)
        return "Chưa có cập nhật";

      // Lấy danh sách các mốc timestamp updatedAt
      const timestamps = filteredProjects.map((e) =>
        new Date(e.updatedAt || e.createdAt).getTime(),
      );

      // Tìm timestamp lớn nhất (gần nhất với hiện tại)
      const latestTimestamp = Math.max(...timestamps);

      // Biến đổi thành chuỗi dạng "15 phút trước", "2 giờ trước"
      return formatDistanceToNow(new Date(latestTimestamp), {
        addSuffix: true,
        locale: vi,
      });
    };
    // --- BẮD ĐẦU LOGIC LỌC VÀ ĐẾM CHO TỪNG CARD ---

    // 1. Nhóm Tổng công trình
    const totalProjectsThangNay = dsCongTrinh.filter((e) =>
      isProjectInTime(e.createdAt, selectedMonth, selectedYear),
    );

    // 2. Nhóm Đang thi công
    const thiCongThangNay = dsCongTrinh.filter(
      (e) =>
        isProjectInTime(e.createdAt, selectedMonth, selectedYear) &&
        e.giai_doan
          ?.at(-1)
          ?.ma_hieu.includes(
            MA_HIEU_MAPPING[3].ma_hieu || MA_HIEU_MAPPING[4].ma_hieu,
          ),
    );

    // 3. Nhóm Đang quyết toán
    const quyetToanThangNay = dsCongTrinh.filter(
      (e) =>
        isProjectInTime(e.createdAt, selectedMonth, selectedYear) &&
        e.giai_doan
          ?.at(-1)
          ?.ma_hieu.includes(
            MA_HIEU_MAPPING[5].ma_hieu ||
              MA_HIEU_MAPPING[6].ma_hieu ||
              MA_HIEU_MAPPING[7].ma_hieu,
          ),
    );

    // 4. Nhóm Hoàn thành
    const hoanThanhThangNay = dsCongTrinh.filter(
      (e) =>
        isProjectInTime(e.createdAt, selectedMonth, selectedYear) &&
        e.giai_doan?.at(-1)?.ma_hieu ===  MA_HIEU_MAPPING[8].ma_hieu,
    );
    // 2. Trả về object chứa đầy đủ cấu trúc dữ liệu sạch cho UI sử dụng
    return {
      total: {
        current: currentTotal,
        last: lastTotal,
        change: getChangeText(currentTotal, lastTotal),
        timeAgo: getTimeAgo(totalProjectsThangNay),
      },
      thiCong: {
        current: currentThiCong,
        last: lastThiCong,
        thiCongRatio: thiCongRatio,
        change: getChangeText(currentThiCong, lastThiCong),
        timeAgo: getTimeAgo(thiCongThangNay),
      },
      quyetToan: {
        current: currentQuyetToan,
        last: lastQuyetToan,
        quyetToanRatio: quyetToanRatio,
        change: getChangeText(currentQuyetToan, lastQuyetToan),
        timeAgo: getTimeAgo(quyetToanThangNay),
      },
      hoanThanh: {
        current: currentHoanThanh,
        last: lastHoanThanh,
        hoanThanhRatio: hoanThanhRatio,
        change: getChangeText(currentHoanThanh, lastHoanThanh),
        timeAgo: getTimeAgo(hoanThanhThangNay),
      },
    };
  }, [dsCongTrinh, selectedMonth, selectedYear]);
};
