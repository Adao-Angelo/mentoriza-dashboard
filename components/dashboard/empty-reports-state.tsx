import { Button } from '@/components/ui/button';
import { CloudUpload, FileSearch2 } from 'lucide-react';

interface EmptyReportsStateProps {
  onOpenUpload: () => void;
}

export function EmptyReportsState({ onOpenUpload }: EmptyReportsStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <FileSearch2
        strokeWidth={1.5}
        className='h-10 w-10 text-muted-foreground mb-6'
      />
      <h3 className='text-md font-medium'>Nenhum relatório encontrado</h3>
      <p className='text-sm text-muted-foreground mt-2 max-w-md'>
        Envie o primeiro relatório PDF do seu grupo para avaliação.
      </p>
      <Button className='mt-8 gap-2' onClick={onOpenUpload}>
        <CloudUpload className='h-4 w-4' />
        Enviar Relatório
      </Button>
    </div>
  );
}
