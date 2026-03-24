import { useUnlinkAdvisor } from "@/hooks/groups/useUnlinkAdvisor";
import { useUnlinkCoAdvisor } from "@/hooks/groups/useUnlinkCoAdvisor";
import { useConfirm } from "@/hooks/use-confirm";
import { Group } from "@/services/groups/Interfaces";
import { Eye, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";
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
  advisorId?: number;
  group?: Group;
  isCoAdvisor?: boolean;
}

export default function AdvisorCard({
  name,
  role,
  advisorId,
  group,
  isCoAdvisor = false,
}: AdvisorCardProps) {
  const { mutate: unlinkAdvisor } = useUnlinkAdvisor({
    groupId: group?.id || 0,
  });
  const { mutate: unlinkCoAdvisor } = useUnlinkCoAdvisor({
    groupId: group?.id || 0,
  });

  const confirm = useConfirm();

  const handleUnlink = async () => {
    if (isCoAdvisor) {
      const confirmation = await confirm({
        title: "Remover Co-orientador",
        message: `Tem certeza que deseja remover ${name} como co-orientador do grupo?`,
      });
      if (confirmation) {
        unlinkCoAdvisor();
      }
    } else {
      const confirmation = await confirm({
        title: "Remover Orientador",
        message: `Tem certeza que deseja remover ${name} como Orientador do grupo?`,
      });
      if (confirmation) {
        unlinkAdvisor();
      }
    }
  };

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
          {advisorId && (
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/mentors/${advisorId}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Link>
            </DropdownMenuItem>
          )}
          {advisorId && (
            <DropdownMenuItem
              className="text-destructive hover:text-destructive"
              onClick={handleUnlink}
            >
              <Trash className="mr-2 h-4 w-4 text-destructive" />
              Remover
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
