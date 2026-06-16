"use client";

import { useEffect } from "react";
import { installApiShim } from "@/lib/staticApiShim";

/**
 * Installs the client-side /api/* fetch shim for static hosting.
 * The shim self-installs at module import (client bundle eval), before any
 * component effect; this useEffect is a belt-and-suspenders re-assert.
 * Renders nothing.
 */
export function ApiShim() {
  useEffect(() => {
    installApiShim();
  }, []);
  return null;
}
