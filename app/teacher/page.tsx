import { PageHeader } from "@/components/PageScaffold";
import { TeacherFlow } from "@/components/TeacherFlow";

export default function TeacherPage() {
  return (
    <>
      <PageHeader
        eyebrow="Teacher · assignment builder"
        title="Create a tactile-ready assignment"
        titleKo="촉각 준비 과제 만들기"
        description="A Classroom add-on flow: set up the assignment, scan the material with Gemini, review the tactile layers, and publish — once the braille passes expert review."
        phase={1}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <TeacherFlow />
      </div>
    </>
  );
}
