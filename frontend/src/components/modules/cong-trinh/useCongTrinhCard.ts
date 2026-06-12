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
  // 2. Thêm state lưu Trạng thái Card đang được click lọc
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
      month: number | string,
      year: number | string,
      isSettled: boolean,
    ) => {
      if (!createdAt) return false;

      const date = new Date(createdAt);
      if (isNaN(date.getTime())) return false;

      const projectMonth = date.getMonth() + 1;
      const projectYear = date.getFullYear();

      const targetYear = +year;
      const targetMonth = +month;

      // TRƯỜNG HỢP 1: Công trình thuộc năm cũ (nhỏ hơn năm được chọn) VÀ chưa quyết toán
      if (projectYear < targetYear && !isSettled) {
        return true; // Phải tính luôn cho năm hiện tại
      }

      // TRƯỜNG HỢP 2: Công trình thuộc chính năm được chọn
      if (projectYear === targetYear) {
        // Tháng phải nằm trong khoảng từ tháng 1 đến tháng được chọn
        return projectMonth <= targetMonth;
      }

      // Các trường hợp còn lại (năm cũ đã quyết toán, hoặc công trình thuộc năm tương lai)
      return false;
    };

    // Hàm helper tính toán phần trăm/số lượng chênh lệch dạng hiển thị (+1, -2, 0)
    const getChangeText = (current: number, last: number) => {
      const diff = current - last;
      return diff >= 0 ? `+ ${diff} công trình` : `${diff} công trình`;
    };

    const getPercentText = (total: number, last: number) => {
      const diff = Math.round((last / total) * 100);
      return diff >= 0 ? `${diff}% công trình` : `Chưa xác định`;
    };

    // --- CARD 1: TỔNG CÔNG TRÌNH ---
    const currentTotal = dsCongTrinh.filter((e) => {
      if (!e.ngay_tao_du_an) return false;

      const dateNoiTao = new Date(e.ngay_tao_du_an);
      const projectYear = dateNoiTao.getFullYear();
      const projectMonth = dateNoiTao.getMonth() + 1;

      const targetYear = +selectedYear;
      const targetMonth = +selectedMonth;

      // 1. Nếu công trình khởi tạo trong chính năm được chọn (2026)
      if (projectYear === targetYear) {
        return projectMonth <= targetMonth; // Thỏa mãn từ tháng 1 đến tháng được chọn
      }

      // 2. Nếu công trình thuộc năm cũ (2025, 2024...)
      if (projectYear < targetYear) {
        const quyetToanStage = e.giai_doan?.[8];

        // TRƯỜNG HỢP A: Công trình chưa quyết toán -> Chắc chắn tính cho năm 2026
        if (!quyetToanStage) return true;

        // TRƯỜNG HỢP B: Đã quyết toán -> Phải xem ngày quyết toán có thuộc năm đang lọc không
        const ngayQuyetToan = quyetToanStage.ngay_thuc_hien;
        if (ngayQuyetToan) {
          const dateQT = new Date(ngayQuyetToan);
          const qtYear = dateQT.getFullYear();
          const qtMonth = dateQT.getMonth() + 1;

          // Nếu quyết toán rơi vào đúng năm đang lọc và nằm trong khoảng tháng được chọn
          return qtYear === targetYear && qtMonth <= targetMonth;
        }
      }

      return false;
    }).length;
    const lastTotal = dsCongTrinh.filter((e) => {
      // Kiểm tra nếu có giai_doan[8] thì coi như đã quyết toán (true), ngược lại là false
      const isSettled = e.giai_doan && e.giai_doan[8] ? true : false;
      return isProjectInTime(e.ngay_tao_du_an, prevMonth, prevYear, isSettled);
    }).length;

    // ==========================================
    // ĐỊNH NGHĨA NHÓM MÃ HIỆU CHO TỪNG CARD (Dễ quản lý, tránh sai index)
    // ==========================================
    const MA_THI_CONG_NT = ["TC", "NT"]; // TC: Thi công, NT: Nghiệm thu
    const MA_QUYET_TOAN = ["DT_PS", "TTR_DT_PS", "PD_DT_PS"]; // PD_DT_PS: Phê duyệt điều chỉnh,

    // ==========================================
    // --- CARD 2: ĐANG THI CÔNG ---
    // ==========================================
    const currentThiCong = dsCongTrinh.filter((e) => {
      const isSettled = e.giai_doan && e.giai_doan[8] ? true : false;
      const isInTime = isProjectInTime(
        e.ngay_tao_du_an,
        selectedMonth,
        selectedYear,
        isSettled,
      );

      if (!isInTime || !e.giai_doan) return false;

      const lastMaHieu = e.giai_doan.at(-1)?.ma_hieu || "";
      const isMatch = MA_THI_CONG_NT.includes(lastMaHieu);

      return isMatch;
    }).length;

    const lastThiCong = dsCongTrinh.filter((e) => {
      const isSettled = e.giai_doan && e.giai_doan[8] ? true : false;
      return (
        isProjectInTime(e.ngay_tao_du_an, prevMonth, prevYear, isSettled) &&
        e.giai_doan?.at(-1)?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu
      );
    }).length;

    // ==========================================
    // --- CARD 3: ĐANG QUYẾT TOÁN ---
    // ==========================================
    const currentQuyetToan = dsCongTrinh.filter((e) => {
      const isSettled = e.giai_doan && e.giai_doan[8] ? true : false;
      const isInTime = isProjectInTime(
        e.ngay_tao_du_an,
        selectedMonth,
        selectedYear,
        isSettled,
      );
      if (!isInTime || !e.giai_doan) return false;

      const lastMaHieu = e.giai_doan.at(-1)?.ma_hieu || "";

      // Kiểm tra mã hiệu cuối cùng có phải là "PD_DT_PS" hoặc "QT" không
      return MA_QUYET_TOAN.includes(lastMaHieu);
    }).length;

    const lastQuyetToan = dsCongTrinh.filter((e) => {
      const isSettled = e.giai_doan && e.giai_doan[8] ? true : false;
      return (
        isProjectInTime(e.ngay_tao_du_an, prevMonth, prevYear, isSettled) &&
        e.giai_doan?.at(-1)?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu
      );
    }).length;
    // --- CARD 4: HOÀN THÀNH (Mã hiệu cuối cùng là "HT") ---
    // (Bạn hãy check lại mã hiệu viết tắt của Hoàn thành trong DB của bạn xem có phải "HT" không nhé)
    const currentHoanThanh = dsCongTrinh.filter((e) => {
      // 1. Kiểm tra xem công trình đã đi đến giai đoạn cuối cùng (Quyết toán) chưa
      const isAtLastStage =
        e.giai_doan?.at(-1)?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu;
      if (!isAtLastStage) return false;

      // 2. Lấy ngày cập nhật hoặc ngày tạo của giai đoạn quyết toán này
      const ngayQuyetToan =
        e.giai_doan?.at(-1)?.ngay_thuc_hien ||
        e.giai_doan?.at(-1)?.ngay_thuc_hien;
      if (!ngayQuyetToan) return false;

      // 3. Kiểm tra ngày quyết toán này có nằm trong năm/tháng đang được chọn hay không
      const date = new Date(ngayQuyetToan);
      if (isNaN(date.getTime())) return false;

      const quyetToanMonth = date.getMonth() + 1;
      const quyetToanYear = date.getFullYear();

      // Thỏa mãn nếu thuộc năm được chọn VÀ hoàn thành từ tháng 1 đến tháng được chọn (hoặc bằng chính tháng đó)
      return (
        quyetToanYear === +selectedYear && quyetToanMonth <= +selectedMonth
      );
    }).length;

    const lastHoanThanh = dsCongTrinh.filter((e) => {
      const isSettled = e.giai_doan && e.giai_doan[8] ? true : false;
      return (
        isProjectInTime(e.ngay_tao_du_an, prevMonth, prevYear, isSettled) &&
        e.giai_doan?.at(-1)?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu
      );
    }).length;
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
        new Date(e.updatedAt || e.ngay_tao_du_an).getTime(),
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
    const totalProjectsThangNay = dsCongTrinh.filter((e) => {
      const isSettled = e.giai_doan && e.giai_doan[8] ? true : false;
      return isProjectInTime(
        e.updatedAt,
        selectedMonth,
        selectedYear,
        isSettled,
      );
    });

    // 2. Nhóm Đang thi công
    const thiCongThangNay = dsCongTrinh.filter((e) => {
      const isSettled = e.giai_doan && e.giai_doan[8] ? true : false;
      return (
        isProjectInTime(
          e.updatedAt,
          selectedMonth,
          selectedYear,
          isSettled,
        ) &&
        e.giai_doan
          ?.at(-1)
          ?.ma_hieu.includes(
            MA_HIEU_MAPPING[3].ma_hieu || MA_HIEU_MAPPING[4].ma_hieu,
          )
      );
    });

    // 3. Nhóm Đang quyết toán
    const quyetToanThangNay = dsCongTrinh.filter((e) => {
      const isSettled = e.giai_doan && e.giai_doan[8] ? true : false;
      return (
        isProjectInTime(
          e.updatedAt,
          selectedMonth,
          selectedYear,
          isSettled,
        ) &&
        e.giai_doan
          ?.at(-1)
          ?.ma_hieu.includes(
            MA_HIEU_MAPPING[5].ma_hieu ||
              MA_HIEU_MAPPING[6].ma_hieu ||
              MA_HIEU_MAPPING[7].ma_hieu,
          )
      );
    });

    // 4. Nhóm Hoàn thành
    const hoanThanhThangNay = dsCongTrinh.filter((e) => {
      const isSettled = e.giai_doan && e.giai_doan[8] ? true : false;
      return (
        isProjectInTime(
          e.updatedAt,
          selectedMonth,
          selectedYear,
          isSettled,
        ) && e.giai_doan?.at(-1)?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu
      );
    });

    //CARD TÔNG QUYẾT TOÁN
    const listQT = dsCongTrinh.filter(
      (e) => e.giai_doan?.at(-1)?.ma_hieu === MA_HIEU_MAPPING[8].ma_hieu,
    );
    const dsQuyetToan = listQT.length;
    const tongQuyetToan = listQT.reduce(
      (sum, item) => sum + (Number(item.giai_doan?.at(-1)?.tong_gia_tri) || 0),
      0,
    );

     const cpxdQuyetToan = listQT.reduce(
      (sum, item) => sum + (Number(item.giai_doan?.at(-1)?.chi_phi_xay_dung) || 0),
      0,
    );
    //CARD TÔNG DỰ TOÁN
    // Định nghĩa sẵn mã hiệu để code gọn hơn
    const MA_HIEU_7 = MA_HIEU_MAPPING[7].ma_hieu;
    const MA_HIEU_2 = MA_HIEU_MAPPING[2].ma_hieu;

    let tongDuToan = 0;
    let tongCPXD = 0;
    let listDTLength = 0;

    dsCongTrinh?.forEach((item) => {
      // 1. Tìm giai đoạn hợp lệ (Ưu tiên tìm giai đoạn 7, nếu không thấy thì tìm giai đoạn 2)
      const targetGiaiDoan =
        item.giai_doan?.find((gd) => gd?.ma_hieu === MA_HIEU_7) ||
        item.giai_doan?.find((gd) => gd?.ma_hieu === MA_HIEU_2);

      // 2. Nếu tìm thấy một trong hai giai đoạn thì tiến hành cộng dồn
      if (targetGiaiDoan) {
        tongDuToan += Number(targetGiaiDoan.tong_gia_tri || 0);
        tongCPXD += Number(targetGiaiDoan.chi_phi_xay_dung || 0);
        listDTLength++; // Tăng số lượng công trình thỏa mãn điều kiện
      }
    });

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
        percent: getPercentText(currentTotal, currentThiCong),
      },
      quyetToan: {
        current: currentQuyetToan,
        last: lastQuyetToan,
        quyetToanRatio: quyetToanRatio,
        change: getChangeText(currentQuyetToan, lastQuyetToan),
        timeAgo: getTimeAgo(quyetToanThangNay),
        percent: getPercentText(currentTotal, currentQuyetToan),
        dsQuyetToan: dsQuyetToan,
        tongQuyetToan: tongQuyetToan,
        tongCPXD: cpxdQuyetToan,
      },
      hoanThanh: {
        current: currentHoanThanh,
        last: lastHoanThanh,
        hoanThanhRatio: hoanThanhRatio,
        change: getChangeText(currentHoanThanh, lastHoanThanh),
        timeAgo: getTimeAgo(hoanThanhThangNay),
        percent: getPercentText(currentTotal, currentHoanThanh),
      },
      dutoan: {
        tongDuToan: tongDuToan,
        tongCPXD: tongCPXD,
        dsDuToan: listDTLength,
      },
    };
  }, [dsCongTrinh, selectedMonth, selectedYear]);
};
