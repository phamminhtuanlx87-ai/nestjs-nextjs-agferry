import Swal from "sweetalert2";

// 1. Cấu hình Toast (Thông báo nhỏ ở góc)
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

// 2. Các hàm tiện ích để gọi nhanh
export const alertService = {
  // Thông báo Toast thành công
  success: (title: string) => {
    Toast.fire({
      icon: "success",
      title: title,
    });
  },

  // Thông báo Toast lỗi
  error: (title: string) => {
    Toast.fire({
      icon: "error",
      title: title,
    });
  },

  // Thông báo Toast cảnh báo
  warning: (title: string) => {
    Toast.fire({
      icon: "warning",
      title: title,
    });
  },

  // Hộp thoại xác nhận xóa (Custom cho đẹp như yêu cầu trước của bạn)
  confirmDelete: async ({ title = "Cảnh báo", itemCode = "", itemName = "" }) => {
    return Swal.fire({
      title: `<span style="font-size: 20px; font-weight: 600; color: #1a202c;">${title}</span>`,
      html: `
    <div style="text-align: center;">
      <p style="color: #4a5568; margin-bottom: 10px;">Bạn có chắc chắn muốn xóa:</p>
      ${itemCode !== "" ? `<b style="color: #e53e3e; font-size: 16px;">Mã: ${itemCode}</b><br/>` : ""}
      <b style="color: #e53e3e; font-size: 18px;">${itemName !== "" ? `Công trình: ${itemName}` : `${itemName}`}</b>
      <p style="font-size: 13px; color: #718096; margin-top: 15px;">
        (Dữ liệu sẽ được chuyển vào mục lưu trữ tạm thời)
      </p>
    </div>
  `,
      icon: "warning",
      iconColor: "#ecc94b",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#a0aec0",
      confirmButtonText: "Xác nhận xóa",
      cancelButtonText: "Quay lại",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl", // Bo góc xịn xò
      },
    });
  },
};
