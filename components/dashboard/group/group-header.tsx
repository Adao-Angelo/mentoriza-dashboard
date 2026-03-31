import { Can } from '@/components/rbac/can';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PERMISSIONS } from '@/context/permissions';
import { useDeleteGroup } from '@/hooks/groups/useDeleteGroup';
import { useConfirm } from '@/hooks/use-confirm';
import { Group } from '@/services/groups/Interfaces';
import { ClipboardList, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EditGroupModal from './edit-group-modal';
import ViewGroupDetailsModal from './view-group-details-modal';

interface GroupHeaderProps {
  groupName: string;
  description: string;
  group: Group;
}

export default function GroupHeader({
  groupName,
  description,
  group,
}: GroupHeaderProps) {
  const { mutate: deleteGroupMutation } = useDeleteGroup();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const confirm = useConfirm();

  console.log(group, 'group');

  return (
    <>
      <div className='w-full flex justify-between p-3 border-b relative'>
        <div className='flex flex-col'>
          <div className='w-fit  rounded-full mb-1 flex items-center gap-2 '>
            <h2 className='font-bold text-sm text-center'>{groupName}</h2>
            {group?.information && (
              <div className='flex items-center justify-center w-4 h-4 rounded-full border-2 border-danger animate-pulse'>
                <div className='w-2 h-2 rounded-full bg-danger'></div>
              </div>
            )}
          </div>
          <p className='text-xs text-Gray'>{description}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className='text-[#999999] border border-[#D9D9D9] rounded-[12px] px-1'
              variant={'outline'}
              size='icon'
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-44'>
            <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
              <ClipboardList className='mr-2 h-4 w-4' />
              Ver Detalhes
            </DropdownMenuItem>
            <Can permission={PERMISSIONS.GROUP_UPDATE}>
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Pencil className='mr-2 h-4 w-4' />
                Editar Grupo
              </DropdownMenuItem>
            </Can>
            <Can permission={PERMISSIONS.GROUP_DELETE}>
              <DropdownMenuItem
                onClick={async () => {
                  const isConfirmed = await confirm({
                    title: 'Confirmar Deleção',
                    message: 'Tem certeza de que deseja deletar este grupo?',
                    confirmText: 'Deletar',
                    cancelText: 'Cancelar',
                  });
                  if (isConfirmed) {
                    deleteGroupMutation(group.id);
                  }
                }}
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Deletar
              </DropdownMenuItem>
            </Can>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ViewGroupDetailsModal
        group={group}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
      <EditGroupModal
        group={group}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
