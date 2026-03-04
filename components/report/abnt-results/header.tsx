"use client";
import HeaderUserSection from "@/components/dashboard/header/header-user-section";
import { Logo } from "@/components/logo";

export default function ABNTResultHeader() {
  return (
    <div className="w-full h-18 flex justify-between items-center bg-white border-b px-5 sticky top-0 z-50">
      <Logo isPrimary />

      <HeaderUserSection />
    </div>
  );
}
