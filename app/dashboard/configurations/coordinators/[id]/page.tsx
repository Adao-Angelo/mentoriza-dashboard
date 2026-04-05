"use client";

import { useParams, useRouter } from "next/navigation";
import { useCoordinator } from "@/hooks/coordinators/use-coordinators";
import GlobalLoader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CoordinatorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: coordinator, isLoading } = useCoordinator(id);

  if (isLoading) return <GlobalLoader />;
  if (!coordinator)
    return <div className="p-6">Coordenador não encontrado.</div>;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{coordinator.user.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            ID do Coordenador: #{coordinator.id}
          </p>
        </div>
        <Badge
          variant={
            coordinator.user.status === "active" ? "default" : "destructive"
          }
          className="text-sm px-4 py-1 rounded-full"
        >
          {coordinator.user.status === "active"
            ? "Conta Ativa"
            : "Conta Inativa"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background border shadow-sm">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Email Institucional
                </p>
                <p className="font-medium">{coordinator.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background border shadow-sm">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Telefone
                </p>
                <p className="font-medium">
                  {coordinator.user.phone || "Não informado"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Dados da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background border shadow-sm">
                <CircleUserRound className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Perfil
                </p>
                <p className="font-medium">Coordenador Geral</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { CircleUserRound } from "lucide-react";
