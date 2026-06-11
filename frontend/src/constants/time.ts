const currentYear = new Date().getFullYear(); 
// Lưu ý: JavaScript Month chạy từ 0 đến 11, nên cần cộng 1 để ra đúng số tháng thực tế
const currentMonth = new Date().getMonth() + 1; 
const startYear = 2025;

// 1. Hàm sinh danh sách tháng dựa theo năm được chọn
export const getMonthOptions = (selectedYear:number) => {
  const allMonths = [
    { value: 1, label: 'Tháng 01' },
    { value: 2, label: 'Luỹ kế đến Tháng 02' },
    { value: 3, label: 'Luỹ kế đến Tháng 03' },
    { value: 4, label: 'Luỹ kế đến Tháng 04' },
    { value: 5, label: 'Luỹ kế đến Tháng 05' },
    { value: 6, label: 'Luỹ kế đến Tháng 06' },
    { value: 7, label: 'Luỹ kế đến Tháng 07' },
    { value: 8, label: 'Luỹ kế đến Tháng 08' },
    { value: 9, label: 'Luỹ kế đến Tháng 09' },
    { value: 10, label: 'Luỹ kế đến Tháng 10' },
    { value: 11, label: 'Luỹ kế đến Tháng 11' },
    { value: 12, label: 'Luỹ kế đến Tháng 12' },
  ];

  // Nếu năm được chọn là năm hiện tại, lọc lấy các tháng <= tháng hiện tại
  if (Number(selectedYear) === currentYear) {
    return allMonths.filter(month => month.value <= currentMonth);
  }

  // Nếu là năm khác (ví dụ năm quá khứ), hiện đủ 12 tháng
  return allMonths;
};

// 2. Tự động sinh mảng từ năm 2025 đến năm hiện tại
export const YEAR_OPTIONS = Array.from(
  { length: currentYear - startYear + 1 }, 
  (_, index) => {
    const year = startYear + index;
    return {
      value: year,
      label: `Năm ${year}`
    };
  }
);