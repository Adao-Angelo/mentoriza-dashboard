/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import GroupHeader from '@/components/dashboard/groups-header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useGroups } from '@/hooks/groups/use-groups';
import { Group } from '@/services/groups/Interfaces';
import { Student } from '@/services/students/Interfaces';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FileSearch2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import GroupCard from '@/components/dashboard/group/group-card';
import GroupMemberList from '@/components/dashboard/group/group-member-list';
import GroupsBoard from '@/components/dashboard/group/groups-board';
import GlobalLoader from '@/components/loader';
import SortableMember from '@/components/member/SortableMember';
import { useGenerateGroups } from '@/hooks/groups/useGenerateGroups';
import { useLinkStudentToGroup } from '@/hooks/groups/useLinkStudentToGroup';
import { useStudents } from '@/hooks/students/use-students';
import { useCourseStore } from '@/store/use-course.store';

const GROUP_SIZES = [3, 4, 5, 6];
function EmptyGroupsView() {
  return (
    <div className=' flex flex-col justify-center items-center mt-[8rem]'>
      <FileSearch2 strokeWidth={1.5} size={50} />
      <div className='mt-5 text-center'>
        <p className='text-sm font-medium'>Nenhum registro encontrado</p>
        <p className='text-sm font-normal text-[#999999]'>
          Não há registros de grupos disponíveis no momento.
        </p>
      </div>
      <DialogTrigger asChild>
        <Button className='mt-5'>
          <Users /> Gerar grupos
        </Button>
      </DialogTrigger>
    </div>
  );
}

interface GroupSizeSelectorProps {
  selectedSize: number;
  onSelectSize: (size: number) => void;
}

function GroupSizeSelector({
  selectedSize,
  onSelectSize,
}: GroupSizeSelectorProps) {
  return (
    <div className='w-[24.25rem] h-10 flex justify-between items-center'>
      {GROUP_SIZES.map((size) => (
        <Button
          key={size}
          variant={selectedSize === size ? 'default' : 'secondary'}
          onClick={() => onSelectSize(size)}
          className={`w-[5.3125rem] h-10 rounded-lg ${
            selectedSize !== size ? 'text-purple-500' : ''
          }`}
        >
          {size}
        </Button>
      ))}
    </div>
  );
}

interface GenerateGroupsDialogContentProps {
  totalStudents: number;
  selectedSize: number;
  onSelectSize: (size: number) => void;
  onGenerate: () => void;
}

function GenerateGroupsDialogContent({
  totalStudents,
  selectedSize,
  onSelectSize,
  onGenerate,
}: GenerateGroupsDialogContentProps) {
  return (
    <DialogContent className=''>
      <DialogHeader>
        <DialogTitle className='text-base font-bold'>
          {totalStudents} estudantes
        </DialogTitle>
        <DialogDescription className='text-xs font-normal'>
          Selecione como deseja separar os grupos por número de alunos.
        </DialogDescription>
      </DialogHeader>
      <GroupSizeSelector
        selectedSize={selectedSize}
        onSelectSize={onSelectSize}
      />
      <DialogFooter className='w-full flex justify-end'>
        <Button
          className='bg-black text-white mt-5'
          size={'lg'}
          onClick={onGenerate}
        >
          <Users /> Gerar grupos
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function GroupsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: students } = useStudents();
  const [selectedGroupSize, setSelectedGroupSize] = useState(4);
  const { data: groupsFromApi, isLoading } = useGroups();
  const { selectedCourse } = useCourseStore();

  const [groups, setGroups] = useState<Group[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  const linkMutation = useLinkStudentToGroup();
  const generateMutation = useGenerateGroups();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleGenerateGroups = () => {
    generateMutation.mutate(
      { groupSize: selectedGroupSize, course: selectedCourse },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      }
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    const student = groups
      .flatMap((group) => group.students)
      .find((s) => String(s.id) === activeId);

    setActiveStudent(student ?? null);
  };

  const handleDragCancel = () => {
    setActiveStudent(null);
  };

  useEffect(() => {
    if (groupsFromApi) {
      setGroups(groupsFromApi);
    }
  }, [groupsFromApi]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveStudent(null);

    if (!over) {
      console.log('No over → dropped nowhere');
      return;
    }

    console.log({
      activeId: active.id,
      overId: over.id,
      activeType: active.data.current?.type,
      overType: over.data.current?.type,
    });

    const activeStudentId = Number(active.id);
    if (isNaN(activeStudentId)) {
      console.log('Active ID is not number!', active.id);
      return;
    }

    const sourceGroup = groups.find((g) =>
      g.students.some((s) => s.id === activeStudentId)
    );

    if (!sourceGroup) {
      console.log('Source group not found for student', activeStudentId);
      return;
    }

    console.log('Source group:', sourceGroup.id, sourceGroup.name);
    const sourceGroupId = sourceGroup.id;
    const sourceIndex = sourceGroup.students.findIndex(
      (s) => s.id === activeStudentId
    );

    const overId = Number(over.id);

    let destGroup = groups.find((g) => g.id === overId);
    let destIndex: number;

    if (destGroup) {
      destIndex = destGroup.students.length;
    } else {
      destGroup = groups.find((g) => g.students.some((s) => s.id === overId));
      if (!destGroup) return;
      destIndex = destGroup.students.findIndex((s) => s.id === overId);
    }

    const destGroupId = destGroup.id;

    const overIdNum = Number(over.id);
    console.log('overId as number:', overIdNum, 'original:', over.id);

    if (sourceGroupId === destGroupId) {
      if (sourceIndex === destIndex) return;

      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === sourceGroupId
            ? {
                ...group,
                students: arrayMove(group.students, sourceIndex, destIndex),
              }
            : group
        )
      );
      return;
    }

    linkMutation.mutate(
      { groupId: destGroupId, studentId: activeStudentId },
      {
        onSuccess: () => {
          setGroups((prev) =>
            prev.map((g) => {
              if (g.id === sourceGroupId) {
                return {
                  ...g,
                  students: g.students.filter((s) => s.id !== activeStudentId),
                };
              }
              if (g.id === destGroupId) {
                const student = prev
                  .find((gg) => gg.id === sourceGroupId)!
                  .students.find((s) => s.id === activeStudentId);
                if (!student) return g;
                const newStudents = [...g.students];
                newStudents.splice(destIndex, 0, student);
                return {
                  ...g,
                  students: newStudents,
                };
              }
              return g;
            })
          );
        },
        onError: () => {},
      }
    );
  }

  const handleSelectSize = (size: number) => {
    setSelectedGroupSize(size);
  };

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-100'>
        <GlobalLoader variant='mini' />
      </div>
    );

  const hasGroups = groups?.length > 0;

  return (
    <div className='w-full min-h-dvh h-auto flex flex-col items-center justify-start'>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <GroupHeader />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          modifiers={[]}
        >
          {hasGroups ? (
            <GroupsBoard>
              {groups.map((group) => (
                <SortableContext
                  key={group.id}
                  items={group?.students?.map((s) => String(s.id))}
                  strategy={verticalListSortingStrategy}
                >
                  <GroupCard group={group}>
                    <GroupMemberList id={String(group.id)}>
                      {group.students.map((student) => (
                        <SortableMember
                          key={student.id}
                          id={String(student.id)}
                          student={student}
                        />
                      ))}
                    </GroupMemberList>
                  </GroupCard>
                </SortableContext>
              ))}
            </GroupsBoard>
          ) : (
            <EmptyGroupsView />
          )}

          <DragOverlay>
            {activeStudent ? (
              <div className='w-72'>
                <div className='rounded-lg border border-dashed border-purple-500 bg-white p-2 shadow-lg'>
                  <p className='font-semibold text-sm'>
                    {activeStudent.user?.name ?? 'Estudante'}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {activeStudent.user?.email ?? ''}
                  </p>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <GenerateGroupsDialogContent
          totalStudents={students?.length ?? 0}
          selectedSize={selectedGroupSize}
          onSelectSize={handleSelectSize}
          onGenerate={handleGenerateGroups}
        />
      </Dialog>
    </div>
  );
}
