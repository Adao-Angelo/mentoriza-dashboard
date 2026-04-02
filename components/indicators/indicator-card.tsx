"use client";

import { MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { PERMISSIONS } from "@/context/permissions";
import { useUpdateIndicator } from "@/hooks/indicators/use-update-indicator";
import type { Indicator } from "@/services/indicator/Interfaces";
import { Can } from "../rbac/can";
import { IndicatorFormDialog } from "./indicator-form-dialog";

interface IndicatorCardProps {
  indicator: Indicator;
}

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { mutate: update, isPending: isUpdating } = useUpdateIndicator();

  const handleToggleActive = () => {
    update({
      id: indicator.id,
      data: { isActive: !indicator.isActive },
    });
  };

  return (
    <>
      <div className="border rounded-lg p-3  transition-shadow bg-card relative">
        <div className="flex justify-between items-start mb-3">
          <Badge variant={indicator.isActive ? "success" : "error"}>
            {indicator.isActive ? "Ativo" : "Inativo"}
          </Badge>

          <DropdownMenu>
            <Can permission={PERMISSIONS.STUDENT_LINK_GROUP}>
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
            </Can>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-default"
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <span className="text-sm">
                    {indicator.isActive ? "Ativo" : "Inativo"}
                  </span>
                  <Switch
                    checked={indicator.isActive}
                    onCheckedChange={handleToggleActive}
                    disabled={isUpdating}
                  />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="text-[16px] mb-3 overflow-hidden text-clip font-semibold">
          {indicator.title}
        </h3>
        <p className="text-Gray text-sm">{indicator.description}</p>
        <div className="flex item-end justify-between mt-6">
          <p className="text-xl font-bold text-primary ">{indicator.value}%</p>
          <div className="flex">
            <p className="text-[12px] text-primary text-right bg-purple-100 rounded-full w-fit h-fit p-1 px-2 flex gap-2">
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
