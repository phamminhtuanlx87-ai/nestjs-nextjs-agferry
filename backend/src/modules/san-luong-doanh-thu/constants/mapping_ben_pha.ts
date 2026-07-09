// 1. Định nghĩa bảng Mapping Mã bến -> Tên bến đầy đủ (Không dùng any)
export const MAP_TEN_BEN: Record<string, string> = {
  AH: 'Bến phà An Hòa',
  OM: 'Bến phà Ô Môi',
  TO: 'Bến phà Trà Ôn',
  VC: 'Bến phà Vàm Cống',
  MR: `Bến phà Mương Ranh`,
  NG: 'Bến phà Năng Gù', // Ví dụ các bến khác nếu có
  TG: 'Bến phà Thuận Giang',
  TC: 'Bến phà Tân Châu6u',
} as const;
