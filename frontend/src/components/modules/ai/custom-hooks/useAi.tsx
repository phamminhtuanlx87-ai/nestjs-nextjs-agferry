"use client";
import { useState } from "react";
import { AiMessage } from "../type/message.interface";
import api from "@/lib/axios";

const useAi = () => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Thêm tin nhắn User & 1 bong bóng AI rỗng (để kích hoạt 3 chấm nhấp nháy)
    const userMsg: AiMessage = { role: "user", content: text };
    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "assistant", content: "" },
    ]);
    setLoading(true);

    // 2. Lấy Token từ LocalStorage
    let token = "";
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        const parsedAuth = JSON.parse(authStorage);
        token = parsedAuth?.state?.token || "";
      }
    } catch (e) {
      console.error("Lỗi lấy token:", e);
    }

    try {
      // 3. Gọi API với key "question" chuẩn theo Postman
      const response = await api.post(
        "/ai/chat",
        { question: text }, // 👈 Đã đổi key từ "message" thành "question"
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // 4. Lấy trường 'answer' từ Response
      const aiAnswer =
        response.data?.answer || "Không có câu trả lời từ hệ thống.";

      // 5. Cập nhật câu trả lời vào UI
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: aiAnswer,
        };
        return updated;
      });
    } catch (error) {
      console.error("Lỗi gọi API AI:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Rất tiếc, đã có lỗi xảy ra kết nối. Vui lòng thử lại sau!",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
};
export default useAi;
