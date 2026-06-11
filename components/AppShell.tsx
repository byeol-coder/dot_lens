import { TopNavigation } from "@/components/TopNavigation";
import { PRODUCT } from "@/lib/constants";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <TopNavigation />
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 sm:px-6">
          <p className="text-[13px] text-muted">
            {PRODUCT.name}
          </p>
          <p className="font-mono text-[11px] text-faint">
            Prototype · no real Google, Gemini, or Dot Pad services are used.
          </p>
        </div>
      </footer>
    </div>
  );
}
