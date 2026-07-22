// 1. Định nghĩa kiểu dữ liệu các Model được phép dùng
export type AiModelType =
  | 'gemini-3.1-flash-lite'
  | 'gemini-3.5-flash'
  | 'gemini-2.5-flash';

// 2. Biến chứa model mặc định (nếu cần)
export const DEFAULT_AI_MODEL: AiModelType = 'gemini-3.1-flash-lite';
