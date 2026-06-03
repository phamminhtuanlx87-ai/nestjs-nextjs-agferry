"use client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "min-w-2xl lg:min-w-4xl",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    // Lớp bao ngoài cùng: Phải là fixed và z-index cực cao (ví dụ z-50)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
      {/* Lớp nền đen mờ (Backdrop): Phải nằm tuyệt đối trong lớp bao */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Khung nội dung Modal: Phải có relative để nổi lên trên lớp nền đen */}
      <div
        className={`relative bg-slate-100 border border-primary-surface card-soft p-6 rounded-2xl shadow-2xl transition-all scale-100 opacity-100 
          animate-in zoom-in-95
          ${className || ""}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-primary hover:text-primary/60 hover:scale-120 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mt-2 text-primary ">{children}</div>
      </div>
    </div>
  );
}
