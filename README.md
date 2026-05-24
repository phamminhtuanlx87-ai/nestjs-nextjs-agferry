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
## 📅 Ngày cập nhật | Update Date: 22/05/2026

### 1. Đồng bộ danh mục và tối ưu bộ cuộn trang | Sidebar Scrollspy & Navigation Optimization

#### 🇻🇳 Tiếng Việt:
* **Đồng bộ thanh danh mục tự động (Scrollspy):** Tích hợp `IntersectionObserver` giúp Sidebar tự động sáng đèn theo đúng phân đoạn hồ sơ đang hiển thị khi người dùng cuộn chuột.
* **Sửa lỗi chính tả tọa độ:** Khắc phục lỗi viết thường thuộc tính `scrollY` thành `scrolly` khiến hàm điều hướng click bị khựng ngầm.
* **Tối ưu hóa không gian cuộn đáy trang:** Chèn thêm khoảng trống vô hình `pb-[60vh]` hợp lý phía dưới khối "Quyết toán", giúp mục cuối cùng dễ dàng lọt vào vùng nhận diện để sáng đèn Sidebar khi chạm đáy trang mà không làm hỏng layout cấu trúc.

#### 🇬🇧 English:
* **Automated Sidebar Scrollspy:** Integrated `IntersectionObserver` to dynamically highlight the corresponding active form section in the Sidebar as the user scrolls.
* **Fixed Navigation Syntax Error:** Resolved a typo where `scrollY` was miscoded as lowercase `scrolly`, which silently broke the click-to-scroll functionality.
* **Optimized Bottom Scrolling Space:** Applied an invisible `pb-[60vh]` padding beneath the final "Settlement" section. This allows the last item to successfully enter the viewport triggers and light up the Sidebar cleanly without disrupting layout semantics.

---

### 2. Số hóa tiến độ động và nâng cấp hiệu ứng trạng thái | Dynamic Progress Tracking & Status Micro-interactions

#### 🇻🇳 Tiếng Việt:
* **Ánh xạ tiến độ thực tế (Dynamic Mapping):** Sử dụng `useMemo` để tính toán số lượng mảng `giai_doan` từ API, tự động phân phối 3 trạng thái (`success`, `active`, `pending`) cho luồng Timeline thay vì cấu hình cứng.
* **Khắc phục lỗi thứ tự Hook:** Di chuyển `useMemo` lên phía trên câu lệnh điều kiện Early Return (`if (loading)`) để tuân thủ nghiêm ngặt quy tắc quản lý bộ nhớ của React Hooks.
* **Thiết kế hiệu ứng trạng thái hoàn thành:** Thay thế ký hiệu text `✓` thô kệch thành biểu tượng tích ngọc bọc trong khung tròn `bg-emerald-100`, kết hợp hiệu ứng sóng âm mờ tỏa ra xung quanh (`animate-ping`) tạo cảm giác chuyên nghiệp khi hồ sơ "về đích".

#### 🇬🇧 English:
* **Dynamic Progress Mapping:** Leveraged `useMemo` to evaluate the backend `giai_doan` array length reactively, automatically distributing progress statuses (`success`, `active`, `pending`) across the profile workflow.
* **Fixed Hook Ordering Issue:** Relocated the `useMemo` hook above the conditional early return statement (`if (loading)`) to strictly comply with the Rules of Hooks.
* **Enhanced Completion Micro-interactions:** Replaced the plain text `✓` with an elegant emerald badge inside a `bg-emerald-100` circular node, coupled with a subtle glowing radar pulse animation (`animate-ping`) to deliver high-end visual feedback for completed milestones. 

---

# 📝 Nhật ký cập nhật tiến độ | Progress Update Log

### 🇻🇳 Tiếng Việt
**Cập nhật tiến độ ngày 24/05/2026:**
* **Sửa lỗi cốt lõi (Backend):** * Khắc phục lỗi logic lọc ngày tháng (`filter.month`) bằng cách đồng bộ định dạng tháng Zero-indexed (0-11) trong JavaScript, giúp bóc tách chính xác dữ liệu công trình tạo vào Tháng 1.
* **Sửa lỗi Form (Frontend):**
    * Xử lý dứt điểm lỗi lệch pha dữ liệu ở Giai đoạn VII (Quyết toán) do trùng lặp ký hiệu viết tắt `value: "TP"` giữa các mảng dữ liệu (`OPTIONS_DU_TOAN` và `OPTIONS_THAM_TRA`).
* **Tái cấu trúc Giao diện (UI/UX):**
    * **Thẻ dự toán điều chỉnh:** Phân tách trực quan dòng tiền phát sinh Tăng (`+`) dạng Badge xanh và Phát sinh Giảm (`-`) dạng Badge đỏ.
    * **Khối thông tin dự án:** Gom nhóm dữ liệu theo 3 cột quy trình ngay ngắn, tách riêng dải Banner "Đơn vị chủ quản" lên trên cùng để tối ưu không gian, đưa mục "Địa điểm triển khai" xuống đáy tích hợp liên kết mở tab mới trực tiếp qua Google Maps.

---

### 🇺🇸 English
**Progress Update - May 24, 2026:**
* **Core Bug Fix (Backend):**
    * Resolved the date filtering logic issue (`filter.month`) by synchronizing JavaScript's zero-indexed month structure (0-11), ensuring perfect data retrieval for projects created in January.
* **Form Logic Fix (Frontend):**
    * Completely fixed the data mismatch on Stage VII (Final Settlement) caused by the duplicated shorthand identifier `value: "TP"` between data arrays (`OPTIONS_DU_TOAN` and `OPTIONS_THAM_TRA`).
* **UI/UX Modernization:**
    * **Adjusted Budget Card:** Visually separated financial variances into emerald badges for Cost Increases (`+`) and rose badges for Cost Decreases (`-`).
    * **Project Information Section:** Restructured data layouts into a clean 3-column operational grid, isolated the "Owner / Investor" banner at the top, and relocated the "Construction Location" to the bottom with an embedded direct link to Google Maps.

---
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

---

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
