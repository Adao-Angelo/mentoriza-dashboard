"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface DashboardCardProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  iconBgClassName?: string;
  iconColorClassName?: string;
}

export default function DashboardCard({
  icon: Icon,
  children,
  className,
  iconBgClassName = "bg-purple-100",
  iconColorClassName = "text-purple-600",
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "min-h-[124px] bg-white rounded-[12px] p-3 shadow-none",
        className,
      )}
    >
      <CardHeader className="p-0 mb-0">
        <div
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-[12px]",
            iconBgClassName,
          )}
        >
          <Icon className={cn("w-4 h-4", iconColorClassName)} />
        </div>
      </CardHeader>

      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
