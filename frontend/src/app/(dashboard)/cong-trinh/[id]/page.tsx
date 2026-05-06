"use client";
import { useParams } from "next/navigation";
import React from "react";

export default function CongTrinhChiTietPage() {
  const params = useParams();
  const id = params.id;
  return (
    <div>
      <h1>Chi tiết công trình ID ${id}</h1>
      <p>Đang phát triển...</p>
    </div>
  );
}
