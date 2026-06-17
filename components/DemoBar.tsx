"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";
import { useA11y } from "@/components/AccessibilityProvider";

/**
 * Slim, always-present demo strip under the top nav.
 * Gives a live demo a clear "you're on safe rails" signal plus one-tap
 * recovery: Reset Demo returns to the start, and Home/Dashboard are always
 * reachable so a presenter never gets stuck on an unexpected screen.
 */
export function DemoBar() {
  const { t } = useT();
  const { announce } = useA11y();
  const router = useRouter();

  const resetDemo = () => {
    try {
      sessionStorage.clear();
    } catch {
      /* storage unavailable — non-fatal */
    }
    announce(t("status.resetDemo"));
    router.push("/");
  };

  return (
    <div className="border-b border-line/70 bg-accent-tint/50 print:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-1.5 sm:px-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-pin-soft" aria-hidden />
          {t("demo.badge")}
        </span>
        <p className="hidden min-w-0 flex-1 truncate text-[12px] text-muted sm:block">
          {t("demo.banner")}
        </p>
        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href="/dashboard"
            className="rounded-lg px-2.5 py-1 text-[12px] font-medium text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            {t("common.dashboard")}
          </Link>
          <button
            type="button"
            onClick={resetDemo}
            aria-label={t("demo.reset")}
            className="rounded-lg border border-accent/40 bg-surface px-2.5 py-1 text-[12px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            ↺ {t("demo.reset")}
          </button>
        </div>
      </div>
    </div>
  );
}
