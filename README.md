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
# Đọc bản Tiếng Việt 🇻🇳
## 📝 Nhật ký cập nhật - Ngày 28/05/2026
Hôm nay, dự án đã được tập trung tối ưu hóa hiệu năng React Hooks, chuẩn hóa kiểu dữ liệu TypeScript và dọn dẹp các cảnh báo từ ESLint để đảm bảo mã nguồn sạch sẽ, mượt mà.

## 🛠️ Các hạng mục đã thực hiện:
Tối ưu hóa useMeForm Hook (/me page):

Sửa lỗi vòng lặp re-render vô hạn (Infinite Loop) ở logic tự động cập nhật Chức vụ (Position) theo Đơn vị (Department).

Thay thế biến theo dõi trạng thái watchedPositions bằng hàm getValues("positions") của thư viện react-hook-form nhằm ngắt kết nối subscribe state không cần thiết, giúp component chạy mượt mà đúng 1 chu kỳ.

Sử dụng useRef (isInitialLoaded) để chặn việc ghi đè dữ liệu gốc của User ngay khi vừa tải dữ liệu từ API thành công.

Giải quyết triệt để cảnh báo nghiêm ngặt của ESLint đối với quy tắc react-hooks/exhaustive-deps.

Chuẩn hóa Trang Quản lý Nhân viên (app/(dashboard)/nhan-vien/page.tsx):

Sửa lỗi gạch chân đỏ TypeScript (Type 'IUsers' is not assignable to type 'SetStateAction<IUsers[]>'). Chuyển đổi linh hoạt dữ liệu trả về từ API thành dạng mảng an toàn trước khi gán vào State.

Khởi tạo State với một mảng rỗng ([]) thay vì bỏ trống, giải quyết hoàn toàn lỗi undefined truyền vào component bảng.

Khắc phục lỗi ép kiểu bắt buộc thuộc tính hệ thống key tại thẻ <UserTable />.

Gộp các hàm fetch data lồng nhau thừa thãi thành một useEffect duy nhất chạy khi mount trang. Dọn dẹp hoàn toàn các biến không sử dụng (useCallback, loading).

# Read in English 🇺🇸
## 📝 Update Log - May 28, 2026
Today's focus was on optimizing React Hooks performance, strict TypeScript type checking, and resolving critical ESLint warnings to guarantee a clean and efficient codebase.

## 🛠️ Key Accomplishments:
Optimized useMeForm Hook (/me page):

Fixed the infinite re-rendering loop caused by the automatic Position update logic when the Department changes.

Replaced the dynamic state subscription watchedPositions with getValues("positions") from react-hook-form to read data instantly without subscribing, cutting down redundant re-renders.

Implemented useRef (isInitialLoaded) to prevent the form from overriding the user's fetched profile data during the initial hydration.

Completely resolved the strict react-hooks/exhaustive-deps ESLint rule.

Standardized Employee Management Page (app/(dashboard)/nhan-vien/page.tsx):

Resolved the TypeScript compiler error (Type 'IUsers' is not assignable to type 'SetStateAction<IUsers[]>') by safely structuring the incoming single/paginated API response into a validated array block.

Initialized the users state with an empty array ([]) to prevent downstream undefined type errors inside the table card.

Fixed the constraint conflict caused by the required system attribute key prop mismatch in the <UserTable /> component interface.

Cleaned up redundant nested fetch functions into a single mounted useEffect, wiping out all unused definitions (useCallback, loading).


---
# 📅 Tiến độ & Roadmap
# 🛠️ Nhật Ký Debug & Hoàn Thiện Tính Năng Đổi Mật Khẩu (27/05/2026)

Tài liệu này ghi lại toàn bộ quá trình xử lý logic, đồng bộ giữa Frontend và Backend, cũng như các lỗi "xương máu" đã được giải quyết trong ngày hôm nay cho tính năng **Cập nhật bảo mật (Đổi mật khẩu)**.

---

## 🎯 Tính Năng Đã Hoàn Thành
* [x] Xây dựng hàm `updateMeReset` trọn gói tại tầng `UsersService` (Backend) để tự động tìm kiếm, xác thực mật khẩu cũ và băm mật khẩu mới.
* [x] Đồng bộ hóa cấu trúc DTO ở Backend và Interface ở Frontend sang kiểu `camelCase` chuẩn (`currentPassword`, `newPassword`, `confirmPassword`).
* [x] Kết nối thành công luồng gọi API `PATCH /api/auth/me/reset` từ giao diện Web xuống Database.

---

## 🚨 Các Lỗi "Kinh Điển" Đã Fix (Kinh Nghiệm Thực Chiến)

### 1. Lỗi Cú Pháp Database (Mongoose vs SQL)
* **Triệu chứng:** Code chạy đến bước tìm User thì đứng im, không log ra các bước tiếp theo.
* **Nguyên nhân:** Viết nhầm cú pháp `{ where: { id: userId } }` của TypeORM/Sequelize vào dự án đang chạy **Mongoose (MongoDB)**.
* **Giải quyết:** Sửa lại thành cú pháp chuẩn của Mongoose để tìm đúng bản ghi:
  ```typescript
  const user = await this.userModel.findById(userId).select('+passwordHash');