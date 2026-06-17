import type { Metadata } from "next";
import "./globals.css";
// Self-hosted fonts (bundled locally) — no build-time CDN dependency,
// so the platform builds and deploys reliably even in low-connectivity fields.
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource-variable/figtree";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import { AppShell } from "@/components/AppShell";
import { PRODUCT } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${PRODUCT.name} — ${PRODUCT.positioning.en}`,
  description: PRODUCT.subtitle.en,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
