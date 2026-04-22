⛴️ AG Ferry Management System (Backend)
A specialized system for managing personnel information and ferry maintenance workflows at An Giang Ferry Joint Stock Company. Built on NestJS with a robust multi-layer security architecture.

🚀 Key Features
Authentication: Secure Registration, Login, and Identity Verification via JWT (JSON Web Token).

RBAC (Role-Based Access Control): Strict permission management between ADMIN, USER, and GUEST roles.

Security Guards: Multi-layer API protection using custom JwtAuthGuard and RolesGuard.

Data Validation: Input control using DTOs (Data Transfer Objects) and ValidationPipe.

Database: Scalable and flexible data management with MongoDB & Mongoose ODM.

🛠️ Tech Stack
Core: NestJS (Node.js framework)

Database: MongoDB & Mongoose

Security: Passport.js, JWT, Bcrypt

Validation: Class-validator, Class-transformer

Workflow: Git/GitHub, Postman, MongoDB Compass

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/phamminhtuanlx87-ai/nest-nestjs-agferry.git
cd nest-nestjs-agferry

2. Install dependencies
npm install

3. Environment Configuration
Create a .env file in the root directory and add the following variables:

Đoạn mã
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_123
JWT_EXPIRE=1d
PORT=3000

4. Run the application
Bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

🛡️ Role-Based Access Control (RBAC)
The system supports 3 default roles:

ADMIN: Full system administration and HR management.

USER: Official employees authorized to perform maintenance tasks.

GUEST: Newly registered users awaiting Admin activation and department assignment.

📝 License
Developed by Pham Minh Tuan. Please contact the author for commercial usage inquiries.