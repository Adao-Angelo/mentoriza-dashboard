// components/dashboard/group/AddAdvisorToGroupModal.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAdvisors } from '@/hooks/advisors/use-advisors';
import { useLinkAdvisorToGroup } from '@/hooks/advisors/useLinkAdvisorToGroup';
import { Advisor } from '@/services/advisor/interfaces';
import { Group } from '@/services/groups/Interfaces';
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
  group: Group;
  isCoAdvisor: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAdvisorToGroupModal({
  group,
  isCoAdvisor,
  open,
  onOpenChange,
}: Props) {
  const [search, setSearch] = useState('');
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<number | null>(
    null
  );

  const { data: advisors = [], isLoading } = useAdvisors();
  const mutation = useLinkAdvisorToGroup(isCoAdvisor);

  const filteredAdvisors = advisors.filter(
    (advisor: Advisor) =>
      (advisor.user?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (advisor.user?.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (advisorId: number) => {
    setSelectedAdvisorId((prev) => (prev === advisorId ? null : advisorId));
  };

  const handleAdd = () => {
    if (!selectedAdvisorId) return;

    mutation.mutate(
      { groupId: group.id, advisorId: selectedAdvisorId },
      {
        onSuccess: () => {
          toast.success(
            `Orientador ${isCoAdvisor ? 'co-' : ''}adicionado com sucesso!`
          );
          onOpenChange(false);
          setSelectedAdvisorId(null);
          setSearch('');
        },
      }
    );
  };

  const title = isCoAdvisor
    ? 'Adicionar Co-orientador'
    : 'Adicionar Orientador';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Selecione um orientador para o grupo <strong>{group.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-4'>
          <Input
            placeholder='Buscar por nome ou email...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          {isLoading ? (
            <div className='flex justify-center py-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : filteredAdvisors.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              {search
                ? 'Nenhum orientador encontrado com este termo'
                : 'Nenhum orientador disponível'}
            </div>
          ) : (
            <ScrollArea className='h-[320px] pr-4 -mr-4'>
              <div className='space-y-1'>
                {filteredAdvisors.map((advisor) => {
                  const isSelected = selectedAdvisorId === advisor.id;
                  const name = advisor.user?.name ?? 'Sem nome';
                  const email = advisor.user?.email ?? 'Sem email';
                  const initials =
                    name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || '??';

                  return (
                    <div
                      key={advisor.id}
                      onClick={() => handleSelect(advisor.id)}
                      className={`
                        flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors
                        ${
                          isSelected
                            ? 'bg-primary/10 border border-primary/30'
                            : 'hover:bg-muted'
                        }
                      `}
                    >
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium leading-tight truncate'>
                          {name}
                        </p>
                        <p className='text-sm text-muted-foreground truncate'>
                          {email}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className='h-5 w-5 text-primary flex-shrink-0' />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedAdvisorId || mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Adicionando...
              </>
            ) : (
              'Adicionar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
