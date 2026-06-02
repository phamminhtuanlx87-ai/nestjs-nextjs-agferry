# ⛴️ AG Ferry Management System (AGFerry)

> **Hệ thống quản lý quy trình sửa chữa và bảo trì công trình phà tại Công ty Cổ phần Phà An Giang.**

---

## 🇻🇳 Tiếng Việt

### 📝 Giới thiệu
Hệ thống quản lý thông tin nhân sự và quy trình sửa chữa tàu phà. Dự án được xây dựng trên nền tảng NestJS với kiến trúc bảo mật đa lớp, giúp số hóa quy trình từ khâu Dự toán đến Quyết toán.

### 🚀 Tính năng nổi bật
* **Authentication**: Đăng ký, đăng nhập và xác thực qua JWT.
* **Silent Refresh**: Cơ chế tự động làm mới token giúp duy trì phiên đăng nhập mượt mà (Fix lỗi 401).
* **RBAC (Role-Based Access Control)**: Phân quyền chặt chẽ giữa các vai trò ADMIN, USER, và GUEST.
* **Security Guards**: Hệ thống bảo vệ API đa lớp (JwtAuthGuard, RolesGuard).
* **Data Validation**: Kiểm soát dữ liệu đầu vào bằng DTO và ValidationPipe.
* **Database**: Quản lý dữ liệu linh hoạt với MongoDB & Mongoose.

### 🛠️ Công nghệ sử dụng
* **Core**: NestJS (Node.js framework)
* **Frontend**: React, Tailwind CSS, React Hook Form
* **Database**: MongoDB & Mongoose ODM
* **Security**: Passport.js, JWT, Bcrypt
* **Tools**: Postman, MongoDB Compass, Git/GitHub

### 📝 Bản quyền & Giấy phép
Dự án này được phát triển bởi **Phạm Minh Tuấn**. Vui lòng liên hệ tác giả nếu muốn sử dụng cho mục đích thương mại.
*Bản quyền © 2026 Phạm Minh Tuấn. Bảo lưu mọi quyền.*

---

## 🇺🇸 English Version

### 📝 Overview
A comprehensive management system for ship repair and maintenance processes at An Giang Ferry Joint Stock Company. Built on NestJS with a multi-layered security architecture.

### 🚀 Key Features
* **Authentication**: Secure registration and login via JWT.
* **Silent Refresh**: Automatic token renewal mechanism (Fixing 401 Unauthorized errors).
* **RBAC**: Strict authorization between ADMIN, USER, and GUEST roles.
* **Security Guards**: Multi-layer API protection using JwtAuthGuard and RolesGuard.
* **Data Validation**: Input control using DTOs and ValidationPipe.
* **Database**: Flexible data management with MongoDB & Mongoose.

### 🛠️ Tech Stack
* **Backend**: NestJS, MongoDB, Mongoose ODM.
* **Frontend**: React, Tailwind CSS, React Hook Form.
* **Security**: Passport.js, JWT, Bcrypt.

### 📝 License & Copyright
This project is developed by **Pham Minh Tuan**. Please contact the author for any commercial use or inquiries.
*Copyright © 2026 Pham Minh Tuan. All rights reserved.*

---
## ⚙️ Cài đặt & Cấu hình (Installation & Setup)

1. **Clone dự án:**
   ```bash
   git clone [https://github.com/phamminhtuanlx87-ai/nestjs-nextjs-agferry.git](https://github.com/phamminhtuanlx87-ai/nestjs-nextjs-agferry.git)

## ⚙️ Cài đặt & Hướng dẫn chạy (Installation & Setup)

### 2git add README.md. Biến môi trường (Environment Variables)
Để dự án hoạt động, bạn cần tạo file `.env` tại thư mục gốc của **backend** và điền các thông tin sau:

```env
# Kết nối Database
MONGODB_URI=your_mongodb_connection_string

# Cấu hình bảo mật JWT
JWT_SECRET=your_super_secret_key_123
JWT_EXPIRE=1d

# Cấu hình cổng chạy App
PORT=3000
```
---
# 🚀 Nhật Ký Cập Nhật Dự Án - Quản Lý Cấp Tài Khoản Nhân Viên

Tệp này ghi lại toàn bộ các tính năng đã được tối ưu, sửa lỗi (debug) và hoàn thiện trong ngày hôm nay liên quan đến luồng dữ liệu Admin, Form nhập liệu và hệ thống xuất báo cáo Excel.

---

## 🛠️ Các Công Việc Đã Hoàn Thành Hôm Nay

### 1. Sửa lỗi xuất Excel bị mất định dạng (Style & Border)
- **Vấn đề:** File Excel xuất ra bị trắng xóa, mất hết khung viền đen và font chữ tiêu đề dù file template gốc có đầy đủ.
- **Nguyên nhân:** Thư viện `xlsx` (SheetJS bản miễn phí) tự động phớt lờ và tước bỏ thuộc tính `.s` (Style) khi đọc/ghi file.
- **Giải pháp:** - Chuyển đổi toàn bộ logic sang thư viện **`xlsx-js-style`** (Bản cộng đồng hỗ trợ mở khóa Style).
  - Bật cấu hình `{ cellStyles: true }` ở cả hàm `XLSX.read` và `XLSX.write`.
  - Viết hàm bổ sung định dạng tự động (`border` mỏng, font chữ `Times New Roman`) ép vào từng dòng dữ liệu mới từ hàng số 4 trở đi.

### 2. Sửa lỗi ô Select không tự động chọn đúng dữ liệu khi sửa (Sync Form)
- **Vấn đề:** Khi bấm nút "Chỉnh sửa nhân viên", log dữ liệu ra đúng ID nhưng ô Chọn Phòng ban/Chức vụ trên giao diện vẫn hiện giá trị mặc định.
- **Nguyên nhân:** - API trả về dữ liệu dạng Object lồng nhau (`department: { id, name }`), nhưng form và component `<SelectField>` chỉ hiểu giá trị phẳng (Chuỗi ID `"PKH"`).
  - Thiếu thuộc tính `value` để ép component cập nhật theo trạng thái của form.
- **Giải pháp:** - Sửa hàm `handleUpdateClick`, trích xuất đúng chuỗi ID phẳng: `setValue("department", userData.department?.id)` trước khi đẩy vào form.
  - Bổ sung thuộc tính kiểm soát giao diện `value={watch("positions")}` và sự kiện `onChange` tương minh cho các Custom Select.

### 3. Tích hợp nút Tự động tạo Mật khẩu mới (Random Password Generator)
- **Tính năng:** Thêm nút "🔑 Đổi mã" giúp admin tự sinh mật khẩu ngẫu nhiên có độ bảo mật cao (10 ký tự gồm chữ hoa, chữ thường, số, ký tự đặc biệt) ngay lập tức.
- **Tối ưu giao diện (UI/UX):**
  - Đặt nút nằm gọn gàng ở phía bên phải, ngay bên trong thanh Input thông qua thuộc tính `absolute` để không làm vỡ bố cục Form.
  - Thêm hiệu ứng click thu nhỏ nút sinh động (`active:scale-95`), hiệu ứng hover (`hover:scale-105`), và hiệu ứng nhấp nháy icon chìa khóa (`animate-pulse`) để thu hút tương tác.

### 4. Dọn dẹp và tối ưu hóa file Service (`auth.service.ts`)
- Gom nhóm và tái sử dụng các Interface cốt lõi (`UserBaseData`, `Department`, `Positions`) bằng từ khóa `extends` giúp giảm 30% dung lượng code thừa.
- Xóa bỏ các Interface rác không dùng đến và chuẩn hóa lại các đoạn comment copy-paste sai ngữ cảnh.

---

## 📦 Hướng Dẫn Cài Đặt Các Gói Đã Dùng Hôm Nay

Nếu chạy dự án ở máy khác, bắt buộc phải cài đặt các gói hỗ trợ xử lý Style này:
```bash
npm install xlsx-js-style file-saver
npm install --save-dev @types/file-saver