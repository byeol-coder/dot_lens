import { TopNavigation } from "@/components/TopNavigation";
import { LangProvider } from "@/components/LangProvider";
import { ApiShim } from "@/components/ApiShim";
import { PRODUCT } from "@/lib/constants";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <ApiShim />
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
              <p className="font-display text-[14px] font-semibold text-ink">{PRODUCT.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-faint">
                Prototype · AI-powered tactile education platform for inclusive classrooms
              </p>
            </div>
            <div className="flex flex-col gap-1 sm:items-end">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
                Dot Pad · Gemini · Tactile Learning
              </p>
              <p className="font-mono text-[10px] text-faint">
                Built for mission fields &amp; low-resource schools
              </p>
            </div>
          </div>
        </footer>
      </div>
    </LangProvider>
  );
}
