"use client"
import { FiPaperclip, FiTrash2 } from 'react-icons/fi';

interface LinkFileProps {
  name: string;
  link: string;
  onRemove?: () => void;
  isEdit?: boolean;
}

export const LinkFileItem = ({ name, link, onRemove, isEdit }: LinkFileProps) => (
  <div className="flex items-center gap-2 p-2 border border-slate-200 rounded bg-white hover:border-blue-300 transition-all group">
    <FiPaperclip className="text-slate-400" />
    <a href={link} target="_blank" rel="noreferrer" className="flex-1 text-sm truncate text-blue-600 hover:underline">
      {name || "Tên file chưa nhập"}
    </a>
    {isEdit && (
      <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 p-1">
        <FiTrash2 size={14} />
      </button>
    )}
  </div>
);