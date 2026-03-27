"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateGroup } from "@/hooks/groups/useUpdateGroup";
import { Group } from "@/services/groups/Interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  course: z.string().min(1, { message: "Curso é obrigatório" }),
  title: z.string().optional(),
  description: z.string().optional(),
  information: z.string().optional(),
});

type EditGroupFormData = z.infer<typeof formSchema>;

interface EditGroupModalProps {
  group: Group;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditGroupModal({
  group,
  isOpen,
  onOpenChange,
}: EditGroupModalProps) {
  const { mutate: updateGroup, isPending } = useUpdateGroup();

  const form = useForm<EditGroupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: group.name,
      course: group.course,
      title: group.title || "",
      description: group.description || "",
      information: group.information || "",
    },
  });

  const onSubmit = (data: EditGroupFormData) => {
    updateGroup(
      { id: group.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Grupo</DialogTitle>
          <DialogDescription>
            Atualize as informações do grupo abaixo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do grupo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-12!">
                        <SelectValue placeholder="Selecione curso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        <SelectItem value="informatica">Informática</SelectItem>
                        <SelectItem value="electronica">Eletrônica</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tema (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Tema ou título do projeto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição do projeto ou grupo"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="information"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informação (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informação adicional sobre o grupo"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Atualizar Informações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
