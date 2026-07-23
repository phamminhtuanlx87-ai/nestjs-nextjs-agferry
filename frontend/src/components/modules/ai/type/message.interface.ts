// ==========================================
// 1. CẤU TRÚC DỮ LIỆU CHÍNH (DATA MODELS)
// ==========================================
export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

