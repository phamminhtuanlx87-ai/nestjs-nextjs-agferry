"use client";
import MeForm from "@/components/modules/auth/MeForm";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import React from "react";

export default function MePage() {
  return (
    <div>
      <DynamicBreadcrumb />
      <MeForm />
    </div>
  );
}
