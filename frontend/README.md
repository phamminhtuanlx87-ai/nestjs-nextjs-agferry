# 💻 Tổng quan hệ thống Frontend | Frontend System Overview

---

## 🇻🇳 Tiếng Việt

### 🎯 Vai trò & Kiến trúc
Thư mục `Frontend` chứa toàn bộ mã nguồn giao diện người dùng (Client-side) của hệ thống Quản lý công trình, được xây dựng dựa trên cấu trúc **Next.js App Router** hiện đại. Hệ thống tập trung vào trải nghiệm Dashboard Admin mượt mà, phản hồi thời gian thực và trực quan hóa quy trình phức tạp thành các bước đi dễ hiểu.

### 🧩 Các thành phần cốt lõi (Core Modules)
* **Quản lý biểu mẫu quy trình (Dynamic Form Steps):** Phân rã hồ sơ công trình thành 7 giai đoạn độc lập (từ thông tin pháp lý ban đầu đến bước quyết toán cuối cùng).
* **Điều hướng thông minh (Smart Navigation):** Kết hợp đồng bộ giữa Sidebar mục lục dữ liệu và nội dung hiển thị thông qua bộ quét tự động `IntersectionObserver`.
* **Trực quan hóa luồng công việc (Workflows Timeline):** Tự động khóa/mở khóa các thao tác nghiệp vụ, hiển thị trạng thái xử lý bằng các vi hiệu ứng (micro-interactions) trực quan dựa trên dữ liệu đồng bộ từ máy chủ.

---

## 🇬🇧 English

### 🎯 Frontend & Architecture
The `Frontend` directory encompasses the entire client-side codebase for the Project Management system, engineered leveraging the modern **Next.js App Router** paradigm. The UI is designed to provide a seamless Admin Dashboard experience, high-fidelity real-time feedback, and simplified visualization of multi-stage industrial workflows.

### 🧩 Core Modules
* **Dynamic Multi-Stage Forms:** Breaks down dense construction profiles into 7 modular sub-forms (spanning from preliminary legal records down to final financial settlements).
* **Smart Navigation Engine:** Synchronizes layout viewports with sidebar menus dynamically utilizing the native browser `IntersectionObserver` API.
* **Reactive Workflows Timeline:** Automatically gates feature permissions, rendering clear workflow state indicators using subtle CSS micro-interactions computed dynamically from server states.


# 📝 Nhật ký cập nhật tiến độ Frontend | Frontend Progress Update Log

---

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