"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteIndicator } from "@/hooks/indicators/use-delete-indicator";
import { useConfirm } from "@/hooks/use-confirm";
import type { Indicator } from "@/services/indicator/Interfaces";
import { IndicatorFormDialog } from "./indicator-form-dialog";

interface IndicatorCardProps {
  indicator: Indicator;
}

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { mutate: remove } = useDeleteIndicator();
  const confirm = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Remover Indicador",
      message: `Tem certeza que deseja remover "${indicator.title}"? Esta ação não pode ser desfeita.`,
      confirmText: "Remover",
      cancelText: "Cancelar",
    });

    if (confirmed) {
      remove(indicator.id);
    }
  };

  return (
    <>
      <div className="border rounded-lg p-3 hover:border-primary transition-shadow bg-card relative">
        <div className="flex justify-between items-start mb-3">
          <div></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-color-stroke text-Gray"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="text-[12px] h-10 overflow-hidden text-clip">
          {indicator.title}
        </h3>
        <div className="flex item-end justify-between mt-6">
          <p className="text-xl font-bold text-primary ">{indicator.value}%</p>
          <div className="flex">
            <p className="text-[12px] text-primary text-right bg-purple-100 rounded-full w-fit h-fit p-1 px-2">
              <strong>{indicator.type === "MAX" ? "Máximo" : "Mínimo"}</strong>
            </p>
          </div>
        </div>
      </div>

      <IndicatorFormDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        indicator={indicator}
      />
    </>
  );
}
