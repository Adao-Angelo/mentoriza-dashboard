"use client";

import AdvisorCard from "@/components/advisor/advisor-card";
import { Separator } from "@/components/ui/separator";
import { Group } from "@/services/groups/Interfaces";
import { ReactNode } from "react";
import AdvisorList from "./advisor-list";
import GroupHeader from "./group-header";

interface GroupCardProps {
  children: ReactNode;
  group: Group;
}

export default function GroupCard({ children, group }: GroupCardProps) {
  return (
    <div className="min-w-70.75 rounded-lg bg-white border border-[#DEDEE6]">
      <GroupHeader
        group={group}
        groupName={group?.name}
        description={group?.title || group?.description || "Grupo sem Tema "}
      />

      {children}
      <Separator className="mt-24" />
      <AdvisorList>
        <AdvisorCard
          advisorId={group.advisor?.id}
          name={group.advisor?.user?.name ?? ""}
          role="Orientador"
        />
        {group.coAdvisor && (
          <AdvisorCard
            advisorId={group.coAdvisor?.id}
            name={group.coAdvisor?.user?.name ?? ""}
            role="Co-orientador"
          />
        )}
      </AdvisorList>
    </div>
  );
}
