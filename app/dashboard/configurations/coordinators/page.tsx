"use client";

import { CoordinatorFormDialog } from "@/components/coordinator/coordinator-form-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserProfileDisplay from "@/components/user-profile-display";
import {
  useActivateCoordinator,
  useCoordinators,
  useDeactivateCoordinator,
} from "@/hooks/coordinators/use-coordinators";
import { cn } from "@/lib/utils";
import {
  CircleUserRound,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageSkeleton } from "./page-skeleton";

export default function CoordinatorsPage() {
  const router = useRouter();
  const { data: coordinators = [], isLoading } = useCoordinators();
  const { mutate: deactivate } = useDeactivateCoordinator();
  const { mutate: activate } = useActivateCoordinator();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoordinator, setEditingCoordinator] = useState<any>(null);

  const handleToggleActive = (coordinator: any) => {
    if (coordinator.user.status === "active") {
      deactivate(coordinator.id);
    } else {
      activate(coordinator.id);
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Button
          onClick={() => {
            setEditingCoordinator(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Coordenador
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[300px]">Coordenador</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coordinators.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  Nenhum coordenador encontrado.
                </TableCell>
              </TableRow>
            ) : (
              coordinators.map((coordinator) => (
                <TableRow
                  key={coordinator.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-medium">
                    <UserProfileDisplay
                      username={coordinator.user.name}
                      email={coordinator.user.email}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {coordinator.user.email}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        coordinator.user.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200",
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full mr-1.5",
                          coordinator.user.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500",
                        )}
                      />
                      {coordinator.user.status === "active"
                        ? "Ativo"
                        : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/configurations/coordinators/${coordinator.id}`}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex gap-2 items-center">
                            <CircleUserRound className="h-4 w-4" />
                            <span>Estado</span>
                          </div>
                          <Switch
                            checked={coordinator.user.status === "active"}
                            onCheckedChange={() =>
                              handleToggleActive(coordinator)
                            }
                          />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setEditingCoordinator(coordinator);
                            setIsFormOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CoordinatorFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        coordinator={editingCoordinator}
      />
    </div>
  );
}
