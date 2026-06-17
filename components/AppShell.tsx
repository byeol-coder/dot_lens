import { TopNavigation } from "@/components/TopNavigation";
import { LangProvider } from "@/components/LangProvider";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { PRODUCT } from "@/lib/constants";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <AccessibilityProvider>
        <div className="flex min-h-screen flex-col">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <TopNavigation />
          <main id="main" className="flex-1">
            {children}
          </main>
          <footer className="mt-8 border-t border-line bg-surface/70">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="font-display text-[14px] font-semibold text-ink">
                  {PRODUCT.shortName} · {PRODUCT.positioning.en}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-faint">
                  Build &rarr; Review &rarr; Teach &rarr; Improve &rarr; Empower local teachers
                </p>
              </div>
              <div className="flex flex-col gap-1 sm:items-end">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
                  Dot Pad &middot; Tactile Learning &middot; Champion Teachers
                </p>
                <p className="font-mono text-[10px] text-faint">
                  {PRODUCT.audience.en} &middot; prototype with mock data
                </p>
              </div>
            </div>
          </footer>
          <AccessibilityBar />
        </div>
      </AccessibilityProvider>
    </LangProvider>
  );
}
