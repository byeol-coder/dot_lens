"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV } from "@/lib/nav";
import { PRODUCT } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function TopNavigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6"
      >
        {/* Wordmark → home */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={`${PRODUCT.shortName} — home`}
        >
          <span
            className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white shadow-card"
            aria-hidden
          >
            <span className="grid grid-cols-2 grid-rows-3 gap-[2px]">
              {[1, 1, 0, 1, 1, 0].map((on, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-[3px] w-[3px] rounded-full",
                    on ? "bg-pin-soft" : "bg-accent-soft"
                  )}
                />
              ))}
            </span>
          </span>
          <span className="hidden font-display text-[15px] font-semibold text-ink sm:block">
            Dot Lens
          </span>
        </Link>

        <div className="flex-1" />

        <ul className="flex items-center gap-0.5">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                    active
                      ? "bg-accent-tint text-accent"
                      : "text-muted hover:bg-surface-sunk hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
