"use client";

import { useParams, useRouter } from "next/navigation";
import { usePTTeacher } from "@/hooks/pt-teachers/use-pt-teachers";
import GlobalLoader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, BookOpen, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COURSE_LABELS: Record<string, string> = {
  electronica: "Eletrônica",
  informatica: "Informática",
};

export default function PTTeacherDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: ptTeacher, isLoading } = usePTTeacher(id);

  if (isLoading) return <GlobalLoader />;
  if (!ptTeacher) return <div className="p-6">Professor não encontrado.</div>;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{ptTeacher.user.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Professor de Português/Técnico • ID: #{ptTeacher.id}
          </p>
        </div>
        <Badge
          variant={
            ptTeacher.user.status === "active" ? "default" : "destructive"
          }
          className="text-sm px-4 py-1 rounded-full"
        >
          {ptTeacher.user.status === "active" ? "Conta Ativa" : "Conta Inativa"}
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
                  Email
                </p>
                <p className="font-medium">{ptTeacher.user.email}</p>
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
                  {ptTeacher.user.phone || "Não informado"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Atribuição Acadêmica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background border shadow-sm">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Curso Vinculado
                </p>
                <p className="font-medium">
                  {COURSE_LABELS[ptTeacher.course] || ptTeacher.course}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
