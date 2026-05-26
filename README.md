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
# 📅 Tiến độ & Roadmap
# 📅 Tiến độ & Kế hoạch (Progress & Roadmap)
# ✅ Đã hoàn thành (22/05/2026)
## 🇻🇳 Tiếng Việt
### 🛠️ Các thay đổi và chỉnh sửa hôm nay:
Cấu trúc lại danh mục Đơn vị & Chức vụ:

Thiết lập danh sách phòng ban mới bao gồm: Phòng Kỹ thuật - Vật tư, Phòng Đầu tư, Xí nghiệp Cơ khí Giao thông, Ban Tổng Giám đốc, Phòng Tài vụ.

Ràng buộc chức vụ động (Cascading Dropdown) theo từng đơn vị cụ thể (Ví dụ: Ban Tổng Giám đốc chỉ hiển thị Chủ tịch, Tổng GD, Phó Tổng GD; các phòng ban khác hiển thị Trưởng/Phó phòng, Nhân viên).

Sửa lỗi cảnh báo React Hook (ESLint):

Khắc phục hoàn toàn cảnh báo react-hooks/exhaustive-deps tại hàm useEffect tự động đồng bộ chức vụ bằng cách bổ sung đầy đủ mảng dependencies (watch, setValue).

Tối ưu hóa giao diện cột trái (Hồ sơ cá nhân):

Sửa lỗi chữ nhỏ và hiển thị nhầm trạng thái tải dữ liệu (...Đang lấy dữ liệu) khi đã tải xong.

Tăng độ tương phản, sử dụng mã màu chữ đậm rõ ràng, giúp thông tin dễ đọc hơn.

Xử lý triệt để lỗi tràn chữ và vỡ bố cục (Responsive & Layout Overflow):

Thêm các thuộc tính chống tràn chữ (truncate, break-words, break-all) cho phần hiển thị Họ tên và Email ở cột bên trái.

Đảm bảo giao diện không bao giờ bị đè chữ hoặc chọc thủng layout kể cả khi người dùng cố tình nhập chuỗi ký tự siêu dài không có khoảng trắng.

## 🇬🇧 English
### 🛠️ Today's Changes & Fixes:
Restructured Departments & Positions:

Set up the new organizational list: Technical & Materials Department, Investment Department, Traffic Mechanical Enterprise, Board of General Directors, Finance Department.

Implemented dynamic position filtering (Cascading Dropdown) per unit (e.g., Board of Directors only shows Chairman, General Director, Deputy GD; other departments show Head/Deputy Head, Staff).

Fixed React Hook Warning (ESLint):

Resolved the react-hooks/exhaustive-deps warning within the auto-sync position useEffect by providing the complete dependencies array (watch, setValue).

Optimized Left Sidebar Profile UI:

Fixed micro-text size and wrong loading-text fallback issues (...Loading data) after API fetched successfully.

Increased text contrast and applied clearer, bolder slate colors for enhanced readability.

Resolved Layout Overflow & Text Wrapping Issues:

Applied CSS truncation and breaking properties (truncate, break-words, break-all) to the Full Name and Email fields in the left sidebar.

Ensured the layout remains perfectly intact and never breaks, even when processing extremely long, continuous strings with no spaces.
----
