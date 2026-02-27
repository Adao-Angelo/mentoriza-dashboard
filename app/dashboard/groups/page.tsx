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
import { FileSearch2, Users } from 'lucide-react';
import { useState } from 'react';

const TOTAL_STUDENTS = 60;
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

function GenerateGroupsDialogContent({
  totalStudents,
  selectedSize,
  onSelectSize,
}: {
  totalStudents: number;
  selectedSize: number;
  onSelectSize: (size: number) => void;
}) {
  return (
    <DialogContent className=''>
      <DialogHeader>
        <DialogTitle className='text-base font-bold'>
          {totalStudents}
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
        <Button className='bg-black text-white mt-5' size={'lg'}>
          <Users /> Gerar grupos
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function GroupsPage() {
  const [selectedGroupSize, setSelectedGroupSize] = useState(4);

  const handleSelectSize = (size: number) => {
    setSelectedGroupSize(size);
  };

  return (
    <div className='w-full min-h-dvh flex flex-col items-center justify-start'>
      <GroupHeader />
      <Dialog>
        <EmptyGroupsView />
        <GenerateGroupsDialogContent
          totalStudents={TOTAL_STUDENTS}
          selectedSize={selectedGroupSize}
          onSelectSize={handleSelectSize}
        />
      </Dialog>
    </div>
  );
}
