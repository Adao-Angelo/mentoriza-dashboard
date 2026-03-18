'use client';

import AdvisorCard from '@/components/advisor/advisor-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGroup } from '@/hooks/groups/use-group';
import { Group } from '@/services/groups/Interfaces';
import { useState } from 'react';
import EditGroupModal from './edit-group-modal';

interface ViewGroupDetailsProps {
  group: Group;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ViewGroupDetailsModal({
  group,
  isOpen: isOpenProp,
  onOpenChange: onOpenChangeProp,
}: ViewGroupDetailsProps) {
  const [isOpenState, setIsOpenState] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: groupDetails } = useGroup(group.id);

  const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenState;
  const setIsOpen = onOpenChangeProp || setIsOpenState;

  console.log('Group details:', groupDetails);

  if (isEditOpen) {
    return (
      <EditGroupModal
        group={group}
        isOpen={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setIsOpen(false);
        }}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{group.name}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div>
              <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
                Curso
              </h3>
              <p className='text-base bg-primary/10 text-primary p-1 px-4 rounded-full w-fit font-medium'>
                {groupDetails?.course}
              </p>
            </div>

            {group.advisor && (
              <div>
                <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
                  Orientador
                </h3>
                <AdvisorCard
                  name={
                    groupDetails?.advisor?.user.name || group.advisor.user.name
                  }
                  role={'Orientador'}
                />
              </div>
            )}
          </div>

          {group.title && (
            <div>
              <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
                Tema
              </h3>
              <p className='text-base'>{group.title}</p>
            </div>
          )}

          {group.description && (
            <div>
              <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
                Descrição
              </h3>
              <p className='text-base'>{group.description}</p>
            </div>
          )}

          {group.information && (
            <div>
              <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
                Informação
              </h3>
              <p className='text-base'>{group.information}</p>
            </div>
          )}

          {group.coAdvisor && (
            <div>
              <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
                Co-orientador
              </h3>
              <p className='text-base'>{group.coAdvisor.user.name}</p>
            </div>
          )}
        </div>

        <div className='flex justify-end gap-2 pt-4'>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Fechar
          </Button>
          <Button onClick={() => setIsEditOpen(true)}>Editar Grupo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
