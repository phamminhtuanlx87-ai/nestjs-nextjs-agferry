"use client";
import CapNhatCongTrinhFrom from "@/components/modules/cong-trinh/CapNhatCongTrinhFrom";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getCongTrinh, ICongTrinh } from "@/services/congTrinhService";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CongTrinhChiTietPage() {
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [dsCongTrinh, setDsCongTrinh] = useState<ICongTrinh[]>([]);
  
    useEffect(() => {
      const loadData = async () => {
        const data = await getCongTrinh(id as string);
        if (!data) {
          throw new Error("Không tìm thấy công trình với ID: " + id);
        }
        setDsCongTrinh([data]);
      };
      
      const fetchData = async () => {
        try {
          setLoading(true);
          await loadData();
        } catch (error) {
          console.error("Lỗi khi load danh sách công trình:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [id]);
  
    if (loading) return <LoadingScreen />;
  
  return (
    <div>
       <DynamicBreadcrumb mypathname={`cong-trinh/${dsCongTrinh[0].ten_cong_trinh}`}/>
      <CapNhatCongTrinhFrom congTrinh={dsCongTrinh[0]} />
    </div>
  );
}
