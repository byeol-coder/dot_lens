"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PRIMARY_NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { LangToggle } from "@/components/LangToggle";
import { useT } from "@/lib/i18n";

export function TopNavigation() {
  const pathname = usePathname();
  const { t, lang } = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
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
            <span
              className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white shadow-glow"
              aria-hidden
            >
              <span className="grid grid-cols-2 grid-rows-3 gap-[2.5px]">
                {[1, 1, 0, 1, 1, 0].map((on, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-[3.5px] w-[3.5px] rounded-full",
                      on ? "bg-pin-soft" : "bg-accent-soft"
                    )}
                  />
                ))}
              </span>
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-[15px] font-semibold text-ink">
                {t("brand.name")}
              </span>
              <span className="block font-mono text-[9.5px] uppercase tracking-eyebrow text-faint">
                {t("brand.subtitle")}
              </span>
            </span>
          </Link>

          <div className="flex-1" />

          {/* Desktop nav */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {PRIMARY_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                      active
                        ? "bg-accent-tint text-accent"
                        : "text-muted hover:bg-surface-sunk hover:text-ink"
                    )}
                  >
                    {lang === "ko" ? item.labelKo : item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <LangToggle className="shrink-0" />

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-muted hover:bg-surface-sunk hover:text-ink lg:hidden"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-line/60 px-4 pb-4 pt-2 lg:hidden">
            <ul className="flex flex-col gap-1">
              {PRIMARY_NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors",
                        active
                          ? "bg-accent-tint text-accent"
                          : "text-muted hover:bg-surface-sunk hover:text-ink"
                      )}
                    >
                      {lang === "ko" ? item.labelKo : item.label}
                    </Link>
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
