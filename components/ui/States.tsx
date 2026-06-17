"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useT, type TKey } from "@/lib/i18n";
import { useA11y } from "@/components/AccessibilityProvider";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ *
 * Shared status / loading / empty / error surfaces.
 * Every state is text-labelled (never colour-only) and announced to
 * screen readers via the accessibility live region, so a live demo
 * always shows "what's happening" and "what to do next".
 * ------------------------------------------------------------------ */

/** Announce a message to screen readers when `message` changes. */
export function useAnnounce(message: string | null) {
  const { announce } = useA11y();
  useEffect(() => {
    if (message) announce(message);
  }, [message, announce]);
}

export function LoadingState({ messageKey = "status.loadingAnalysis" as TKey }) {
  const { t } = useT();
  const msg = t(messageKey);
  useAnnounce(msg);
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-surface p-10 text-center"
    >
      <span className="lens-scan grid h-12 w-12 place-items-center rounded-full border-2 border-accent/40" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-accent" />
      </span>
      <p className="text-[14px] font-medium text-ink">{msg}</p>
    </div>
  );
}

export function EmptyState({
  messageKey = "status.empty" as TKey,
  actionKey,
  onAction,
  actionHref,
}: {
  messageKey?: TKey;
  actionKey?: TKey;
  onAction?: () => void;
  actionHref?: string;
}) {
  const { t } = useT();
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line bg-surface/60 p-10 text-center">
      <span
        className="grid h-12 w-12 place-items-center rounded-full bg-surface-sunk text-[20px] text-muted"
        aria-hidden
      >
        ◎
      </span>
      <p className="max-w-md text-[14px] leading-relaxed text-muted">{t(messageKey)}</p>
      {actionKey && actionHref && (
        <Link
          href={actionHref}
          className="rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-white shadow-card transition-colors hover:bg-accent-soft"
        >
          {t(actionKey)}
        </Link>
      )}
      {actionKey && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-white shadow-card transition-colors hover:bg-accent-soft"
        >
          {t(actionKey)}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  messageKey = "status.errorFallback" as TKey,
  onRetry,
  onSample,
}: {
  messageKey?: TKey;
  onRetry?: () => void;
  onSample?: () => void;
}) {
  const { t } = useT();
  const msg = t(messageKey);
  useAnnounce(msg);
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-warn/30 bg-pin-soft/30 p-8 text-center"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-warn/15 text-[18px] text-warn" aria-hidden>
        !
      </span>
      <p className="max-w-md text-[14px] leading-relaxed text-ink">{msg}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-xl border border-accent bg-surface px-4 py-2 text-[13px] font-semibold text-accent transition-colors hover:bg-accent-tint"
          >
            {t("status.retry")}
          </button>
        )}
        {onSample && (
          <button
            onClick={onSample}
            className="rounded-xl bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-accent-soft"
          >
            {t("status.continueSample")}
          </button>
        )}
      </div>
    </div>
  );
}

/** Inline success / info banner with a status role; also announced. */
export function StatusBanner({
  messageKey,
  tone = "success",
}: {
  messageKey: TKey;
  tone?: "success" | "info" | "review";
}) {
  const { t } = useT();
  const msg = t(messageKey);
  useAnnounce(msg);
  const toneCls =
    tone === "success"
      ? "border-verify/25 bg-verify-tint text-verify"
      : tone === "review"
      ? "border-accent/25 bg-accent-tint text-accent"
      : "border-line bg-surface-sunk text-ink";
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px] font-medium", toneCls)}
    >
      <span aria-hidden>{tone === "success" ? "✓" : tone === "review" ? "↗" : "ⓘ"}</span>
      <span>{msg}</span>
    </div>
  );
}
