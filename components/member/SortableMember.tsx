"use client";

import { Student } from "@/services/students/Interfaces";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MemberCard from "./member-card";

type SortableMemberProps = {
  id: string;
  student: Student;
};

export default function SortableMember({ id, student }: SortableMemberProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MemberCard
        studentId={student?.id}
        name={student?.user?.name ?? ""}
        email={student?.user?.email ?? ""}
      />
    </div>
  );
}
