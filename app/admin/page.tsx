import { PageHeader, ComingNext } from "@/components/PageScaffold";

const CONTROLS = [
  {
    title: "Per-OU enablement",
    body: "Disabled by default until an admin enables it for an organizational unit.",
  },
  {
    title: "Gemini analysis",
    body: "Admins control whether visual analysis runs, and in which data region.",
  },
  {
    title: "Data minimization",
    body: "Only the specific image or region needed is sent — no broad page scraping.",
  },
  {
    title: "Retention",
    body: "Tactile packages and session logs follow the school's policy window, then purge.",
  },
];

export default function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin · controls"
        title="Privacy and admin controls"
        titleKo="개인정보 및 관리자 제어"
        description="Assumptions for deployment on managed Chromebooks. Wiring connects in a later phase."
        phase={4}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {CONTROLS.map((c) => (
            <article
              key={c.title}
              className="rounded-2xl border border-line bg-surface p-5 shadow-card"
            >
              <h2 className="text-[15px] font-semibold text-ink">{c.title}</h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                {c.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6">
          <ComingNext
            points={[
              "Scope review and minimized OAuth justifications.",
              "Data-region selector and retention window controls.",
              "Audit log of what was sent for analysis.",
            ]}
          />
        </div>
      </div>
    </>
  );
}
