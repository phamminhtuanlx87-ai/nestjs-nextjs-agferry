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
  confirmDelete: async ({
    title = "Cảnh báo",
    itemCode = "",
    itemName = "",
  }) => {
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

  confirmToggleActive: async ({
    title = "Xác nhận thao tác",
    itemCode = "",
    itemName = "",
  }) => {
    // 1. Kiểm tra xem hành động hiện tại có phải là khóa/ngừng hoạt động hay không
    const isDeactivating =
      itemCode.toLowerCase().includes("ngừng") ||
      title.toLowerCase().includes("ngừng");

    // 2. Cấu hình màu sắc mạnh mẽ, độ tương phản cực cao
    const themeColor = isDeactivating ? "#dc2626" : "#059669"; // Đỏ rực rỡ (Red 600) hoặc Xanh lá đậm (Green 600)
    const bgColor = isDeactivating ? "#fef2f2" : "#f0fdf4"; // Nền hồng nhạt hoặc Nền xanh khóa nhạt
    const borderColor = isDeactivating ? "#fca5a5" : "#86efac"; // Viền đỏ hồng hoặc Viền xanh lá

    // 3. Tách chữ "người dùng..." ra khỏi tiêu đề gốc để làm sạch giao diện dòng trên cùng
    const cleanTitle = title.split("người dùng")[0].trim();

    return Swal.fire({
      // Tiêu đề ngắn gọn, chữ to rõ ràng
      title: `<div style="font-size: 24px; font-weight: 800; color: ${themeColor}; line-height: 1.3; letter-spacing: -0.5px;">${cleanTitle}</div>`,
      html: `
      <div style="text-align: center; font-family: system-ui, -apple-system, sans-serif; padding: 10px 5px 0 5px;">
        <p style="color: #475569; font-size: 15px; margin-bottom: 20px; font-weight: 500;">
          Bạn có chắc chắn muốn thực hiện hành động này hệ thống?
        </p>
        
        <div style="background-color: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 16px; padding: 18px 14px; display: inline-block; width: 90%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="font-size: 12px; color: ${isDeactivating ? "#b91c1c" : "#047857"}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
            TÀI KHOẢN CHỊU THAO TÁC
          </div>
          <div style="color: #0f172a; font-size: 22px; font-weight: 800; line-height: 1.2;">
            ${itemName}
          </div>
        </div>

        <p style="font-size: 13px; color: #64748b; margin-top: 20px; font-weight: 500;">
          ⚠️ Trạng thái làm việc của nhân sự sẽ thay đổi ngay lập tức.
        </p>
      </div>
    `,
      // 🌟 THAY ĐỔI BIỂU TƯỢNG: Ngừng hoạt động hiện dấu X đỏ (error), Kích hoạt hiện dấu (success/info)
      icon: isDeactivating ? "error" : "success",
      showCancelButton: true,
      confirmButtonColor: themeColor,
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xác nhận ngay",
      cancelButtonText: "Quay lại",
      reverseButtons: true,
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-slate-100", // Tăng độ bo góc mềm mại và đổ bóng sâu
      },
    });
  },



   

  confirmLoginOffice: async () => {
    return Swal.fire({
      title: '<span style="font-size: 18px; font-weight: 600; color: #1e293b;">Lưu ý quyền xem file</span>',
      html: `
        <div style="text-align: center; text-wrap: balance;">
          <p style="color: #475569; font-size: 13px; margin-bottom: 8px;">
            Để xem tài liệu này, bạn cần đảm bảo đã đăng nhập tài khoản trên hệ thống <b style="color: #2563eb;">angiang.vnptoffice.vn</b>.
          </p>
          <p style="color: #94a3b8; font-size: 11px;">
            (Hệ thống chỉ nhắc nhở ở lần đầu tiên thao tác)
          </p>
        </div>
      `,
      icon: 'info',
      iconColor: '#3b82f6',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Đến trang đăng nhập',
      cancelButtonText: 'Tôi đã đăng nhập rồi',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl'
      }
    });
  }


  
};
