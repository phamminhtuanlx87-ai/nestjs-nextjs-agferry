'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Button from './Button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // CHỈ chạy sau khi trình duyệt đã tải xong hoàn toàn
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Nếu chưa mounted, trả về một khoảng trống để tránh lỗi Hydration Mismatch
  if (!mounted) {
    return <div className="w-10 h-10" />; 
  }

  return (
    <Button
      variant="secondary"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? '☀️ Sáng' : '🌙 Tối'}
    </Button>
  );
}