"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseStore } from "@/store/use-course.store";
import { ArrowUpFromLine, FileUp, Plus } from "lucide-react";

export default function GroupHeader() {
  const { selectedCourse, setSelectedCourse } = useCourseStore();

  return (
    <div className="w-full h-12 flex justify-between items-center mt-2">
      <div className="flex items-center justify-center gap-2">
        <Tabs
          value={selectedCourse}
          onValueChange={(value) =>
            setSelectedCourse(
              value as "engenharia_electronica" | "engenharia_informatica",
            )
          }
          className="w-fit"
        >
          <TabsList>
            <TabsTrigger className="px-8" value="engenharia_electronica">
              Electronica
            </TabsTrigger>
            <TabsTrigger className="px-8" value="engenharia_informatica">
              Informática
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-auto flex items-center justify-center gap-2">
        <Button>
          Adicionar
          <Plus />
        </Button>

        <Button>
          Publish
          <ArrowUpFromLine />
        </Button>

        <Button variant={"outline"}>Assign Mentors</Button>

        <Button variant={"outline"}>
          Export
          <FileUp />
        </Button>
      </div>
    </div>
  );
}
