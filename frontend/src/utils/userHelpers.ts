export const DEPARTMENTS = [
  { value: "PKT", label: "Phòng Kỹ thuật - Vật tư" },
  { value: "PDT", label: "Phòng Đầu tư" },
  { value: "XNCK", label: "Xí nghiệp Cơ khí Giao thông" },
  { value: "BTGD", label: "Ban Tổng Giám đốc" },
  { value: "PTV", label: "Phòng Tài vụ" },
];

export const POSITIONS = [
  { value: "CT", label: "Chủ tịch" },
  { value: "TGD", label: "Tổng Giám đốc" },
  { value: "PTGD", label: "Phó Tổng Giám đốc" },
  { value: "TP", label: "Trưởng phòng" },
  { value: "PTP", label: "Phó Trưởng phòng" },
  { value: "GD", label: "Giám đốc" },
  { value: "PGD", label: "Phó Giám đốc" },
  { value: "NV", label: "Nhân viên" },
];

export const MAP_DEPARTMENT_POSITIONS: Record<string, string[]> = {
  PDT: ["TP", "PTP", "NV"],
  PTV: ["TP", "PTP", "NV"],
  PKT: ["TP", "PTP", "NV"],
  XNCK: ["GD", "PGD", "NV"],
  BTGD: ["CT", "TGD", "PTGD"],
};

// Hàm lấy chữ cái đầu của tên
export const getInitials = (fullName: string): string => {
  if (!fullName) return "";
  const nameParts = fullName.trim().split(" ");
  return nameParts[nameParts.length - 1]?.charAt(0) || "";
};

// Hàm tìm kiếm nhanh tên nhãn hiển thị
export const getLabelByValue = (array: { value: string; label: string }[], value: string) => {
  return array.find((item) => item.value === value)?.label || "Chưa xác định";
};