"use client";

import { useEffect } from "react";
import { exposeGlobalRegistrar } from "@/lib/dotpadDevice";

/**
 * Exposes window.registerDotPad so an external Dot Inc Web SDK bridge script can
 * register a real device. No-op until such a bridge calls it.
 */
export function DeviceInit() {
  useEffect(() => {
    exposeGlobalRegistrar();
  }, []);
  return null;
}
