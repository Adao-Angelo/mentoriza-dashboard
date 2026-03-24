"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import CreateStudentDialog from "@/app/dashboard/students/components/create-student-dialog";
import Dropzone from "@/components/dashboard/dropzone";
import GlobalLoader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useStudents } from "@/hooks/students/use-students";
import { useUploadStudentsCsv } from "@/hooks/students/use-upload-students-csv";

import {
  ArrowLeftIcon,
  ArrowRight,
  CloudUpload,
  FileSearch2,
  Loader2,
  Search,
  Upload,
  X,
} from "lucide-react";
import StudentsTable from "./students-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseStore } from "@/store/use-course.store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, { message: "Selecione pelo menos um ficheiro" })
    .max(1, { message: "Apenas um ficheiro por vez" }),
});

type CourseType = "electronica" | "informatica";

const COURSE_LABELS: Record<CourseType, string> = {
  electronica: "Eletrônica",
  informatica: "Informática",
};

const DEFAULT_COURSE: CourseType = "informatica";

function CourseTabs() {
  const { selectedCourse, setSelectedCourse } = useCourseStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const courseFromUrl = searchParams.get("course") as CourseType | null;

    let courseToUse: CourseType;

    if (courseFromUrl && Object.keys(COURSE_LABELS).includes(courseFromUrl)) {
      courseToUse = courseFromUrl;
    } else {
      courseToUse = DEFAULT_COURSE;

      router.replace(
        `${pathname}?${createQueryString("course", DEFAULT_COURSE)}`,
        { scroll: false },
      );
    }

    if (selectedCourse !== courseToUse) {
      setSelectedCourse(courseToUse);
    }
  }, [searchParams, pathname, router, setSelectedCourse, createQueryString]);

  const handleCourseChange = (value: string) => {
    const newCourse = value as CourseType;
    setSelectedCourse(newCourse);

    router.push(`${pathname}?${createQueryString("course", newCourse)}`, {
      scroll: false,
    });
  };

  return (
    <Tabs
      value={selectedCourse || DEFAULT_COURSE}
      onValueChange={handleCourseChange}
      className="w-fit"
    >
      <TabsList>
        {Object.entries(COURSE_LABELS).map(([value, label]) => (
          <TabsTrigger key={value} className="px-8" value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export default function StudentsPage() {
  const [showDropzone, setShowDropzone] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { selectedCourse } = useCourseStore();

  const { mutate: uploadCsv, isPending: isUploading } = useUploadStudentsCsv();

  const {
    data: students = [],
    isLoading,
    meta,
  } = useStudents({
    page: currentPage,
    perPage: pageSize,
    q: searchText,
    course: selectedCourse,
  });

  const totalPages = meta?.totalPages ?? 1;
  const totalCount = meta?.total ?? 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCourse]);

  async function onSubmit() {
    if (files.length === 0) {
      toast.error("Selecione pelo menos um ficheiro CSV");
      return;
    }

    uploadCsv(files[0], {
      onSuccess: () => {
        setFiles([]);
        setShowDropzone(false);
        form.reset();
      },
    });
  }

  return (
    <div className="container">
      <div className="space-y-8">
        <div className="">
          {showDropzone && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start justify-between mb-4">
                        <FormLabel className="mt-0 font-semibold text-[16px]">
                          Carregar Estudantes
                        </FormLabel>
                        <button
                          onClick={() => setShowDropzone(false)}
                          className="rounded-full p-1.5 hover:bg-muted transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <FormControl>
                        <Dropzone
                          files={field.value || []}
                          setFiles={(newFiles) => {
                            field.onChange(newFiles);
                            setFiles(newFiles);
                          }}
                          maxFiles={1}
                          title="Selecione o ficheiro CSV"
                          description="nome, email, curso, turma..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isUploading || files.length === 0}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Enviar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {!showDropzone && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <CourseTabs />

                <div className="flex gap-3">
                  <Button onClick={() => setShowDropzone(true)}>
                    <Upload /> Upload CSV
                  </Button>

                  <CreateStudentDialog />
                </div>
              </div>

              <div className="mt-4 bg-white p-4 rounded-xl">
                <p>Pesquisar</p>
                <div className="flex gap-2">
                  <Input
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Buscar estudante..."
                  />
                  <Button>
                    <Search /> Buscar
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <GlobalLoader variant="mini" />
                </div>
              ) : students.length === 0 ? (
                <EmptyUploadState onReopen={() => setShowDropzone(true)} />
              ) : (
                <>
                  <StudentsTable students={students} />

                  <div className="flex justify-between mt-4">
                    <span>
                      Página {currentPage} de {totalPages}
                    </span>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                      >
                        <ArrowLeftIcon /> Anterior
                      </Button>

                      <Button
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                      >
                        Próxima <ArrowRight />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyUploadState({ onReopen }: { onReopen: () => void }) {
  return (
    <div className="flex flex-col items-center py-10">
      <FileSearch2 className="h-12 w-12 mb-4" />
      <p>Nenhum estudante encontrado</p>

      <Button className="mt-4" onClick={onReopen}>
        <CloudUpload /> Carregar CSV
      </Button>
    </div>
  );
}
