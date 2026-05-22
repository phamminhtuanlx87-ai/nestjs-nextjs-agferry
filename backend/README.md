# ⚙️ Tổng quan hệ thống Backend | Backend System Overview

---

## 🇻🇳 Tiếng Việt

### 🎯 Vai trò & Kiến trúc
`Backend` chịu trách nhiệm vận hành máy chủ dịch vụ (**RESTful API Server**), đóng vai trò bộ não xử lý toàn bộ logic nghiệp vụ (Business Logic), quản trị vòng đời dữ liệu và bảo mật hệ thống. 

### 🧩 Các thành phần cốt lõi (Core Modules)
* **Quản lý Vòng đời Công trình (State Engine):** Quản lý trạng thái lưu trữ, chỉnh sửa, và truy xuất thông tin chi tiết của từng dự án công trình.
* **Bộ kiểm soát cổng tiến độ (Stage Gating Control):** Chịu trách nhiệm lưu trữ và xác thực mảng danh sách `giai_doan` theo hệ thống bảng mã chuẩn . Đây là trục xương sống giúp xác định một công trình đã đủ điều kiện tiến tới bước tiếp theo hay chưa.
* **Cung cấp tài nguyên (Data Aggregation & Delivery):** Tối ưu hóa cấu trúc dữ liệu trả về (JSON payloads) giúp lớp giao diện (Frontend) dễ dàng bóc tách chỉ số và ánh xạ luồng trạng thái một cách nhẹ nhàng, tiết kiệm băng thông.

---

## 🇬🇧 English

### 🎯 Role & Architecture
The `Backend` directory houses the core service application (**RESTful API Server**), serving as the central engine managing business logic validation, state lifecycles, and secure data persistence.

### 🧩 Core Modules
* **Project Lifecycle Management (`CongTrinh` State Engine):** Handles full CRUD operations, revision histories, and detailed querying for individual construction projects.
* **Automated Stage Gating Control:** Manages and validates the sequential integrity of the  collection against a master code registry . This forms the system's backbone, dictating workflow progression and milestone approval triggers.
* **Optimized Data Aggregation & Delivery:** Yields streamlined, strongly-typed JSON payloads designed to minimize network overhead and empower the Frontend to map reactive workflow indicators painlessly.

# 📝 Nhật ký cập nhật tiến độ Backend | Backend Progress Update Log

---

## 📅 Ngày cập nhật | Update Date: 22/05/2026

### 1. Chuẩn hóa cấu trúc dữ liệu phục vụ đồng bộ tiến độ | Data Structure Standardization for Progress Syncing

#### 🇻🇳 Tiếng Việt:
* **Cung cấp mảng dữ liệu động:** Đảm bảo API trả về chính xác mảng dữ liệu `giai_doan` trong đối tượng Công trình (`ICongTrinh`), làm cơ sở dữ liệu tin cậy để Frontend tính toán trạng thái động.
* **Đồng bộ hóa mã định danh:** Đồng nhất các mã hiệu giai đoạn giữa Database và hệ thống ánh xạ `MA_HIEU_MAPPING`, đảm bảo logic kiểm tra điều kiện hoàn thành chốt chặn (Quyết toán) hoạt động chuẩn xác.

#### 🇬🇧 English:
* **Provide Dynamic Data Array:** Ensured the API precisely returns the `giai_doan` data array within the Project object (`ICongTrinh`), serving as a reliable data source for the Frontend to compute real-time statuses.
* **Synchronize Identifiers:** Unified stage codes between the database and the `MA_HIEU_MAPPING` system, ensuring the validation logic for the final completion milestone (Settlement) triggers flawlessly.