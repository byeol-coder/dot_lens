"use client";

import { useState } from "react";
import worldDots from "@/lib/worldDots.json";
import {
  PARTNER_STATUS_META,
  PARTNER_TYPE_LABEL,
  type CountryPartner,
  type PartnerStatus,
} from "@/lib/certification";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const W = worldDots.width;
const H = worldDots.height;

/** Same equirectangular projection used to generate the dot grid. */
function project(lat: number, lng: number): [number, number] {
  return [((lng + 180) / 360) * W, ((90 - lat) / 180) * H];
}

/* Status drives marker SIZE and an outline STYLE (not colour alone), so the map
   is readable in high-contrast mode and for colour-vision differences. */
const STATUS_STYLE: Record<
  PartnerStatus,
  { r: number; ring: string; fill: string }
> = {
  hub: { r: 11, ring: "var(--mk-hub)", fill: "var(--mk-hub)" },
  authorized: { r: 9, ring: "var(--mk-auth)", fill: "var(--mk-auth)" },
  onboarding: { r: 7, ring: "var(--mk-onb)", fill: "transparent" },
  prospective: { r: 5.5, ring: "var(--mk-pros)", fill: "transparent" },
};

export function WorldPartnerMap({ partners }: { partners: CountryPartner[] }) {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const [active, setActive] = useState<string | null>(null);

  // Draw smaller/farther statuses first so hubs sit on top.
  const ordered = [...partners].sort(
    (a, b) => PARTNER_STATUS_META[a.status].order - PARTNER_STATUS_META[b.status].order
  );
  const activePartner = ordered.find((p) => p.partnerId === active) ?? null;

  return (
    <figure className="m-0">
      <div
        className="relative overflow-hidden rounded-2xl border border-line bg-surface p-3 shadow-card"
        style={
          {
            // Brand-blue marker palette, overridable by high-contrast theme.
            ["--mk-hub" as string]: "#1FA971",
            ["--mk-auth" as string]: "#2550C8",
            ["--mk-onb" as string]: "#4B79E6",
            ["--mk-pros" as string]: "#8B97AC",
          } as React.CSSProperties
        }
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={tr(
            `World map of ${partners.length} country partners for tactile education`,
            `촉각 교육 각국 파트너 ${partners.length}곳을 표시한 세계지도`
          )}
        >
          {/* Land as a field of dots — the tactile / Dot Pad motif. */}
          <g aria-hidden="true">
            {(worldDots.dots as [number, number][]).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={1.5} fill="#C9D4E8" />
            ))}
          </g>

          {/* Partner markers */}
          <g>
            {ordered.map((p) => {
              const [cx, cy] = project(p.lat, p.lng);
              const st = STATUS_STYLE[p.status];
              const isActive = active === p.partnerId;
              return (
                <g
                  key={p.partnerId}
                  transform={`translate(${cx} ${cy})`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${lang === "ko" ? p.countryKo : p.country}, ${p.org}. ${
                    lang === "ko" ? PARTNER_STATUS_META[p.status].label.ko : PARTNER_STATUS_META[p.status].label.en
                  }. ${p.certifiedTrainers} ${tr("trainers", "트레이너")}, ${p.trainerCandidates} ${tr("candidates", "후보")}.`}
                  className="cursor-pointer focus:outline-none"
                  onMouseEnter={() => setActive(p.partnerId)}
                  onMouseLeave={() => setActive((a) => (a === p.partnerId ? null : a))}
                  onFocus={() => setActive(p.partnerId)}
                  onBlur={() => setActive((a) => (a === p.partnerId ? null : a))}
                >
                  {/* halo for focus/hover */}
                  {isActive && (
                    <circle r={st.r + 7} fill={st.ring} opacity={0.18} />
                  )}
                  <circle
                    r={st.r}
                    fill={st.fill}
                    stroke={st.ring}
                    strokeWidth={st.fill === "transparent" ? 2.5 : 1.5}
                  />
                  {/* hub gets a star tick so it's distinct without colour */}
                  {p.status === "hub" && (
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fontSize="11"
                      fill="#fff"
                      aria-hidden
                    >
                      ★
                    </text>
                  )}
                  {/* trainer count badge for active centers */}
                  {p.certifiedTrainers > 0 && p.status !== "hub" && (
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fontSize="9"
                      fontWeight="700"
                      fill="#fff"
                      aria-hidden
                    >
                      {p.certifiedTrainers}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip card for the active partner */}
        {activePartner && (
          <div
            className="pointer-events-none absolute left-3 top-3 max-w-[260px] rounded-xl border border-line bg-surface/95 p-3 shadow-lift backdrop-blur"
            role="status"
          >
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
              {lang === "ko" ? activePartner.countryKo : activePartner.country}
            </p>
            <p className="mt-0.5 text-[14px] font-semibold text-ink">{activePartner.org}</p>
            <p className="mt-0.5 text-[12px] text-muted">
              {PARTNER_STATUS_META[activePartner.status].mark}{" "}
              {lang === "ko"
                ? PARTNER_STATUS_META[activePartner.status].label.ko
                : PARTNER_STATUS_META[activePartner.status].label.en}{" "}
              · {lang === "ko" ? PARTNER_TYPE_LABEL[activePartner.type].ko : PARTNER_TYPE_LABEL[activePartner.type].en}
            </p>
            <p className="mt-1.5 text-[12px] text-ink">
              {activePartner.certifiedTrainers} {tr("trainers", "트레이너")} ·{" "}
              {activePartner.trainerCandidates} {tr("candidates", "후보")} ·{" "}
              {activePartner.activeTeachers} {tr("teachers", "교사")}
            </p>
          </div>
        )}
      </div>

      {/* Legend — labelled, not colour-only */}
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-muted">
        {(["hub", "authorized", "onboarding", "prospective"] as PartnerStatus[]).map((s) => {
          const st = STATUS_STYLE[s];
          return (
            <span key={s} className="inline-flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="-9 -9 18 18" aria-hidden>
                <circle
                  r={Math.min(7, st.r)}
                  fill={st.fill}
                  stroke={st.ring}
                  strokeWidth={st.fill === "transparent" ? 2.5 : 1.5}
                />
              </svg>
              {lang === "ko" ? PARTNER_STATUS_META[s].label.ko : PARTNER_STATUS_META[s].label.en}
            </span>
          );
        })}
        <span className="text-faint">
          {tr("Tap or focus a marker for details", "마커를 누르거나 포커스하면 상세 표시")}
        </span>
      </figcaption>

      {/* Screen-reader / no-SVG fallback: the same data as a list */}
      <ul className="sr-only">
        {ordered.map((p) => (
          <li key={p.partnerId}>
            {(lang === "ko" ? p.countryKo : p.country)} — {p.org}:{" "}
            {lang === "ko"
              ? PARTNER_STATUS_META[p.status].label.ko
              : PARTNER_STATUS_META[p.status].label.en}
            , {p.certifiedTrainers} {tr("trainers", "트레이너")}, {p.trainerCandidates}{" "}
            {tr("candidates", "후보")}.
          </li>
        ))}
      </ul>
    </figure>
  );
}
