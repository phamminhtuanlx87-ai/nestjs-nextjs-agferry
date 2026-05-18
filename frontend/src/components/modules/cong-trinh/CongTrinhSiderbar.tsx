"use client";
import React from "react";

interface Step {
  id: string;
  label: string;
}

interface CongTrinhSiderbarPros {
  steps: Step[];
  activeId: string;
  onStepClick: (id: string) => void;
}

export const CongTrinhSiderbar: React.FC<CongTrinhSiderbarPros> = ({
  steps,
  activeId,
  onStepClick,
}) => {
  return (
    <div className="w-64 shrink-0">
      <div className="sticky top-24 flex flex-col bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase p-3 tracking-[2px]">
          Danh mục
        </p>

        <div className="space-y-1">
          {steps.map((step) => {
            const isActive = activeId === step.id;
            return (
              <button
                key={step.id}
                onClick={() => onStepClick(step.id)}
                className={`
                  w-full relative flex items-center px-4 py-3 text-[13px] font-medium transition-all duration-200 rounded-xl
                  ${isActive 
                    ? "bg-blue-50 text-blue-700 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }
                `}
              >
                {/* Vạch kẻ xanh bên trái */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full" />
                )}
                
                <span className={`truncate ${isActive ? "translate-x-1" : ""} transition-transform`}>
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};