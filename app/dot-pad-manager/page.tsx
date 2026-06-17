import { PageHeader } from "@/components/PageScaffold";
import { DotPadManager } from "@/components/DotPadManager";

export const metadata = {
  title: "Dot Pad Manager | Dot Lens",
  description: "Connect and manage up to 5 Dot Pads for classroom and demo use.",
};

export default function DotPadManagerPage() {
  return (
    <>
      <PageHeader
        eyebrow="More · Dot Pad Manager"
        eyebrowKo="더보기 · Dot Pad 관리"
        title="Manage up to 5 Dot Pads"
        titleKo="최대 5대 Dot Pad 관리"
        description="Connect, assign, sync, and monitor multiple Dot Pads at once — or simulate a classroom set so a demo runs with no hardware."
        descriptionKo="여러 대의 Dot Pad를 한 번에 연결·배정·동기화·모니터링하거나, 교실 세트를 시뮬레이션해 기기 없이도 시연할 수 있습니다."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <DotPadManager />
      </div>
    </>
  );
}
