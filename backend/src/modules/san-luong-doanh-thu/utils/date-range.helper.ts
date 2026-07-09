import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
dayjs.extend(quarterOfYear);

export function getDateRange(timeType: string) {
  const now = dayjs();
  let fromDate = now.startOf('month'); // Mặc định là đầu tháng này
  let toDate = now.endOf('month'); // Mặc định là cuối tháng này

  switch (timeType) {
    case 'HOM_NAY':
      fromDate = now.clone().startOf('day');
      toDate = now.clone().endOf('day');
      break;

    case 'BAY_NGAY_GAN_NHAT':
      fromDate = now.clone().subtract(7, 'days').startOf('day');
      toDate = now.clone().endOf('day');
      break;

    case 'BA_MUOI_NGAY_GAN_NHAT':
      fromDate = now.clone().subtract(30, 'days').startOf('day');
      toDate = now.clone().endOf('day');
      break;

    case 'THANG_NAY':
      fromDate = now.clone().startOf('month');
      toDate = now.clone().endOf('month');
      break;

    case 'QUI_NAY':
      fromDate = now.clone().startOf('quarter'); // Sửa lỗi tham số 'quarter' bằng cách dùng moment chuẩn hóa
      toDate = now.clone().endOf('quarter');
      break;

    case 'NAM_NAY':
      fromDate = now.clone().startOf('year');
      toDate = now.clone().endOf('year');
      break;

    case 'TUY_CHON':
      // Đối với tùy chọn, thông thường bạn sẽ cần 2 ô Input Date riêng biệt
      // Tạm thời để mặc định tháng này nếu không truyền từ-ngày đến-ngày riêng
      fromDate = now.clone().startOf('month');
      toDate = now.clone().endOf('month');
      break;

    default:
      fromDate = now.clone().startOf('month');
      toDate = now.clone().endOf('month');
  }

  return {
    fromDate: fromDate.toDate(),
    toDate: toDate.toDate(),
  };
}

/**
 * Hàm lấy khoảng thời gian quá khứ dựa vào cấu hình "So sánh với"
 */
export function getCompareDateRange(timeType: string, compareType: string) {
  // 1. Trường hợp không đối chiếu: Trả về null hoặc khoảng ngày rỗng để không query DB so sánh
  if (compareType === 'KHONG_DOI_CHIEU') {
    return {
      compareFromDate: null,
      compareToDate: null,
    };
  }

  // Lấy range của kỳ hiện tại trước để làm mốc lùi thời gian
  const currentRange = getDateRange(timeType);
  const currentFrom = dayjs(currentRange.fromDate);
  const currentTo = dayjs(currentRange.toDate);

  let compareFromDate = currentFrom;
  let compareToDate = currentTo;

  // Tính số ngày chênh lệch của kỳ hiện tại (để xử lý cho các case động như 7 ngày, 30 ngày)
  const daysDiff = currentTo.diff(currentFrom, 'day') + 1;

  switch (compareType) {
    case 'KY_TRUOC':
      // Dựa vào loại thời gian hiện tại để lùi kỳ trước một cách chính xác nhất
      switch (timeType) {
        case 'HOM_NAY':
          // Kỳ trước của Hôm nay -> Hôm qua
          compareFromDate = currentFrom.subtract(1, 'day');
          compareToDate = currentTo.subtract(1, 'day');
          break;

        case 'THANG_NAY':
          // Kỳ trước của Tháng này -> Tháng trước
          compareFromDate = currentFrom.subtract(1, 'month').startOf('month');
          compareToDate = currentTo.subtract(1, 'month').endOf('month');
          break;

        case 'QUI_NAY':
          // Kỳ trước của Quý này -> Quý trước (Lùi 3 tháng)
          compareFromDate = currentFrom.subtract(3, 'month').startOf('month');
          compareToDate = currentTo.subtract(3, 'month').endOf('month');
          break;

        case 'NAM_NAY':
          // Kỳ trước của Năm nay -> Năm trước
          compareFromDate = currentFrom.subtract(1, 'year').startOf('year');
          compareToDate = currentTo.subtract(1, 'year').endOf('year');
          break;

        case 'BAY_NGAY_GAN_NHAT':
        case 'BA_MUOI_NGAY_GAN_NHAT':
        case 'TUY_CHON':
        default:
          // Đối với khoảng ngày bất kỳ (vừa qua bao nhiêu ngày thì lùi lại bấy nhiêu ngày)
          compareFromDate = currentFrom.subtract(daysDiff, 'day');
          compareToDate = currentTo.subtract(daysDiff, 'day');
          break;
      }
      break;

    case 'CUNG_KY_NAM_TRUOC':
      // Luôn luôn lùi chính xác 1 năm (12 tháng) so với mốc hiện tại
      compareFromDate = currentFrom.subtract(1, 'year');
      compareToDate = currentTo.subtract(1, 'year');
      break;

    default:
      // Fallback mặc định nếu truyền sai mã
      return {
        compareFromDate: null,
        compareToDate: null,
      };
  }

  return {
    compareFromDate: compareFromDate.toDate(),
    compareToDate: compareToDate.toDate(),
  };
}
