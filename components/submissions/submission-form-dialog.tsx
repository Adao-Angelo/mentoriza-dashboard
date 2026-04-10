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
import { format } from "date-fns";
import { CalendarDays, Loader2 } from "lucide-react";

import { useCreateSubmission } from "@/hooks/submissions/use-create-submission";
import { useUpdateSubmission } from "@/hooks/submissions/use-update-submission";
import {
  CreateSubmissionDto,
  Submission,
  UpdateSubmissionDto,
} from "@/services/submission/Interfaces";

const submissionSchema = z.object({
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida" }),
  stage: z.number().min(1, { message: "Etapa deve ser pelo menos 1" }),
  phaseId: z.number().optional(),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

const toDateTimeLocal = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

interface SubmissionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission?: Submission | null;
}

export function SubmissionFormDialog({
  open,
  onOpenChange,
  submission,
}: SubmissionFormDialogProps) {
  const isEdit = !!submission;
  const { mutate: create, isPending: isCreating } = useCreateSubmission();
  const { mutate: update, isPending: isUpdating } = useUpdateSubmission();

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      endDate:
        toDateTimeLocal(submission?.endDate) ||
        toDateTimeLocal(new Date().toISOString()),
      stage: submission?.stage || 1,
      phaseId: submission?.phaseId,
    },
  });

  function onSubmit(values: SubmissionFormValues) {
    if (isEdit && submission) {
      update({ id: submission.id, data: values as UpdateSubmissionDto });
    } else {
      create(values as CreateSubmissionDto);
    }
    onOpenChange(false);
  }

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Submissão" : "Nova Submissão"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize os detalhes da submissão."
              : "Crie uma nova submissão."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e hora de término</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      leftIcon={
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      }
                      {...field}
                      value={field.value ? toDateTimeLocal(field.value) : ""}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etapa (Número)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Atualizar" : "Criar Nova submissão"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
