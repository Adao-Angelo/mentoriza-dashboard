'use client';

import AdvisorCard from '@/components/advisor/advisor-card';
import { Separator } from '@/components/ui/separator';
import { Group } from '@/services/groups/Interfaces';
import { ReactNode } from 'react';
import AdvisorList from './advisor-list';
import GroupHeader from './group-header';

interface GroupCardProps {
  children: ReactNode;
  group: Group;
}

export default function GroupCard({ children, group }: GroupCardProps) {
  return (
    <div className='min-w-70.75 rounded-lg bg-white border border-[#DEDEE6]'>
      <GroupHeader
        group={group}
        groupName={group?.name}
        description={'The future starts now!'}
      />

      {children}
      <Separator className='mt-24' />
      <AdvisorList>
        <AdvisorCard
          name={group.advisor?.user?.name ?? ''}
          role='Orientador'
        ></AdvisorCard>
        {group.coAdvisor && (
          <AdvisorCard
            name={group.coAdvisor?.user?.name ?? ''}
            role='Co-orientador'
          ></AdvisorCard>
        )}
      </AdvisorList>
    </div>
  );
}
