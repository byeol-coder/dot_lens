"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MAIN_NAV, MORE_NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { LangToggle } from "@/components/LangToggle";
import { useT } from "@/lib/i18n";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden className={cn("transition-transform", open && "rotate-180")}>
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TopNavigation() {
  const pathname = usePathname();
  const { t, lang } = useT();
  const ko = lang === "ko";
  const label = (en: string, koLabel: string) => (ko ? koLabel : en);

  const [moreOpen, setMoreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  const moreActive = MORE_NAV.some((i) => isActive(i.href));

  useEffect(() => {
    setMoreOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    function onDown(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMoreOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [moreOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40">
      <div className="glass border-b border-line/80">
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
          {/* Wordmark → home */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${t("brand.name")} — ${t("common.home")}`}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white shadow-glow" aria-hidden>
              <span className="grid grid-cols-2 grid-rows-3 gap-[2.5px]">
                {[1, 1, 0, 1, 1, 0].map((on, i) => (
                  <span key={i} className={cn("h-[3.5px] w-[3.5px] rounded-full", on ? "bg-pin-soft" : "bg-accent-soft")} />
                ))}
              </span>
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-[15px] font-semibold text-ink">{t("brand.name")}</span>
              <span className="block font-mono text-[9.5px] uppercase tracking-eyebrow text-faint xl:hidden">{t("brand.subtitle")}</span>
            </span>
          </Link>

          <div className="flex-1" />

          {/* Desktop: primary links + More (lg+) */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {MAIN_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block whitespace-nowrap rounded-lg px-2.5 py-2 text-[12.5px] font-medium transition-colors",
                      active ? "bg-accent-tint text-accent" : "text-muted hover:bg-surface-sunk hover:text-ink"
                    )}
                  >
                    {label(item.label, item.labelKo)}
                  </Link>
                </li>
              );
            })}
            <li className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  moreActive || moreOpen ? "bg-accent-tint text-accent" : "text-muted hover:bg-surface-sunk hover:text-ink"
                )}
              >
                {t("nav.more")}
                <Chevron open={moreOpen} />
              </button>
              {moreOpen && (
                <div role="menu" className="absolute right-0 top-full mt-1 w-72 overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
                  <ul className="p-1.5">
                    {MORE_NAV.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            role="menuitem"
                            aria-current={active ? "page" : undefined}
                            className={cn("block rounded-xl px-3 py-2.5 transition-colors", active ? "bg-accent-tint" : "hover:bg-surface-sunk")}
                          >
                            <span className={cn("block text-[13.5px] font-semibold", active ? "text-accent" : "text-ink")}>
                              {label(item.label, item.labelKo)}
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
          </ul>

          <LangToggle className="shrink-0" />

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("common.close") : t("nav.menu")}
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

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-line/60 px-4 pb-4 pt-2 lg:hidden">
            <ul className="flex flex-col gap-1">
              {MAIN_NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn("block rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors", active ? "bg-accent-tint text-accent" : "text-muted hover:bg-surface-sunk hover:text-ink")}
                    >
                      {label(item.label, item.labelKo)}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-1 border-t border-line/60 pt-2">
                <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-eyebrow text-faint">{t("nav.more")}</p>
                {MORE_NAV.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn("block rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors", active ? "bg-accent-tint text-accent" : "text-muted hover:bg-surface-sunk hover:text-ink")}
                    >
                      {label(item.label, item.labelKo)}
                    </Link>
                  );
                })}
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="spectrum-bar h-px w-full opacity-60" aria-hidden />
    </header>
  );
}
