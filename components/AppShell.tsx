import { TopNavigation } from "@/components/TopNavigation";
import { LangProvider } from "@/components/LangProvider";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { DemoBar } from "@/components/DemoBar";
import { SiteFooter } from "@/components/SiteFooter";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <AccessibilityProvider>
        <div className="flex min-h-screen flex-col">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <TopNavigation />
          <DemoBar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <AccessibilityBar />
        </div>
      </AccessibilityProvider>
    </LangProvider>
  );
}
