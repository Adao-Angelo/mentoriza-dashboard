// src/components/indicators/IndicatorFormDialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateIndicator } from "@/hooks/indicators/use-create-indicator";
import { useUpdateIndicator } from "@/hooks/indicators/use-update-indicator";
import {
  CreateIndicatorDto,
  Indicator,
  UpdateIndicatorDto,
} from "@/services/indicator/Interfaces";
import GlobalLoader from "../loader";

const indicatorSchema = z.object({
  title: z
    .string()
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  value: z
    .number()
    .min(0)
    .max(100, { message: "O valor deve estar entre 0 e 100" }),
  type: z.enum(["MIN", "MAX"], { message: "Selecione min ou max" }),
});

type IndicatorFormValues = z.infer<typeof indicatorSchema>;

interface IndicatorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator?: Indicator | null;
}

export function IndicatorFormDialog({
  open,
  onOpenChange,
  indicator,
}: IndicatorFormDialogProps) {
  const isEdit = !!indicator;
  const { mutate: create, isPending: isCreating } = useCreateIndicator();
  const { mutate: update, isPending: isUpdating } = useUpdateIndicator();

  const form = useForm<IndicatorFormValues>({
    resolver: zodResolver(indicatorSchema),
    defaultValues: {
      title: indicator?.title || "",
      value: indicator?.value || 0,
      type: indicator?.type || "MAX",
    },
  });

  function onSubmit(values: IndicatorFormValues) {
    if (isEdit && indicator) {
      update(
        { id: indicator.id, data: values as UpdateIndicatorDto },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        },
      );
    } else {
      create(values as CreateIndicatorDto, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    }
  }

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Indicador" : "Novo Indicador"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Altere os dados do indicador abaixo."
              : "Preencha os dados para criar um novo indicador."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              disabled
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nível máximo de IA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="75"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MAX">Máximo</SelectItem>
                      <SelectItem value="MIN">Mínimo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <GlobalLoader variant="white-mini" />}
                {isEdit ? "Guardar Alterações" : "Criar Indicador"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
