

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
      {/* Trang Login/Register sẽ hiện ở đây, không có Navbar */}
      {children}
    </div>
  );
}
