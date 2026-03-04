import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteGroup } from "@/hooks/groups/useDeleteGroup";
import { Group } from "@/services/groups/Interfaces";
import { ClipboardList, MoreVertical, Trash2 } from "lucide-react";

interface GroupHeaderProps {
  groupName: string;
  description: string;
  group: Group;
}

export default function GroupHeader({
  groupName,
  description,
  group,
}: GroupHeaderProps) {
  const { mutate: deleteGroupMutation } = useDeleteGroup();
  return (
    <div className="w-full flex justify-between p-3 border-b">
      <div className="flex flex-col">
        <div className="w-fit rounded-full mb-1">
          <h2 className="font-bold text-sm text-center">{groupName}</h2>
        </div>
        <p className="text-xs text-Gray">{description}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="text-[#999999] border border-[#D9D9D9] rounded-[12px] px-1"
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

          <DropdownMenuItem
            onClick={() => {
              deleteGroupMutation(group.id);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
