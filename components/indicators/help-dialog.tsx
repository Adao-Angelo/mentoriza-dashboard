"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>O que é um Indicador?</DialogTitle>
          <DialogDescription>
            Um indicador é um critério usado para avaliar relatórios ou
            trabalhos. Ele funciona como uma nota ou métrica que a plataforma
            usa para dar feedback automático sobre a qualidade do conteúdo
            enviado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Por exemplo, você pode ter um indicador de{" "}
            <strong> Percentagem de IA </strong> que mostra quanto do relatório
            foi gerado por inteligência artificial.
          </p>
          <p>
            Cada indicador ajuda você a entender melhor a performance dos
            relatórios.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Dica: utilize indicadores para acompanhar métricas importantes em
            seus documentos.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
