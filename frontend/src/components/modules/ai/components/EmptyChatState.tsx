"use client";
import Button from "@/components/ui/Button";
import React, { useState } from "react";
import { BiSend } from "react-icons/bi";

interface EmptyChatStateProps {
  onSendMessage: (text: string) => void;
}

const EmptyChatState = ({ onSendMessage }: EmptyChatStateProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  const handleQuickQuestion = (question: string) => {
    onSendMessage(question);
  };
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full -mt-16">
      {/* 1. Tiêu đề chào mừng */}
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-sm">
          ✨
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          Xin chào! Tôi có thể giúp gì cho bạn?
        </h2>
        <p className="text-sm text-slate-500">
          Hỏi tôi về tiến độ công trình, dự toán phê duyệt hoặc doanh thu bến
          phà.
        </p>
      </div>

      <div className="w-full space-y-3">
        {/* 2. Gợi ý nằm TRÊN ô chat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2">
          <button
            onClick={() =>
              handleQuickQuestion("Công trình đang thi công năm 2026")
            }
            className="text-left text-xs bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 p-3 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <span>💡</span>
            <span>Công trình đang thi công năm 2026</span>
          </button>

          <button
            onClick={() =>
              handleQuickQuestion("Doanh thu phà Vàm Cống tháng này")
            }
            className="text-left text-xs bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 p-3 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <span>📊</span>
            <span>Doanh thu phà Vàm Cống tháng này</span>
          </button>
        </div>

        {/* 3. Khung Form Input Căn Giữa */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all shadow-md"
        >
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Nhập câu hỏi cho Trợ lý AI..."
            className="w-full bg-transparent resize-none border-0 focus:ring-0 focus:outline-none text-sm text-slate-800 placeholder-slate-400 max-h-32 py-1 px-2"
          />
          <Button
            type="submit"
            variant="primary"
            className="btn-soft transition-colors shrink-0 rounded-xl"
          >
            <BiSend className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EmptyChatState;
