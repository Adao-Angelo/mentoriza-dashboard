'use client';

import { Can } from '@/components/rbac/can';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PERMISSIONS } from '@/context/permissions';
import { useCourseStore } from '@/store/use-course.store';
import { ArrowUpFromLine, FileUp, Plus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import CreateGroupModal from '../group/create-group-modal';

type CourseType = 'electronica' | 'informatica';

const COURSE_LABELS: Record<CourseType, string> = {
  electronica: 'Eletrônica',
  informatica: 'Informática',
};

const DEFAULT_COURSE: CourseType = 'informatica';

import { usePTTeachers } from '@/hooks/pt-teachers/use-pt-teachers';
import { useAuthStore } from '@/store/use-auth.store';

function CourseTabs() {
  const { selectedCourse, setSelectedCourse } = useCourseStore();
  const { user } = useAuthStore();
  const { data: ptTeachers = [] } = usePTTeachers();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isCoordinator = user?.roles.some((r) =>
    ['ADMIN', 'COORDINATOR'].includes(r)
  );
  const ptProfile = ptTeachers.find((t) => t.user.name === user?.username);
  const teacherCourse = ptProfile?.course as CourseType;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const courseFromUrl = searchParams.get('course') as CourseType | null;

    let courseToUse: CourseType;

    if (!isCoordinator && teacherCourse) {
      courseToUse = teacherCourse;
    } else if (
      courseFromUrl &&
      Object.keys(COURSE_LABELS).includes(courseFromUrl)
    ) {
      courseToUse = courseFromUrl;
    } else {
      courseToUse = DEFAULT_COURSE;
    }

    if (selectedCourse !== courseToUse) {
      setSelectedCourse(courseToUse);
      router.replace(
        `${pathname}?${createQueryString('course', courseToUse)}`,
        { scroll: false }
      );
    }
  }, [
    selectedCourse,
    searchParams,
    pathname,
    router,
    setSelectedCourse,
    createQueryString,
    isCoordinator,
    teacherCourse,
  ]);

  const handleCourseChange = (value: string) => {
    const newCourse = value as CourseType;
    setSelectedCourse(newCourse);

    router.push(`${pathname}?${createQueryString('course', newCourse)}`, {
      scroll: false,
    });
  };

  if (!isCoordinator && teacherCourse) {
    return (
      <div className='bg-muted/50 px-6 py-2 rounded-lg border'>
        <span className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
          Curso de {COURSE_LABELS[teacherCourse]}
        </span>
      </div>
    );
  }

  return (
    <Tabs
      value={selectedCourse || DEFAULT_COURSE}
      onValueChange={handleCourseChange}
      className='w-fit'
    >
      <TabsList>
        {Object.entries(COURSE_LABELS).map(([value, label]) => (
          <TabsTrigger key={value} className='px-8' value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
function ActionButtons({ onCreateGroup }: { onCreateGroup: () => void }) {
  return (
    <div className='flex items-center gap-2'>
      <Can permission={PERMISSIONS.GROUP_CREATE}>
        <Button onClick={onCreateGroup}>
          Adicionar
          <Plus className='ml-2 h-4 w-4' />
        </Button>
      </Can>
      <Can permission={PERMISSIONS.GROUP_PUBLISH}>
        <Button>
          Publicar
          <ArrowUpFromLine className='ml-2 h-4 w-4' />
        </Button>
      </Can>

      <Can permission={PERMISSIONS.GROUP_UPDATE}>
        <Button>
          Importar
          <FileUp className='ml-2 h-4 w-4' />
        </Button>
      </Can>
    </div>
  );
}

export default function GroupHeader() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <header className='flex w-full items-center justify-between mt-2 h-12'>
        <div className='flex items-center gap-3'>
          <CourseTabs />
        </div>

        <ActionButtons onCreateGroup={() => setIsCreateModalOpen(true)} />
      </header>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}
