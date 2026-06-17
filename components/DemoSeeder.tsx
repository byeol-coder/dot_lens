"use client";

import { useEffect } from "react";
import { seedDemoData } from "@/lib/demoSeed";

/** Seeds demo data once on first load so every screen is presentable. */
export function DemoSeeder() {
  useEffect(() => {
    seedDemoData();
  }, []);
  return null;
}
