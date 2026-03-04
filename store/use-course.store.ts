import { create } from "zustand";

export type CourseType = "engenharia_electronica" | "engenharia_informatica";

interface CourseState {
  selectedCourse: CourseType;
  setSelectedCourse: (course: CourseType) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  selectedCourse: "engenharia_electronica",
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));
