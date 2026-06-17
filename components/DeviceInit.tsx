"use client";

import { useEffect } from "react";
import { exposeGlobalRegistrar } from "@/lib/dotpadDevice";
import { exposeFleetRegistrar } from "@/lib/dotpadFleet";

/**
 * Exposes window.registerDotPad (single device) and window.registerDotPadFleet
 * (up to 5 devices) so the external Dot Inc Web SDK bridge can inject real
 * devices. No-op until the bridge calls them.
 */
export function DeviceInit() {
  useEffect(() => {
    exposeGlobalRegistrar();
    exposeFleetRegistrar();
  }, []);
  return null;
}
