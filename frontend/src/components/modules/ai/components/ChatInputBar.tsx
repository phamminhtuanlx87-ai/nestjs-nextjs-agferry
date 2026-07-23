"use client";
import Button from "@/components/ui/Button";
import React, { useState } from "react";
import { BiSend } from "react-icons/bi";

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
}

const ChatInputBar = ({ onSendMessage }: ChatInputBarProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };
  return (
    <div className="pb-8 pt-2 bg-white shrink-0 space-y-2.5 border-t border-slate-100">
      {/* Gợi ý nhanh dạng Pill/Badge */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => onSendMessage("Tóm tắt tiến độ công trình")}
          className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
        >
          💡 Tóm tắt tiến độ công trình
        </button>
        <button
          onClick={() => onSendMessage("Xem báo cáo doanh thu")}
          className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
        >
          📊 Xem báo cáo doanh thu
        </button>
      </div>

      {/* Khung Form Nhập Tin Nhắn */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm"
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
          placeholder="Nhập câu hỏi tiếp theo..."
          className="w-full bg-transparent resize-none border-0 focus:ring-0 focus:outline-none text-sm text-slate-800 placeholder-slate-400 max-h-32 py-1 px-2"
        />
        <Button
          type="submit"
          variant="primary"
          className="btn-soft transition-colors shrink-0 rounded-lg"
        >
          <BiSend className="w-4 h-4" />
        </Button>
      </form>

      <div className="text-[11px] text-center text-slate-400">
        Trợ lý AI có thể mắc sai sót. Vui lòng kiểm tra lại thông tin quan
        trọng.
      </div>
    </div>
  );
};

export default ChatInputBar;
