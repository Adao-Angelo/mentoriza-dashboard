'use client';

import AdvisorCard from '@/components/advisor/advisor-card';
import { Can } from '@/components/rbac/can';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PERMISSIONS } from '@/context/permissions';
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

        <div
          className={`
            px-3 pb-3
            transition-all duration-300 ease-in-out
            ${
              showAddButton
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }
          `}
        >
          <Can permission={PERMISSIONS.STUDENT_CREATE}>
            <Button
              className='w-full'
              onClick={() => setAddStudentOpen(true)}
              variant='outline'
              size='sm'
            >
              Adicionar Estudante
              <Plus size={20} className='ml-2' />
            </Button>
          </Can>
        </div>
      </div>
      <Separator className='mt-8' />
      <AdvisorList>
        {group.advisor && (
          <AdvisorCard
            advisorId={group.advisor?.id}
            name={group.advisor?.user?.name ?? ''}
            role='Orientador'
            group={group}
          />
        )}
        {group.coAdvisor && (
          <AdvisorCard
            advisorId={group.coAdvisor?.id}
            name={group.coAdvisor?.user?.name ?? ''}
            role='Co-orientador'
            group={group}
            isCoAdvisor
          />
        )}
        {!group.advisor && (
          <Can permission={PERMISSIONS.STUDENT_LINK_GROUP}>
            <Button
              onClick={() => setAddAdvisorOpen(true)}
              variant={'outline'}
              size={'sm'}
            >
              <Plus size={14} /> Adicionar orientador
            </Button>
          </Can>
        )}
        {!group.coAdvisor && (
          <Can permission={PERMISSIONS.STUDENT_LINK_GROUP}>
            <Button
              onClick={() => setAddCoAdvisorOpen(true)}
              variant={'outline'}
              size={'sm'}
            >
              <Plus size={14} /> Adicionar co-orientador
            </Button>
          </Can>
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
