import { create } from "zustand";

export type CourseType = "electronica" | "informatica";

interface CourseState {
  selectedCourse: CourseType;
  setSelectedCourse: (course: CourseType) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  selectedCourse: "electronica",
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));
