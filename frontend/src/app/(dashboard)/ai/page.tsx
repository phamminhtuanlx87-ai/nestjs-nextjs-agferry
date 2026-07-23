"use client";
import { BiPlus } from "react-icons/bi";
import {
  PanelLeft, // Icon Sidebar
  PanelLeftClose, // Nếu lỗi đổi thành SidebarClose
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useState } from "react";
import useAi from "@/components/modules/ai/custom-hooks/useAi";
import EmptyChatState from "@/components/modules/ai/components/EmptyChatState";
import ChatMessageList from "@/components/modules/ai/components/ChatMessageList";
import ChatInputBar from "@/components/modules/ai/components/ChatInputBar";

// 1. Khai báo kiểu cho tin nhắn (ví dụ đơn giản)

export default function AiChatPage() {
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(true);
  const { messages, sendMessage } = useAi();
  // Hàm xử lý chung khi người dùng gửi bất kỳ tin nhắn nào

  return (
    <div className="flex h-[calc(100vh-60px)] w-full bg-slate-50 text-slate-800 overflow-hidden relative">
      {/* 1. SUB-SIDEBAR: LỊCH SỬ CHAT */}
      <aside
        className={`${
          isSubSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out bg-slate-50 border-r border-slate-200 flex flex-col relative overflow-hidden shrink-0 h-full`}
      >
        <div className="p-3 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <Button
            variant="primary"
            className="btn-soft w-full transition-colors flex items-center justify-center gap-2"
          >
            <BiPlus className="w-4 h-4" />
            <span>Chat mới</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
              Hôm nay
            </div>
            <div className="space-y-1">{/* Lịch sử chat items */}</div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200 text-xs text-slate-400 text-center shrink-0">
          Dữ liệu đồng bộ AG Ferry DB
        </div>
      </aside>

      {/* 2. KHUNG CHAT CHÍNH (MAIN CHAT AREA) */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-white relative overflow-hidden">
        {/* HEADER CHAT */}
        <header className="h-14 border-b border-slate-200 px-4 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubSidebarOpen(!isSubSidebarOpen)}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title={isSubSidebarOpen ? "Thu gọn lịch sử" : "Mở lịch sử"}
            >
              {isSubSidebarOpen ? (
                <PanelLeftClose className="w-6 h-6" />
              ) : (
                <PanelLeft className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <span>✨</span>
              </div>
              <div>
                <h1 className="font-semibold text-sm text-slate-800 leading-none">
                  Trợ lý AI Phà AG
                </h1>
                <span className="text-[11px] text-emerald-600 font-medium">
                  ● Sẵn sàng hỗ trợ
                </span>
              </div>
            </div>
          </div>

          <button className="text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-md hover:bg-slate-100 border border-slate-200 transition-colors">
            Làm mới cuộc hội thoại
          </button>
        </header>

        {/* NỘI DUNG CHÁT - TỰ ĐỘNG CHUYỂN GIỮA VÀ ĐÁY */}
        {messages?.length === 0 ? (
          /* ========================================== */
          /* TRẠNG THÁI 1: CHƯA CÓ TIN NHẮN -> CĂN GIỮA */
          /* ========================================== */
          <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full -mt-10">
            <EmptyChatState onSendMessage={sendMessage} />
          </div>
        ) : (
          /* ========================================== */
          /* TRẠNG THÁI 2: ĐÃ CÓ TIN NHẮN -> BÁM ĐÁY    */
          /* ========================================== */
          <div className="flex-1 flex flex-col h-[calc(100vh-200px)] w-full max-w-4xl mx-auto px-4 relative">
            {/* 1. Danh sách tin nhắn cuộn trượt */}

            <ChatMessageList messages={messages} />
            <ChatInputBar onSendMessage={sendMessage} />
          </div>
        )}
      </main>
    </div>
  );
}
