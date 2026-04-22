⛴️ AG Ferry Management System (Backend)
Hệ thống quản lý thông tin nhân sự và quy trình sửa chữa tàu phà tại Công ty Cổ phần Phà An Giang. Dự án được xây dựng trên nền tảng NestJS với kiến trúc bảo mật đa lớp.

🚀 Tính năng nổi bật
Authentication: Đăng ký, đăng nhập và xác thực qua JWT (JSON Web Token).

RBAC (Role-Based Access Control): Phân quyền chặt chẽ giữa các vai trò ADMIN, USER, và GUEST.

Security Guards: Hệ thống bảo vệ API đa lớp (JwtAuthGuard, RolesGuard).

Data Validation: Kiểm soát dữ liệu đầu vào bằng DTO (Data Transfer Object) và ValidationPipe.

Database: Quản lý dữ liệu linh hoạt với MongoDB & Mongoose.

🛠️ Công nghệ sử dụng
Core: NestJS (Node.js framework)

Database: MongoDB & Mongoose ODM

Security: Passport.js, JWT, Bcrypt

Validation: Class-validator, Class-transformer

Tools: Postman, MongoDB Compass, Git/GitHub

📁 Cấu trúc thư mục chính
Plaintext
src/
├── common/              # Các decorator, filter, interceptor dùng chung
├── config/              # Cấu hình hệ thống (Database, JWT)
├── modules/
│   ├── auth/            # Xử lý đăng nhập, guards và chiến lược xác thực
│   └── users/           # Quản lý người dùng, phân quyền và phòng ban
├── app.module.ts        # Module gốc của ứng dụng
└── main.ts              # Điểm bắt đầu của ứng dụng
⚙️ Hướng dẫn cài đặt
1. Clone dự án
Bash
git clone https://github.com/phamminhtuanlx87-ai/nest-nestjs-agferry.git
cd nest-nestjs-agferry
2. Cài đặt thư viện
Bash
npm install
3. Cấu hình môi trường (Environment Variables)
Tạo file .env tại thư mục gốc và cấu hình các biến sau:

Đoạn mã
MONGODB_URI=mongodb://localhost:27017/agferry_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=1d
4. Chạy ứng dụng
Bash
# Chế độ phát triển
npm run start:dev

# Chế độ Production
npm run build
npm run start:prod
🛡️ Phân quyền (Roles)
Hệ thống hỗ trợ 3 vai trò mặc định:

ADMIN: Toàn quyền quản trị hệ thống, quản lý nhân sự.

USER: Nhân viên chính thức, thực hiện các nghiệp vụ sửa chữa.

GUEST: Người dùng mới đăng ký, cần Admin kích hoạt và phân phòng ban.

📝 Giấy phép (License)
Dự án này được phát triển bởi Phạm Minh Tuấn. Vui lòng liên hệ tác giả nếu muốn sử dụng cho mục đích thương mại.

Dự án đang trong giai đoạn phát triển module Quản lý sửa chữa tàu phà.