'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useLinkStudentsToGroup } from '@/hooks/groups/useLinkStudentsToGroup';
import { useStudentsWithoutGroup } from '@/hooks/students/use-students-without-group';
import { Group } from '@/services/groups/Interfaces';
import { Student } from '@/services/students/Interfaces';
import { Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStudentToGroupModal({ group, open, onOpenChange }: Props) {
  const [search, setSearch] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  const { data: availableStudents = [], isLoading } = useStudentsWithoutGroup(
    group.course
  );

  const linkMutation = useLinkStudentsToGroup();

  const filteredStudents = availableStudents.filter(
    (s: Student) =>
      s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStudent = (studentId: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAdd = () => {
    if (selectedStudentIds.length === 0) return;

    linkMutation.mutate(
      { groupId: group.id, studentIds: selectedStudentIds },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedStudentIds([]);
          setSearch('');
        },
      }
    );
  };

  const selectedCount = selectedStudentIds.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            Adicionar estudantes ao grupo
          </DialogTitle>
          <DialogDescription>
            <strong>{group.name}</strong> • {group.course}
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <Input
            placeholder='Buscar por nome ou email...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='mb-4'
          />

          {/* Contador de selecionados */}
          {selectedCount > 0 && (
            <div className='mb-3 px-3 py-2 bg-purple-50 text-purple-700 rounded-md text-sm flex items-center gap-2'>
              <Check className='w-4 h-4' />
              {selectedCount} estudante{selectedCount > 1 ? 's' : ''}{' '}
              selecionado{selectedCount > 1 ? 's' : ''}
            </div>
          )}

          <div className='max-h-72 overflow-y-auto border rounded-md'>
            {isLoading ? (
              <p className='p-4 text-center text-gray-500'>Carregando...</p>
            ) : filteredStudents.length === 0 ? (
              <p className='p-4 text-center text-gray-500'>
                Nenhum estudante disponível
              </p>
            ) : (
              filteredStudents.map((student: Student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-purple-50' : ''
                    }`}
                    onClick={() => toggleStudent(student.id)}
                  >
                    <div>
                      <p className='font-medium'>{student.user?.name}</p>
                      <p className='text-sm text-gray-500'>
                        {student.user?.email}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className='text-green-600' size={20} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selectedCount === 0 || linkMutation.isPending}
          >
            {linkMutation.isPending
              ? 'Adicionando...'
              : `Adicionar ${selectedCount > 0 ? `(${selectedCount})` : ''} ao grupo`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
