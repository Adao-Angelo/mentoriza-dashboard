// AddStudentToGroupModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLinkStudentToGroup } from "@/hooks/groups/useLinkStudentToGroup";
import { useStudentsWithoutGroup } from "@/hooks/students/use-students-without-group";
import { Group } from "@/services/groups/Interfaces";
import { Student } from "@/services/students/Interfaces";
import { Check } from "lucide-react";
import { useState } from "react";

interface Props {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStudentToGroupModal({ group, open, onOpenChange }: Props) {
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );

  const { data: availableStudents = [], isLoading } = useStudentsWithoutGroup(
    group.course,
  );
  const linkMutation = useLinkStudentToGroup();

  const filteredStudents = availableStudents.filter(
    (s: Student) =>
      s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.user?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    if (!selectedStudentId) return;

    linkMutation.mutate(
      { groupId: group.id, studentId: selectedStudentId },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedStudentId(null);
          setSearch("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Adicionar estudante ao grupo</DialogTitle>
          <DialogDescription>
            Grupo: <strong>{group.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />

          <div className="max-h-72 overflow-y-auto border rounded-md">
            {isLoading ? (
              <p className="p-4 text-center text-gray-500">Carregando...</p>
            ) : filteredStudents.length === 0 ? (
              <p className="p-4 text-center text-gray-500">
                Nenhum estudante disponível
              </p>
            ) : (
              filteredStudents.map((student: Student) => (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                    selectedStudentId === student.id ? "bg-purple-50" : ""
                  }`}
                  onClick={() => setSelectedStudentId(student.id)}
                >
                  <div>
                    <p className="font-medium">{student.user?.name}</p>
                    <p className="text-sm text-gray-500">
                      {student.user?.email}
                    </p>
                  </div>
                  {selectedStudentId === student.id && (
                    <Check className="text-green-600" size={20} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedStudentId || linkMutation.isPending}
          >
            {linkMutation.isPending ? "Adicionando..." : "Adicionar ao grupo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
