"use client";
import React, { useEffect, useRef } from "react";
import { AiMessage } from "../type/message.interface";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageListProps {
  messages: AiMessage[];
}

const ChatMessageList = ({ messages }: ChatMessageListProps) => {
  // Tự động cuộn xuống tin nhắn mới nhất khi messages thay đổi
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex gap-3 ${
            msg?.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {/* Icon Avatar AI */}
          {msg?.role !== "user" && (
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
              ✨
            </div>
          )}

          {/* BONG BÓNG TIN NHẮN */}
          {msg?.role === "assistant" && !msg?.content ? (
            /* 1. Nếu là AI mà chưa có nội dung -> Hiển thị 3 chấm nhấp nháy */
            <div className="flex items-center gap-1.5 p-3.5 bg-slate-100 rounded-2xl rounded-tl-none border border-slate-200/60 w-fit">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
            </div>
          ) : (
            /* 2. Nếu đã có nội dung (hoặc tin nhắn User) -> Hiển thị chữ */
            <div
              className={`p-3.5 rounded-2xl max-w-[80%] text-sm ${
                msg?.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                  : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60"
              }`}
            >
              {msg?.role === "user" ? (
                msg?.content
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Tùy chỉnh khoảng cách giữa các đoạn văn
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      // Tùy chỉnh danh sách gạch đầu dòng
                      ul: ({ children }) => (
                        <ul className="list-disc ml-5 mb-2 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal ml-5 mb-2 space-y-1">
                          {children}
                        </ol>
                      ),
                      // Tùy chỉnh tiêu đề / chữ in đậm
                      strong: ({ children }) => (
                        <strong className="font-semibold text-slate-900">
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessageList;
