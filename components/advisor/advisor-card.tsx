import { ClipboardList, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserProfileDisplay from "../user-profile-display";

interface AdvisorCardProps {
  name: string;
  role: string;
}

export default function AdvisorCard({ name, role }: AdvisorCardProps) {
  return (
    <div className="w-full  flex justify-between items-center border rounded-lg p-2">
      <div className="w-auto flex gap-2 items-center">
        <UserProfileDisplay username={name} email={role} />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="text-[#999999] border border-[#D9D9D9]"
            variant={"outline"}
            size="icon"
          >
            <MoreVertical size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem>
            <ClipboardList className="mr-2 h-4 w-4" />
            Ver Detalhes
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
