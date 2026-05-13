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

## ✅ Đã hoàn thành (10/05/2026)

- [x] Triển khai Silent Refresh Token xử lý lỗi `401`
- [x] Thiết kế giao diện cập nhật hồ sơ công trình
- [x] Chuẩn hóa cấu trúc dữ liệu giai đoạn cố định:
  - DT
  - TK
  - PD
  - TC
  - QT

---

## 🛠️ Công việc tiếp theo

- [ ] Cấu hình sub-form nhận index cố định:
  - `giai_doan.0`
  - `giai_doan.1`
  - ...
- [ ] Hoàn thiện logic update dữ liệu lên Backend
- [ ] Tối ưu phân quyền API
- [ ] Bổ sung upload file hồ sơ công trình
- [ ] Triển khai Docker & CI/CD

---

# 🔒 Bảo mật hệ thống

Hệ thống áp dụng mô hình bảo mật nhiều lớp:

- JWT Authentication
- Refresh Token Rotation
- Route Guards
- Role-based Authorization
- DTO Validation
- Password Hashing
- Secure API Access

---

# 🌟 Định hướng phát triển

- 📱 Responsive UI
- ☁️ Deploy Azure / VPS
- 🐳 Docker hóa hệ thống
- 📊 Dashboard thống kê
- 📂 Upload & quản lý tài liệu công trình
- 🔔 Notification realtime

--- 

# 📅 Tiến độ & Kế hoạch (Progress & Roadmap)
## ✅ Đã hoàn thành (Completed - 12/05/2026)
### 🇻🇳 Tự động hóa Logic Form: 
Triển khai tính toán tự động Ngày hoàn thành (theo PGV) và Số ngày thi công thực tế bằng useEffect và watch.

### 🇺🇸 Form Logic Automation: 
Implemented automatic calculation for Completion Date (PGV) and Actual Construction Days using useEffect and watch hooks.

### 🇻🇳 Chuẩn hóa dữ liệu (Sanitization): 
Fix triệt để lỗi 400 Bad Request bằng cách ép kiểu Number và xử lý ngày tháng về dạng ISO 8601 (hoặc null khi trống).

#### 🇺🇸 Data Sanitization: 
Resolved 400 Bad Request errors by enforcing Number types and formatting dates to ISO 8601 (or null for empty fields).

### 🇻🇳 Đồng bộ giao diện: 
Sử dụng useState để quản lý danh sách giai đoạn, giúp UI cập nhật ngay lập tức sau khi cập nhật thành công mà không cần tải lại trang.

### 🇺🇸 UI Synchronization: 
Leveraged useState to manage project phases, ensuring the UI reflects updates instantly without page reloads.

### 🇻🇳 Khắc phục lỗi TypeScript: 
Xử lý lỗi Type Assignment trong hàm setValue bằng cách ép kiểu dữ liệu chặt chẽ.

### 🇺🇸 TypeScript Fixes: 
Resolved Type Assignment errors within setValue functions through strict type casting.

## 🛠 Công việc tiếp theo (Next Steps)
### 🇻🇳 Quản lý vật tư: 
Xây dựng module quản lý vật tư và định mức cho từng hạng mục sửa chữa.

#### 🇺🇸 Material Management: 
Build modules for tracking materials and standards for each repair category.

### 🇻🇳 Báo cáo & Thống kê: 
Tối ưu hóa giao diện Dashboard và xuất báo cáo PDF cho Ban Giám đốc.

### 🇺🇸 Reports & Analytics: 
Optimize Dashboard UI and implement PDF report generation for the Board of Directors.

---

# 📝 Nhật ký cập nhật tiến độ | Progress Update Log
## Ngày cập nhật | Update Date: 13/05/2026

### 1. Tối ưu hóa UI/UX cho MultiFileControl | UI/UX Optimization for MultiFileControl
#### Tiếng Việt:

Chuyển đổi giao diện danh sách file từ dạng input rời rạc sang dạng thẻ (Card-based list) hiện đại, giúp tiết kiệm diện tích.

Thêm trạng thái trực quan: Sử dụng màu nền emerald-50 và biểu tượng tệp tin cho các tệp đã có liên kết URL (tải lên thành công).

Bổ sung nút "Xem tài liệu" (Eye icon) cho phép mở link trực tiếp và nút "Xóa" tinh gọn.

#### English:

Transformed the file list interface from scattered inputs into a modern card-based list, optimizing screen real estate.

Added visual states: Used emerald-50 background and file icons for items with valid URLs (successfully uploaded).

Integrated a "View Document" button (Eye icon) for direct link access and a streamlined "Delete" button.

### 2. Hệ thống điều hướng giai đoạn hồ sơ | Project Stages Navigation System
#### Tiếng Việt:

Sidebar độc lập: Tách menu điều hướng thành component riêng (ProjectSidebar) để dễ dàng bảo trì.

Hiệu ứng Active: Tự động đánh dấu mục đang chọn bằng vạch chỉ báo (indicator) màu xanh và hiệu ứng dịch chuyển nhẹ (transition).

Cuộn thông minh (Smart Scroll):

Tự động cuộn mượt (Smooth scroll) đến đúng giai đoạn khi click.

Khắc phục lỗi bị che tiêu đề bằng cách áp dụng scroll-mt-48 (Scroll Margin Top), đảm bảo nội dung không bị Header đè lên.

Mặc định kích hoạt mục "I. Thông tin chung" khi khởi tạo trang.

#### English:

Independent Sidebar: Decoupled the navigation menu into a standalone component (ProjectSidebar) for better maintainability.

Active Effects: Automatically highlights the selected stage with a blue indicator and a subtle text transition.

Smart Scroll:

Implements smooth scrolling to the target stage upon clicking.

Resolved header overlap issues by applying scroll-mt-48 (Scroll Margin Top), ensuring content visibility below the fixed header.

Set "I. General Information" as the default active stage on page load.

### 🛠 Công nghệ áp dụng | Tech Stack Applied
React-hook-form: Quản lý dữ liệu mảng động (Field Array). | Managed dynamic array fields.

Tailwind CSS: Xử lý layout, hiệu ứng cuộn và trạng thái Active. | Handled layout, scroll behaviors, and active states.

React Icons (Fi): Cải thiện trải nghiệm thị giác qua hệ thống icon đồng bộ. | Enhanced visual experience with a unified icon set.

### 🚀 Kế hoạch tiếp theo | Next Steps
[ ] Scroll Spy: Tự động cập nhật menu sidebar khi người dùng cuộn chuột thủ công qua các phần. | Automatically update the sidebar menu as the user manually scrolls through sections.

[ ] Form Validation: Kiểm tra tính hợp lệ của đường dẫn URL trước khi lưu. | Validate URL format before data submission.