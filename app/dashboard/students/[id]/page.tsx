"use client";

import { Button } from "@/components/ui/button";
import { useStudentById } from "@/hooks/students/use-student-by-id";
import { getInitials } from "initials-extractor";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { PageSkeleton } from "./page-skeleton";

export default function StudentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = Number(params.id);

  const { data: student, isLoading } = useStudentById(studentId);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!student) {
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
          <p className="text-muted-foreground">Estudante não encontrado</p>
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
              {getInitials(student.user?.name ?? "E")}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full border rounded-2xl border-[#DEDEE6] mt-20 p-6">
        <div className="w-full flex justify-between items-center mb-6">
          <h3 className="text-base font-bold">Informações do Estudante</h3>

          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              student.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {student.status === "active" ? "Ativo" : "Inativo"}
          </span>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Nome
              </p>
              <p className="text-base">
                {student.user?.name ?? "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Email
              </p>
              <p className="text-base">
                {student.user?.email ?? "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Número de Estudante
              </p>
              <p className="text-base">{student.ra ?? "Não informado"}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Curso
              </p>
              <p className="text-base">{student.course ?? "Não informado"}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Turma
              </p>
              <p className="text-base">{student.class ?? "Não informado"}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Telefone
              </p>
              <p className="text-base">{student.phone ?? "Não informado"}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Data de Nascimento
              </p>
              <p className="text-base">
                {student.birthDate
                  ? new Date(student.birthDate).toLocaleDateString("pt-BR")
                  : "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Grupo
              </p>
              <p className="text-base">{student.group?.name ?? "Nenhum"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
