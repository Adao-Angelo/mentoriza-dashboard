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
    [searchParams]
  );

  useEffect(() => {
    const courseFromUrl = searchParams.get('course') as CourseType | null;

    let courseToUse: CourseType;

    if (courseFromUrl && Object.keys(COURSE_LABELS).includes(courseFromUrl)) {
      courseToUse = courseFromUrl;
    } else {
      courseToUse = DEFAULT_COURSE;

      router.replace(
        `${pathname}?${createQueryString('course', DEFAULT_COURSE)}`,
        { scroll: false }
      );
    }

    if (selectedCourse !== courseToUse) {
      setSelectedCourse(courseToUse);
    }
  }, [
    selectedCourse,
    searchParams,
    pathname,
    router,
    setSelectedCourse,
    createQueryString,
  ]);

  const handleCourseChange = (value: string) => {
    const newCourse = value as CourseType;
    setSelectedCourse(newCourse);

    router.push(`${pathname}?${createQueryString('course', newCourse)}`, {
      scroll: false,
    });
  };

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
