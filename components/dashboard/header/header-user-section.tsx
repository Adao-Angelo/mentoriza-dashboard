"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/use-auth.store";
import { removeToken } from "@/utils/remove-token";
import { getInitials } from "initials-extractor";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  coordinator: "Coordenador",
  advisor: "Orientador",
  teacher: "Professor",
  student: "Estudante",
};

export default function HeaderUserSection() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    removeToken();
    router.push("/login");
  };

  const role = user?.roles?.[0]?.toLowerCase() ?? "";
  const roleLabel = ROLE_LABELS[role] ?? "Utilizador";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted">
            <h1 className="text-sm font-semibold text-foreground">
              {getInitials(user?.username ?? "A")}
            </h1>
          </div>

          <div className="hidden md:flex flex-col items-start">
            <p className="text-sm font-semibold text-foreground">
              {user?.username}
            </p>

            <Badge>{roleLabel}</Badge>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
