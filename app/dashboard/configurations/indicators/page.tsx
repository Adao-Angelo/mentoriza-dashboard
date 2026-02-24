'use client';

import { useState } from 'react';

import { IndicatorCard } from '@/components/indicators/indicator-card';
import { IndicatorFormDialog } from '@/components/indicators/indicator-form-dialog';
import { Button } from '@/components/ui/button';
import { useIndicators } from '@/hooks/indicators/use-indicators';
import { Loader2, Plus } from 'lucide-react';

export default function IndicatorsPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { data: indicators = [], isLoading } = useIndicators();

  return (
    <div className='container bg-white p-4 rounded-2xl'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-[18px]  tracking-tight'>Seus Indicadores</h1>
          <p className='text-[12px] text-muted-foreground'>
            Estes indicadores serão utilizados para avaliar o seu relatório, por
            isso é importante que estejam bem descritos,
          </p>
        </div>

        <div>
          <Button onClick={() => setOpenCreateDialog(true)}>
            <Plus /> Novo Indicador
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <Loader2 className='h-5 w-5 animate-spin text-Gray' />
        </div>
      ) : indicators.length === 0 ? (
        <div className='text-center py-16 border rounded-lg bg-muted/30'>
          <p className='text-sm text-muted-foreground'>
            Nenhum indicador criado ainda
          </p>
          <Button className='mt-6' onClick={() => setOpenCreateDialog(true)}>
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
