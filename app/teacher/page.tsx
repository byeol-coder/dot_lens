import { CustomTactileBuilder } from "@/components/CustomTactileBuilder";
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
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <CustomTactileBuilder />
        <section aria-labelledby="guided-sample-flow" className="space-y-4">
          <div>
            <p className="eyebrow">Guided sample conversion</p>
            <h2 id="guided-sample-flow" className="mt-1 text-xl font-semibold text-ink">
              Practice the full Dot Lens workflow
            </h2>
          </div>
          <TeacherFlow />
        </section>
      </div>
    </>
  );
}
