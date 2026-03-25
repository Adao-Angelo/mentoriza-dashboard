/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudents } from "@/hooks/students/use-students";
import { useUploadStudentsCsv } from "@/hooks/students/use-upload-students-csv";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseStore } from "@/store/use-course.store";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import StudentsTable from "./students-table";

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
  }, [
    searchParams,
    pathname,
    router,
    setSelectedCourse,
    createQueryString,
    selectedCourse,
  ]);

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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { selectedCourse } = useCourseStore();

  const { mutate: uploadCsv, isPending: isUploading } = useUploadStudentsCsv();

  const prevCourseRef = useRef(selectedCourse);

  useEffect(() => {
    if (prevCourseRef.current !== selectedCourse) {
      setCurrentPage(1);
      prevCourseRef.current = selectedCourse;
    }
  }, [selectedCourse]);

  const {
    data: students = [],
    isLoading,
    meta,
  } = useStudents({
    page: currentPage,
    perPage: pageSize,
    q: searchText,
    status: statusFilter === "all" ? undefined : statusFilter,
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
                          aria-label="Fechar upload"
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
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
                          description="O arquivo deve conter: nome, email, curso, turma, telefone, RA, data de nascimento"
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />A
                        processar...
                      </>
                    ) : (
                      <>
                        Enviar ficheiro
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CourseTabs />
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="default"
                    size={"lg"}
                    onClick={() => setShowDropzone(true)}
                  >
                    <Upload />
                    Upload CSV
                  </Button>

                  <CreateStudentDialog />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between bg-white p-4 rounded-xl">
                <div className="w-full">
                  <p>Pesquisar</p>
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      className="border-none px-0"
                      value={searchText}
                      onChange={(event) => {
                        setSearchText(event.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Buscar por nome, email, RA, curso ou turma"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value as "all" | "active" | "inactive");
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-50 h-11!" size="default">
                      <SelectValue>
                        {statusFilter === "all"
                          ? "Todos"
                          : statusFilter === "active"
                            ? "Ativos"
                            : "Inativos"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-50">
                    <Search /> Buscar{" "}
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground flex justify-center">
                  <GlobalLoader variant="mini" />
                </div>
              ) : students.length === 0 ? (
                <div className="">
                  <EmptyUploadState onReopen={() => setShowDropzone(true)} />
                </div>
              ) : (
                <>
                  <StudentsTable students={students} />
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Exibindo {students.length} de {totalCount} estudante(s)
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage <= 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                      >
                        <ArrowLeftIcon /> Anterior
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage >= totalPages}
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1),
                          )
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
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <FileSearch2
        strokeWidth={1.5}
        className="h-12 w-12 text-muted-foreground mb-4"
      />
      <h3 className="text-[14px] font-medium">Nenhum upload ativo</h3>
      <p className="text-[12px] text-muted-foreground mt-1 max-w-md">
        Clique no botão abaixo para abrir o carregador de arquivos CSV.
      </p>
      <Button className="mt-6 gap-2 w-50" onClick={onReopen}>
        <CloudUpload className="h-4 w-4" />
        Carregar ficheiro
      </Button>
    </div>
  );
}
