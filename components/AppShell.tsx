import { TopNavigation } from "@/components/TopNavigation";
import { LangProvider } from "@/components/LangProvider";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { DemoBar } from "@/components/DemoBar";
import { SiteFooter } from "@/components/SiteFooter";
import { DemoSeeder } from "@/components/DemoSeeder";
import { DeviceInit } from "@/components/DeviceInit";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <AccessibilityProvider>
        <DemoSeeder />
        <DeviceInit />
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
