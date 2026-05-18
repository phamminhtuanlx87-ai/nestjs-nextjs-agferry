"use client"
import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-bg">
      <div className="relative">
        {/* Một hiệu ứng sóng lan tỏa từ tâm */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg">
          {/* Thay bằng icon phà của Tuấn */}
          <span className="text-3xl">🚢</span>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}
