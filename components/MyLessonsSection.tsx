"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  listCustomLessons,
  subscribeCustomLessons,
  deleteCustomLesson,
  toPlayableLesson,
  type CustomLesson,
} from "@/lib/customLessons";
import { renderScene } from "@/lib/tactileScene";
import { TactileGrid } from "@/components/TactileGrid";
import { LessonExplorer } from "@/components/LessonExplorer";
import { StatusBadge } from "@/components/StatusBadge";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const EDIT_KEY = "dotlens.builder.editId";

export function MyLessonsSection() {
  const { lang } = useLang();
  const router = useRouter();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);

  const [lessons, setLessons] = useState<CustomLesson[]>([]);
  const [exploreId, setExploreId] = useState<string | null>(null);

  useEffect(() => {
    setLessons(listCustomLessons());
    return subscribeCustomLessons(() => setLessons(listCustomLessons()));
  }, []);

  function edit(id: string) {
    try {
      window.sessionStorage.setItem(EDIT_KEY, id);
    } catch {
      /* ignore */
    }
    router.push("/builder");
  }

  function remove(id: string) {
    const ok = window.confirm(L("Delete this lesson? This cannot be undone.", "이 수업을 삭제할까요? 되돌릴 수 없습니다."));
    if (!ok) return;
    deleteCustomLesson(id);
    if (exploreId === id) setExploreId(null);
  }

  const exploring = useMemo(
    () => (exploreId ? lessons.find((l) => l.id === exploreId) ?? null : null),
    [exploreId, lessons]
  );

  return (
    <section className="mb-10 rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{L("Made by you", "내가 만든 자료")}</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">
            {L("My tactile lessons", "내 촉각 수업")}
            <span className="ml-2 font-mono text-[12px] font-normal text-faint">
              {L(`${lessons.length} saved`, `${lessons.length}개 저장됨`)}
            </span>
          </h2>
        </div>
        <Link
          href="/builder"
          className="rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-soft"
        >
          + {L("Build a new lesson", "새 수업 만들기")}
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-surface-sunk p-6 text-center">
          <p className="text-[14px] font-medium text-ink">{L("No custom lessons yet", "아직 만든 수업이 없습니다")}</p>
          <p className="mx-auto mt-1 max-w-md text-[13px] text-muted">
            {L(
              "Build a tactile version of your own material — start from a template, shape each object, and it appears here ready to explore on the Dot Pad.",
              "내 자료의 촉각 버전을 만들어 보세요 — 템플릿에서 시작해 객체를 다듬으면 여기에 나타나 Dot Pad에서 바로 탐색할 수 있습니다."
            )}
          </p>
          <Link
            href="/builder"
            className="mt-3 inline-block rounded-xl border border-accent bg-surface px-4 py-2 text-[13.5px] font-semibold text-accent hover:bg-accent-tint"
          >
            {L("Open the Tactile Builder →", "촉각 빌더 열기 →")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              lang={lang}
              active={exploreId === lesson.id}
              onExplore={() => setExploreId((id) => (id === lesson.id ? null : lesson.id))}
              onEdit={() => edit(lesson.id)}
              onDelete={() => remove(lesson.id)}
            />
          ))}
        </div>
      )}

      {exploring && (
        <div className="mt-5">
          <p className="mb-2 eyebrow">
            {L("Exploring", "탐색 중")}: {L(exploring.title.en, exploring.title.ko)}
          </p>
          <LessonExplorer key={exploring.id} lesson={toPlayableLesson(exploring)} />
        </div>
      )}
    </section>
  );
}

function LessonCard({
  lesson,
  lang,
  active,
  onExplore,
  onEdit,
  onDelete,
}: {
  lesson: CustomLesson;
  lang: "en" | "ko";
  active: boolean;
  onExplore: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const overview = useMemo(
    () =>
      renderScene({
        id: `${lesson.id}-ov`,
        title: lesson.title,
        type: "process",
        primitives: lesson.objects.flatMap((o) => o.primitives),
      }),
    [lesson]
  );

  return (
    <article className={cn("flex flex-col rounded-2xl border bg-surface transition-shadow", active ? "border-accent shadow-glow" : "border-line shadow-card")}>
      <div className="overflow-hidden rounded-t-2xl">
        <TactileGrid matrix={overview} objectName={L(lesson.title.en, lesson.title.ko)} className="max-h-[110px]" />
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
            {L(lesson.subject.en, lesson.subject.ko)} · {L(lesson.gradeLevel.en, lesson.gradeLevel.ko)}
          </p>
          <StatusBadge variant={lesson.status === "ready" ? "verified" : "draft"}>
            {lesson.status === "ready" ? L("ready", "준비됨") : L("draft", "초안")}
          </StatusBadge>
        </div>
        <h3 className="mt-1 text-[15px] font-semibold text-ink">{L(lesson.title.en, lesson.title.ko)}</h3>
        <p className="mt-0.5 font-mono text-[11px] text-faint">
          {L(`${lesson.objects.length} objects · ${lesson.quiz.length} questions`, `객체 ${lesson.objects.length}개 · 질문 ${lesson.quiz.length}개`)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExplore}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
              active ? "bg-accent text-white" : "bg-accent-tint text-accent hover:bg-accent hover:text-white"
            )}
          >
            {active ? L("Close", "닫기") : L("Explore ▶", "탐색 ▶")}
          </button>
          <button type="button" onClick={onEdit} className="rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink hover:bg-surface-sunk">
            {L("Edit", "편집")}
          </button>
          <button type="button" onClick={onDelete} className="rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-semibold text-[#B23B2E] hover:bg-[#FBE3DD]">
            {L("Delete", "삭제")}
          </button>
        </div>
      </div>
    </article>
  );
}
