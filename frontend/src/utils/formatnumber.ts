export const formatCurrency = (value: string) => {
  if (!value) return "";
  
  // Loại bỏ tất cả trừ số và dấu phẩy
  let cleanValue = value.replace(/[^\d,]/g, "");

  // Đảm bảo chỉ có tối đa một dấu phẩy
  const parts = cleanValue.split(",");
  if (parts.length > 2) {
    cleanValue = parts[0] + "," + parts.slice(1).join("");
  }

  // Định dạng hàng nghìn bằng dấu chấm cho phần nguyên
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  return parts.length > 1 ? `${parts[0]},${parts[1]}` : parts[0];
};

 export const parseToNumber = (value: string) => {
  if (!value) return 0;
  // Bỏ dấu chấm phân cách hàng nghìn, đổi dấu phẩy thành dấu chấm
  const clean = value.replace(/\./g, "").replace(",", ".");
  return parseFloat(clean) || 0;
};  
  

  // Hàm helper format tiền tệ - dùng hiển thị
  export const formatMoney = (value: string) => {
    if (!value && Number(value) !== 0) return "0 đ";
    return Number(value).toLocaleString("vi-VN") + " đ";
  };