"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  listPacks,
  getPack,
  savePack,
  deletePack,
  subscribePacks,
  validatePack,
  translateWithPack,
  packTemplate,
  type LanguagePack,
} from "@/lib/languagePacks";
import { logEvent } from "@/lib/telemetry";
import { BrailleCellsView } from "@/components/BrailleCellsView";
import { StatusBadge } from "@/components/StatusBadge";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const SAMPLES: Record<string, string> = { mr: "मराठी", default: "अआइ" };

export function LocalizationPanel() {
  const { lang } = useLang();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);

  const [packs, setPacks] = useState<LanguagePack[]>([]);
  const [code, setCode] = useState<string>("mr");
  const [sample, setSample] = useState<string>(SAMPLES.mr);
  const [showRules, setShowRules] = useState(false);
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPacks(listPacks());
    return subscribePacks(() => setPacks(listPacks()));
  }, []);

  const pack = useMemo(() => getPack(code) ?? packs[0], [code, packs]);

  const result = useMemo(() => (pack ? translateWithPack(sample, pack) : null), [pack, sample]);

  function applyImport(text: string) {
    try {
      const parsed = JSON.parse(text);
      const v = validatePack(parsed);
      if (!v.ok || !v.pack) {
        setImportMsg({ ok: false, text: v.errors.join(" ") });
        return;
      }
      savePack(v.pack);
      setCode(v.pack.code);
      setImportText("");
      setImportMsg({ ok: true, text: L(`Imported "${v.pack.name.en}" (${v.pack.code}).`, `"${v.pack.name.en}" (${v.pack.code}) 가져옴.`) });
      logEvent("pack_uploaded", { code: v.pack.code, entries: Object.keys(v.pack.map).length });
    } catch {
      setImportMsg({ ok: false, text: L("Invalid JSON.", "잘못된 JSON입니다.") });
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(applyImport);
    e.target.value = "";
  }

  function download(obj: unknown, filename: string) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
      <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
        {L("Localization packs", "현지화 팩")}
      </p>
      <h2 className="mt-1 text-[17px] font-semibold text-ink">
        {L("Languages, braille rules & tuning", "언어·점자 규칙·튜닝")}
      </h2>
      <p className="mt-1 text-[13px] text-muted">
        {L(
          "Add a language as a data pack — a character-to-braille map plus UI strings. Test it here, then a braille reviewer approves it. Marathi (Bharati Braille) ships built-in.",
          "언어를 데이터 팩으로 추가하세요 — 문자→점자 매핑과 UI 문자열로 구성됩니다. 여기서 테스트한 뒤 점자 검수자가 승인합니다. 마라티어(Bharati 점자)는 기본 내장입니다."
        )}
      </p>

      {/* Pack selector */}
      <div className="mt-4 flex flex-wrap gap-2">
        {packs.map((p) => (
          <button
            key={p.code}
            type="button"
            onClick={() => { setCode(p.code); setSample(SAMPLES[p.code] ?? SAMPLES.default); setImportMsg(null); }}
            aria-pressed={pack?.code === p.code}
            className={cn(
              "rounded-xl border px-3 py-1.5 text-[13px] transition-colors",
              pack?.code === p.code ? "border-accent bg-accent-tint text-accent" : "border-line hover:bg-surface-sunk"
            )}
          >
            {p.name.native || p.name.en} <span className="font-mono text-[10px] text-faint">{p.code}</span>
          </button>
        ))}
      </div>

      {pack && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-ink">{pack.name.en}</span>
            <span className="font-mono text-[12px] text-faint">{pack.script} · {pack.brailleStandard}</span>
            <StatusBadge variant={pack.status === "approved" ? "verified" : "pending"}>
              {pack.status === "approved" ? L("approved", "승인됨") : L("draft — needs review", "초안 — 검수 필요")}
            </StatusBadge>
            {pack.builtin && <StatusBadge variant="review">{L("built-in", "내장")}</StatusBadge>}
            <span className="ml-auto font-mono text-[11px] text-faint">
              {L(`${Object.keys(pack.map).length} characters mapped`, `${Object.keys(pack.map).length}자 매핑됨`)}
            </span>
          </div>

          {/* Tester */}
          <div>
            <label className="mb-1 block font-mono text-[11px] uppercase tracking-eyebrow text-faint">
              {L("Test text → braille", "테스트 문구 → 점자")}
            </label>
            <input
              value={sample}
              onChange={(e) => setSample(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-[15px] text-ink"
              dir="auto"
            />
          </div>
          {result && (
            <>
              <BrailleCellsView cells={result.cells} text={sample} />
              {result.untranslatable.length > 0 && (
                <div className="rounded-xl border border-[#EBD9B6] bg-[#FBF3E2] px-4 py-2.5 text-[12.5px] text-warn">
                  {L("Unmapped (needs a reviewer): ", "매핑 안 됨 (검수 필요): ")}
                  <span className="font-semibold">{result.untranslatable.map((u) => u.char).join(" ")}</span>
                </div>
              )}
            </>
          )}

          {/* Rules table */}
          <div>
            <button
              type="button"
              onClick={() => setShowRules((v) => !v)}
              className="text-[13px] font-semibold text-accent hover:underline"
            >
              {showRules ? L("Hide braille rules", "점자 규칙 숨기기") : L("Show braille rules", "점자 규칙 보기")}
            </button>
            {showRules && (
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.entries(pack.map).map(([ch, cells]) => (
                  <div key={ch} className="flex items-center gap-2 rounded-lg border border-line bg-surface-sunk px-2.5 py-1.5">
                    <span className="text-[16px] text-ink">{ch}</span>
                    <BrailleCellsView cells={cells} className="border-0 bg-transparent px-0 py-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pack actions */}
          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            <button type="button" onClick={() => download(pack, `${pack.code}-pack.json`)} className="rounded-xl border border-line bg-surface px-3 py-2 text-[13px] font-semibold text-ink hover:bg-surface-sunk">
              {L("Download this pack", "이 팩 다운로드")}
            </button>
            <button type="button" onClick={() => download(packTemplate(), "language-pack-template.json")} className="rounded-xl border border-line bg-surface px-3 py-2 text-[13px] font-semibold text-ink hover:bg-surface-sunk">
              {L("Download template", "템플릿 다운로드")}
            </button>
            {!pack.builtin && (
              <button type="button" onClick={() => { deletePack(pack.code); setCode("mr"); }} className="rounded-xl border border-line px-3 py-2 text-[13px] font-semibold text-[#B23B2E] hover:bg-[#FBE3DD]">
                {L("Delete pack", "팩 삭제")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload */}
      <div className="mt-5 rounded-xl border border-dashed border-line bg-surface-sunk p-4">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">{L("Upload a language pack", "언어 팩 업로드")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" aria-label={L("Choose a pack file", "팩 파일 선택")} onChange={onFile} />
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-xl bg-accent px-3 py-2 text-[13px] font-semibold text-white hover:bg-accent-soft">
            {L("Choose JSON file", "JSON 파일 선택")}
          </button>
        </div>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder={L("…or paste pack JSON here", "…또는 팩 JSON을 여기에 붙여넣기")}
          className="mt-2 min-h-[80px] w-full rounded-xl border border-line bg-surface px-3 py-2 font-mono text-[12px] text-ink placeholder:text-faint"
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            disabled={!importText.trim()}
            onClick={() => applyImport(importText)}
            className="rounded-xl border border-accent bg-surface px-3 py-2 text-[13px] font-semibold text-accent hover:bg-accent-tint disabled:opacity-50"
          >
            {L("Import pasted JSON", "붙여넣은 JSON 가져오기")}
          </button>
          {importMsg && (
            <span className={cn("text-[12.5px]", importMsg.ok ? "text-verify" : "text-[#B23B2E]")} role="status">
              {importMsg.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
