// Định nghĩa các Role chính trong hệ thống
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  GUEST = 'GUEST',
}

// Định nghĩa chi tiết từng quyền (Permission)
export enum UserPermission {
  // Quyền với Dự án (Projects)
  PROJECT_CREATE = 'PROJECT_CREATE',
  PROJECT_UPDATE = 'PROJECT_UPDATE',
  PROJECT_DELETE = 'PROJECT_DELETE',
  PROJECT_VIEW = 'PROJECT_VIEW',

  // Quyền với Người dùng (Users)
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_VIEW = 'USER_VIEW',
}
// Định nghĩa quyền mặc định theo Role
export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [UserRole.ADMIN]: Object.values(UserPermission), // Admin có tất cả các quyền

  [UserRole.MANAGER]: [
    UserPermission.PROJECT_CREATE,
    UserPermission.PROJECT_UPDATE,
    UserPermission.PROJECT_VIEW,
    UserPermission.PROJECT_DELETE,
    UserPermission.USER_VIEW,
    UserPermission.USER_UPDATE,
  ],

  [UserRole.USER]: [
    UserPermission.PROJECT_CREATE,
    UserPermission.PROJECT_UPDATE,
    UserPermission.PROJECT_VIEW,
    UserPermission.USER_VIEW,
    UserPermission.USER_CREATE,
    UserPermission.USER_UPDATE,
  ],

  [UserRole.GUEST]: [UserPermission.PROJECT_VIEW, UserPermission.USER_VIEW],
};

// Định nghĩa chi tiết từng phòng ban (Department)
export enum UserDepartment {
  PKT = 'Phòng Kỹ thuật - Vật tư',
  PDU = 'Phòng Đầu tư',
  XNCK = 'Xí nghiệp Cơ khí Giao thông',
  BGD = 'Ban Giám đốc',
  AD = 'Admin',
  CXD = 'Chưa xác định',
}

export enum UserPositions {
  CT = 'Chủ tịch',
  TGD = 'Tổng Giám đốc',
  PTGD = 'Phó Tổng Giám đốc',
  TP = 'Trưởng phòng',
  PTP = 'Phó Trưởng phòng',
  NV = 'Nhân viên',
  AD = 'Admin',
  CXD = 'Chưa xác định',
}
