"use client";
import React from "react";
import { motion } from "framer-motion";
import { BiNote, BiWallet } from "react-icons/bi";
import { FiPercent } from "react-icons/fi";
import FinancialChart from "./FinancialChart";
const TongDuToanCard = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-6">
        {/* CARD 1: TỔNG DT ĐƯỢC DUYỆT */}
        <motion.div
          layout
          className="bg-white border border-slate-200/80 rounded-xl p-4.5 relative overflow-hidden shadow-xs trendline-bg group hover:border-[#15157d]/30 transition
                   w-full h-40"
          id="card-approved-revenue"
        >
          <div className="flex items-center justify-between mb-1.5 z-10 relative">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
              Tổng DT được duyệt
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f0ecf5] flex items-center justify-center border border-[#e4e1ea]">
              <BiWallet size={16} className="text-[#15157d]" />
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans z-10 relative flex items-baseline gap-0.5">
            12.500.000.000
            <span className="text-base font-bold text-slate-900 ml-0.5">đ</span>
          </h3>

          <div className="flex items-center gap-1.5 mt-3.5 z-10 relative">
            <span className="bg-[#e1e0ff] text-[#15157d] px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-tight">
              10 công trình
            </span>
            <span className="text-[10.5px] text-[#464652] font-medium italic">
              Lũy kế đến 06/2026
            </span>
          </div>

          {/* Absolute SVG Trendline representing dynamic growth */}
          <div className="absolute bottom-1 right-2 w-30 h-10 opacity-30 pointer-events-none">
            <svg viewBox="0 0 100 50" fill="none" className="w-full h-full">
              <path
                d="M0 40 Q25 45 40 25 T80 20 T100 5"
                stroke="#15157d"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
        {/* CARD 2: TỔNG QUYẾT TOÁN */}
        <motion.div
          layout
          className="bg-white border border-slate-200/80 rounded-xl p-4.5 relative overflow-hidden shadow-xs checkmark-bg group hover:border-indigo-200 transition
          w-full h-40"
          id="card-settled-revenue"
        >
          <div className="flex items-center justify-between mb-1.5 z-10 relative">
            <span className="text-[11px] text-slate-400  font-semibold uppercase tracking-wide">
              Tổng quyết toán
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f0ecf5] flex items-center justify-center border border-[#e4e1ea]">
              <BiNote size={16} className="text-[#1c2c5a]" />
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans z-10 relative flex items-baseline gap-0.5">
            12.200.000.000
            <span className="text-base font-bold text-slate-900 ml-0.5">đ</span>
          </h3>

          <div className="flex items-center gap-1.5 mt-3.5 z-10 relative">
            <span className="bg-[#cfe5ff] text-[#051d30] px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-tight">
              10 công trình
            </span>
            <span className="text-[10.5px] text-[#464652] font-medium italic">
              Đã hoàn thành quyết toán
            </span>
          </div>

          {/* Subtle graphical backdrop matching the screenshot perfectly */}
          <div className="absolute bottom-0 right-1 w-20 h-20 opacity-5 pointer-events-none">
            <svg
              viewBox="0 0 50 50"
              className="w-full h-full text-slate-700"
              fill="none"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                d="M17 25 L22 30 L33 18"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* CARD 3: TỶ LỆ QUYẾT TOÁN */}
        <motion.div
          layout
          className="bg-white border border-slate-200/80 rounded-xl p-4.5 relative overflow-hidden shadow-xs group hover:border-indigo-200 transition flex-1
          h-40 w-full"
          id="card-settlement-ratio"
        >
          {/* Phần Header Card */}
          <div className="flex items-center justify-between mb-1.5 relative z-10">
            <span className="text-[11px] text-[#464652] font-semibold uppercase tracking-wide">
              Tỷ lệ quyết toán
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#fbf4f5] flex items-center justify-center border border-[#fce8eb]">
              <FiPercent size={16} className="text-[#f491a0]" />
            </div>
          </div>

          {/* Phần số liệu chính */}
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans z-10 relative flex items-baseline gap-0.5">
            {/* Tỷ lệ thực tế tính từ data (Ví dụ: 12.2 / 12.5 = 97.6%) */}
            {((12.2 / 12.5) * 100).toFixed(1)}
            <span className="text-base font-bold text-slate-500 ml-0.5">%</span>
          </h3>

          {/* THIẾT KẾ MỚI: Hiển thị số thực tế chênh lệch */}
          <div className="flex flex-col gap-0.5 mt-1.5 z-10 relative">
            {/* Dòng 1: Số tiền thực tế đã quyết toán */}
            <div className="text-[12px] font-bold text-slate-700 flex items-center gap-1">
              <span>Đã đạt:</span>
              <span className="text-indigo-600">
                {/* Helper format tiền tệ của bạn */}
                12.2 / 12.5 tỷ đồng
              </span>
            </div>

            {/* Dòng 2: Số chênh lệch thực tế (Dự toán - Quyết toán) */}
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 flex-wrap">
              <span>Chênh lệch:</span>
              {12.2 - 12.5 > 0 ? (
                <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                  300.000.000 đ
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold text-[10px] ">
                  Vượt dự toán được duyệt
                </span>
              )}
            </div>
          </div>

          {/* SVG Vòng tròn mờ trang trí phía bên phải (Đã làm đậm nét theo yêu cầu trước) */}
          <div className="absolute right-2 bottom-2 w-16 h-16 opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-300">
            <svg
              viewBox="0 0 50 50"
              className="w-full h-full text-slate-400"
              fill="none"
            >
              <circle
                cx="25"
                cy="25"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
              />
              <line
                x1="25"
                y1="25"
                x2="25"
                y2="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <line
                x1="25"
                y1="25"
                x2="36"
                y2="36"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </div>
        </motion.div>
        <motion.div
          layout
          className="bg-white border border-slate-200/80 rounded-xl p-4.5 relative overflow-hidden shadow-xs piechart-bg group hover:border-amber-200 transition
          h-40 w-full "
          id="card-chart"
        >
          <div>
            <FinancialChart />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TongDuToanCard;
