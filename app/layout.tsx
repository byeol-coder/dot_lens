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

export const metadata: Metadata = {
  title: "Dot Lens | AI Tactile Learning Platform",
  description:
    "Dot Lens transforms classroom diagrams and images into tactile learning materials that blind and low-vision students can explore by touch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
        {/* Dot Pad Web SDK bridge — registers a real device when on Chrome/Edge. */}
        <script type="module" src={`${basePath}/dotpad-sdk-bridge.js`} />
      </body>
    </html>
  );
}
