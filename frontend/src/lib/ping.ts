import { NextResponse } from "next/server";

export async function GET() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"; // Thay bằng URL endpoint thực tế của bạn
  const startTime = Date.now();

  try {
    // Gửi một request kiểm tra siêu nhẹ (HEAD hoặc GET với timeout ngắn)
    const response = await fetch(BACKEND_URL, {
      method: "HEAD", 
      cache: "no-store",
      signal: AbortSignal.timeout(5000), // Tự động hủy sau 5 giây nếu server treo
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return NextResponse.json({ status: "online", latency: `${responseTime}ms` });
    }
    
    return NextResponse.json({ status: "error", latency: `${responseTime}ms`, code: response.status }, { status: 500 });
  } catch (error) {
    console.error("Error pinging backend:", error);
    const responseTime = Date.now() - startTime;
    return NextResponse.json({ status: "offline", latency: `${responseTime}ms` }, { status: 503 });
  }
}