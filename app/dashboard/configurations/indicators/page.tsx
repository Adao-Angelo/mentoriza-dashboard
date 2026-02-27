'use client';

import { useState } from 'react';

import { IndicatorCard } from '@/components/indicators/indicator-card';
import { IndicatorFormDialog } from '@/components/indicators/indicator-form-dialog';
import GlobalLoader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { useIndicators } from '@/hooks/indicators/use-indicators';
import { FileSearch2, PlusIcon } from 'lucide-react';

export default function IndicatorsPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { data: indicators = [], isLoading } = useIndicators();

  return (
    <div className='container '>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 '>
        <div></div>

        {/* <div>
          <Button onClick={() => setOpenCreateDialog(true)}>
            <Plus /> Novo Indicador
          </Button>
        </div> */}
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <GlobalLoader variant='mini' />
        </div>
      ) : indicators.length === 0 ? (
        <div className='text-center py-16 flex items-center justify-center flex-col gap-2 text-muted-foreground'>
          <FileSearch2 size={50} strokeWidth={1.5} />
          <p className='text-sm text-muted-foreground'>
            Nenhum indicador criado ainda
          </p>
          <Button className='mt-6' onClick={() => setOpenCreateDialog(true)}>
            <PlusIcon />
            Criar o primeiro indicador
          </Button>
        </div>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {indicators.map((indicator) => (
            <IndicatorCard key={indicator.id} indicator={indicator} />
          ))}
        </div>
      )}

      {/* Diálogo de criação */}
      <IndicatorFormDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
    </div>
  );
}
