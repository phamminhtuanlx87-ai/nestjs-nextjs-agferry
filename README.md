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

---

## 📅 Tiến độ & Kế hoạch (Progress & Roadmap)

### ✅ Đã hoàn thành (Completed - 10/05/2026)
- [x] Triển khai **Silent Refresh Token** xử lý lỗi 401.
- [x] Thiết kế giao diện **Cập nhật hồ sơ công trình**.
- [x] Thống nhất cấu trúc dữ liệu mảng giai đoạn cố định (DT, TK, PD, TC, QT) để tối ưu Frontend.

### 🛠 Công việc ngày mai (Next Steps)
- [ ] Cấu hình lại các sub-form để nhận index cố định (giai_doan.0, giai_doan.1...).
- [ ] Hoàn thiện logic gửi dữ liệu cập nhật (Update) về Backend theo cấu trúc mảng mới.

---

## ⚙️ Cài đặt & Cấu hình (Installation & Setup)

1. **Clone dự án:**
   ```bash
   git clone [https://github.com/phamminhtuanlx87-ai/nestjs-nextjs-agferry.git](https://github.com/phamminhtuanlx87-ai/nestjs-nextjs-agferry.git)

2. **Tạo file .env tại thư mục gốc của backend:**

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=1d
PORT=3000

3. **Chạy ứng dụng (Development Mode):**

# Cài đặt thư viện
npm install

# Chạy chế độ phát triển
npm run start:dev


Đây là toàn bộ nội dung file README.md hoàn chỉnh, kết hợp nội dung Tuấn đã soạn và bản dịch tiếng Anh chuyên nghiệp. Tuấn chỉ cần copy một lần duy nhất đoạn dưới đây vào file là xong nhé:

Markdown
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

---

## 📅 Tiến độ & Kế hoạch (Progress & Roadmap)

### ✅ Đã hoàn thành (Completed - 10/05/2026)
- [x] Triển khai **Silent Refresh Token** xử lý lỗi 401.
- [x] Thiết kế giao diện **Cập nhật hồ sơ công trình**.
- [x] Thống nhất cấu trúc dữ liệu mảng giai đoạn cố định (DT, TK, PD, TC, QT) để tối ưu Frontend.

### 🛠 Công việc ngày mai (Next Steps)
- [ ] Cấu hình lại các sub-form để nhận index cố định (giai_doan.0, giai_doan.1...).
- [ ] Hoàn thiện logic gửi dữ liệu cập nhật (Update) về Backend theo cấu trúc mảng mới.

---

## ⚙️ Cài đặt & Cấu hình (Installation & Setup)

1. **Clone dự án:**
   ```bash
   git clone [https://github.com/phamminhtuanlx87-ai/nestjs-nextjs-agferry.git](https://github.com/phamminhtuanlx87-ai/nestjs-nextjs-agferry.git)
Biến môi trường (.env):
Tạo file .env tại thư mục gốc của backend:

Đoạn mã
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=1d
PORT=3000
Chạy ứng dụng (Development Mode):

Bash
# Cài đặt thư viện
npm install

# Chạy chế độ phát triển
npm run start:dev


📝 Giấy phép (License)
Dự án này được phát triển bởi Phạm Minh Tuấn. Vui lòng liên hệ tác giả nếu muốn sử dụng cho mục đích thương mại.
Copyright © 2026 Pham Minh Tuan. All rights reserved.


🇺🇸 English Version:
License & Copyright This project is developed by Pham Minh Tuan. Please contact the author for any commercial use or inquiries.

Copyright © 2026 Pham Minh Tuan. All rights reserved.