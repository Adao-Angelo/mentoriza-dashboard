"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { CircleUserRound, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActivateStudent } from "@/hooks/students/use-activate-student";
import { useDeactivateStudent } from "@/hooks/students/use-deactivate-student";
import { useDeleteStudent } from "@/hooks/students/use-delete-student";

import UserProfileDisplay from "@/components/user-profile-display";
import { cn } from "@/lib/utils";
import { Student } from "@/services/students/Interfaces";
import { Eye } from "lucide-react";
import Link from "next/link";

interface StudentsTableProps {
  students: Student[];
}

export default function StudentsTable({ students }: StudentsTableProps) {
  const { mutate: activateStudent } = useActivateStudent();
  const { mutate: deactivateStudent } = useDeactivateStudent();
  const { mutate: deleteStudent } = useDeleteStudent();

  const handleToggleActive = (student: Student) => {
    if (student.status === "active") {
      deactivateStudent(student.id);
    } else {
      activateStudent(student.id);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estudante</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Número de Estudante</TableHead>
            <TableHead>Grupo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">
                <UserProfileDisplay
                  username={student.user?.name}
                  email={student.user?.email}
                />
              </TableCell>
              <TableCell>{student.user?.email}</TableCell>
              <TableCell>{student.course || "-"}</TableCell>
              <TableCell>{student.class || "-"}</TableCell>
              <TableCell>{student.ra || "-"}</TableCell>
              <TableCell>{student.group?.name || "-"}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-block px-3 py-1 text-xs font-semibold rounded-full",
                    student.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
                  )}
                >
                  {student.status === "active" ? "Ativo" : "Inativo"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground border-color-Gray"
                    >
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {/* Ver Detalhes */}
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/students/${student.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex gap-3 items-center">
                        <CircleUserRound />

                        <span>Estado</span>
                      </div>
                      <Switch
                        checked={student.status === "active"}
                        onCheckedChange={() => handleToggleActive(student)}
                        className="ml-2"
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>

                    {/* Remover com confirmação */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                          Remover
                        </DropdownMenuItem>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem a certeza que deseja remover permanentemente o
                            estudante{" "}
                            <span className="font-semibold">
                              {student.name}
                            </span>
                            ? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel size={"sm"}>
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            size={"sm"}
                            onClick={() => deleteStudent(student.id)}
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
