"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdvisorById } from "@/hooks/advisors/use-advisor-by-id";
import { getInitials } from "initials-extractor";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { PageSkeleton } from "./page-skeleton";

export default function AdvisorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const advisorId = Number(params.id);

  const { data: advisor, isLoading } = useAdvisorById(advisorId);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!advisor) {
    return (
      <div className="w-full px-2 mt-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Orientador não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 mt-3">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="relative w-full">
        <Image
          src="/capa.svg"
          alt="Capa"
          width={977}
          height={220}
          unoptimized
          className="w-full object-cover h-60 rounded-xl"
        />

        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-4xl p-1 border flex items-center justify-center bg-white">
            <span className="text-2xl font-bold text-gray-700">
              {getInitials(advisor.user?.name ?? "O")}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full border rounded-2xl border-[#DEDEE6] mt-20 p-6">
        <div className="w-full flex justify-between items-center mb-6">
          <h3 className="text-base font-bold">Informações do Orientador</h3>

          <Badge
            variant={
              advisor.user?.status === "active" ? "success" : "destructive"
            }
          >
            {advisor.user?.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Nome
              </p>
              <p className="text-base">
                {advisor.user?.name ?? "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Email
              </p>
              <p className="text-base">
                {advisor.user?.email ?? "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Especialidade
              </p>
              <p className="text-base">
                {advisor.specialty ?? "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Telefone
              </p>
              <p className="text-base">
                {advisor.user?.phone ?? "Não informado"}
              </p>
            </div>
          </div>

          {advisor.advisedGroups && advisor.advisedGroups.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-3">
                Grupos que Orienta
              </p>
              <div className="space-y-2">
                {advisor.advisedGroups.map(
                  (group: { name: string }, idx: number) => (
                    <div
                      key={idx}
                      className="px-3 py-2 bg-muted rounded-md text-sm"
                    >
                      {group.name}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {advisor.coAdvisedGroups && advisor.coAdvisedGroups.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-3">
                Grupos que Co-orienta
              </p>
              <div className="space-y-2">
                {advisor.coAdvisedGroups.map(
                  (group: { name: string }, idx: number) => (
                    <div
                      key={idx}
                      className="px-3 py-2 bg-muted rounded-md text-sm"
                    >
                      {group.name}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
