"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { LangToggle } from "@/components/LangToggle";
import { useT } from "@/lib/i18n";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={cn("transition-transform", open && "rotate-180")}
    >
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TopNavigation() {
  const pathname = usePathname();
  const { t, lang } = useT();
  const ko = lang === "ko";

  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const inGroup = (i: number) =>
    NAV_GROUPS[i].items.some((it) => pathname === it.href || pathname.startsWith(it.href + "/"));

  // Close menus on navigation.
  useEffect(() => {
    setOpenGroup(null);
    setMenuOpen(false);
    setOpenMobileGroup(null);
  }, [pathname]);

  // Close the desktop dropdown on Escape or outside click.
  useEffect(() => {
    if (openGroup === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenGroup(null);
    }
    function onDown(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenGroup(null);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [openGroup]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40">
      <div className="glass border-b border-line/80">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6"
        >
          {/* Wordmark → home */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={`${t("brand.name")} — ${t("common.home")}`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white shadow-glow" aria-hidden>
              <span className="grid grid-cols-2 grid-rows-3 gap-[2.5px]">
                {[1, 1, 0, 1, 1, 0].map((on, i) => (
                  <span key={i} className={cn("h-[3.5px] w-[3.5px] rounded-full", on ? "bg-pin-soft" : "bg-accent-soft")} />
                ))}
              </span>
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-[15px] font-semibold text-ink">{t("brand.name")}</span>
              <span className="block font-mono text-[9.5px] uppercase tracking-eyebrow text-faint xl:hidden">
                {t("brand.subtitle")}
              </span>
            </span>
          </Link>

          <div className="flex-1" />

          {/* Desktop: three grouped dropdowns (lg+) */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_GROUPS.map((group, i) => {
              const open = openGroup === i;
              const active = inGroup(i);
              return (
                <li
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(i)}
                  onMouseLeave={() => setOpenGroup((g) => (g === i ? null : g))}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={() => setOpenGroup(open ? null : i)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                      active || open ? "bg-accent-tint text-accent" : "text-muted hover:bg-surface-sunk hover:text-ink"
                    )}
                  >
                    {ko ? group.labelKo : group.label}
                    <Chevron open={open} />
                  </button>

                  {open && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-1 w-72 overflow-hidden rounded-2xl border border-line bg-surface shadow-lift"
                    >
                      <ul className="p-1.5">
                        {group.items.map((item) => {
                          const itemActive = pathname === item.href || pathname.startsWith(item.href + "/");
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                role="menuitem"
                                aria-current={itemActive ? "page" : undefined}
                                className={cn(
                                  "block rounded-xl px-3 py-2.5 transition-colors",
                                  itemActive ? "bg-accent-tint" : "hover:bg-surface-sunk"
                                )}
                              >
                                <span className={cn("block text-[13.5px] font-semibold", itemActive ? "text-accent" : "text-ink")}>
                                  {ko ? item.labelKo : item.label}
                                </span>
                                <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">{item.blurb}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <LangToggle className="shrink-0" />

          {/* Mobile/tablet menu button — hidden at lg+ */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-muted hover:bg-surface-sunk hover:text-ink lg:hidden"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile dropdown — three collapsible groups */}
        {menuOpen && (
          <div className="border-t border-line/60 px-4 pb-4 pt-2 lg:hidden">
            <ul className="flex flex-col gap-1">
              {NAV_GROUPS.map((group, i) => {
                const open = openMobileGroup === i;
                const active = inGroup(i);
                return (
                  <li key={group.label} className="rounded-xl border border-line/60">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenMobileGroup(open ? null : i)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors",
                        active ? "text-accent" : "text-ink"
                      )}
                    >
                      {ko ? group.labelKo : group.label}
                      <Chevron open={open} />
                    </button>
                    {open && (
                      <ul className="flex flex-col gap-0.5 px-1.5 pb-2">
                        {group.items.map((item) => {
                          const itemActive = pathname === item.href || pathname.startsWith(item.href + "/");
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                aria-current={itemActive ? "page" : undefined}
                                className={cn(
                                  "block rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                                  itemActive ? "bg-accent-tint text-accent" : "text-muted hover:bg-surface-sunk hover:text-ink"
                                )}
                              >
                                {ko ? item.labelKo : item.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="spectrum-bar h-px w-full opacity-60" aria-hidden />
    </header>
  );
}
