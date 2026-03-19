'use client';

import AdvisorCard from '@/components/advisor/advisor-card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Group } from '@/services/groups/Interfaces';
import { Plus } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { AddAdvisorToGroupModal } from './add-advisor-to-group-modal';
import { AddStudentToGroupModal } from './add-student-to-group-modal';
import AdvisorList from './advisor-list';
import GroupHeader from './group-header';

interface GroupCardProps {
  children: ReactNode;
  group: Group;
}

export default function GroupCard({ children, group }: GroupCardProps) {
  const [showAddButton, setShowAddButton] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [addAdvisorOpen, setAddAdvisorOpen] = useState(false);
  const [addCoAdvisorOpen, setAddCoAdvisorOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
      className='min-w-70.75 rounded-lg  bg-white border border-[#DEDEE6] h-fix! '
    >
      <GroupHeader
        group={group}
        groupName={group?.name}
        description={group?.title || group?.description || 'Grupo sem Tema '}
      />

      <div className='relative'>
        {children}

        <div className='p-3'>
          {showAddButton && (
            <Button
              className='w-full'
              onClick={() => setAddStudentOpen(true)}
              variant={'outline'}
              size={'sm'}
            >
              Adicionar Estuante
              <Plus size={20} />
            </Button>
          )}
        </div>
      </div>
      <Separator className='mt-24' />
      <AdvisorList>
        {group.advisor && (
          <AdvisorCard
            advisorId={group.advisor?.id}
            name={group.advisor?.user?.name ?? ''}
            role='Orientador'
          />
        )}
        {group.coAdvisor && (
          <AdvisorCard
            advisorId={group.coAdvisor?.id}
            name={group.coAdvisor?.user?.name ?? ''}
            role='Co-orientador'
          />
        )}
        {!group.advisor && (
          <Button
            onClick={() => setAddAdvisorOpen(true)}
            variant={'outline'}
            size={'sm'}
          >
            <Plus size={14} /> Adicionar orientador
          </Button>
        )}
        {!group.coAdvisor && (
          <Button
            onClick={() => setAddCoAdvisorOpen(true)}
            variant={'outline'}
            size={'sm'}
          >
            <Plus size={14} /> Adicionar co-orientador
          </Button>
        )}
      </AdvisorList>

      <AddStudentToGroupModal
        group={group}
        open={addStudentOpen}
        onOpenChange={setAddStudentOpen}
      />

      <AddAdvisorToGroupModal
        group={group}
        isCoAdvisor={false}
        open={addAdvisorOpen}
        onOpenChange={setAddAdvisorOpen}
      />

      <AddAdvisorToGroupModal
        group={group}
        isCoAdvisor={true}
        open={addCoAdvisorOpen}
        onOpenChange={setAddCoAdvisorOpen}
      />
    </div>
  );
}
