/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import GlobalLoader from "@/components/loader";
import { PTTeacherFormDialog } from "@/components/pt-teacher/pt-teacher-form-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileDisplay from "@/components/user-profile-display";
import {
  useActivatePTTeacher,
  useDeactivatePTTeacher,
  usePTTeachers,
} from "@/hooks/pt-teachers/use-pt-teachers";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth.store";
import {
  CircleUserRound,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type CourseType = "electronica" | "informatica";

const COURSE_LABELS: Record<CourseType, string> = {
  electronica: "Eletrônica",
  informatica: "Informática",
};

export default function PTTeachersPage() {
  const { user: currentUser } = useAuthStore();
  const { data: ptTeachers = [], isLoading } = usePTTeachers();
  const { mutate: deactivate } = useDeactivatePTTeacher();
  const { mutate: activate } = useActivatePTTeacher();

  const isCoordinator = currentUser?.roles.some((r) =>
    ["ADMIN", "COORDINATOR"].includes(r),
  );

  const currentUserPTProfile = ptTeachers.find(
    (t) => t.user.name === currentUser?.username,
  );
  const teacherCourse = currentUserPTProfile?.course as CourseType;

  const [activeCourse, setActiveCourse] = useState<CourseType>(
    teacherCourse || "informatica",
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);

  const filteredTeachers = ptTeachers.filter((t) => t.course === activeCourse);

  const handleToggleActive = (teacher: any) => {
    if (teacher.user.status === "active") {
      deactivate(teacher.id);
    } else {
      activate(teacher.id);
    }
  };

  if (isLoading) return <GlobalLoader />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {isCoordinator ? (
          <Tabs
            value={activeCourse}
            onValueChange={(v) => setActiveCourse(v as CourseType)}
            className="w-fit"
          >
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="informatica" className="px-6">
                Informática
              </TabsTrigger>
              <TabsTrigger value="electronica" className="px-6">
                Eletrônica
              </TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <h2 className="text-lg font-semibold text-muted-foreground">
            Curso de {COURSE_LABELS[activeCourse]}
          </h2>
        )}

        <Button
          onClick={() => {
            setEditingTeacher(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Professor
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[300px]">Professor</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  Nenhum professor encontrado para este curso.
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow
                  key={teacher.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-medium">
                    <UserProfileDisplay
                      username={teacher.user.name}
                      email={teacher.user.email}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {teacher.user.email}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        teacher.user.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200",
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full mr-1.5",
                          teacher.user.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500",
                        )}
                      />
                      {teacher.user.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/configurations/pt-teachers/${teacher.id}`}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex gap-2 items-center">
                            <CircleUserRound className="h-4 w-4" />
                            <span>Estado</span>
                          </div>
                          <Switch
                            checked={teacher.user.status === "active"}
                            onCheckedChange={() => handleToggleActive(teacher)}
                          />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setEditingTeacher(teacher);
                            setIsFormOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PTTeacherFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        ptTeacher={editingTeacher}
      />
    </div>
  );
}
