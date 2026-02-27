'use client';

import { Button } from '@/components/ui/button';
import { FileDown, Plus } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className='container rounded-[12px]'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between md:items-end gap-4 mb-5'>
        <h1 className='text-xl font-bold tracking-tight'></h1>
        <div className='flex gap-3'>
          <Button onClick={() => {}}>
            <Plus />
            Enviar Relatório
          </Button>
          <Button variant={'outline'} onClick={() => {}}>
            <FileDown />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
}
