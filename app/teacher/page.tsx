import { TeacherFlow } from "@/components/TeacherFlow";
import { TeacherPageHeader } from "@/components/TeacherPageHeader";

export const metadata = {
  title: "Create Lesson | Dot Lens",
  description: "Create AI-powered tactile lesson materials students can explore by touch.",
};

export default function TeacherPage() {
  return (
    <>
      <TeacherPageHeader />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <TeacherFlow />
      </div>
    </>
  );
}
