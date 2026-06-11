import { NextResponse } from "next/server";
import { OBJECT_SEQUENCE } from "@/lib/tactileMatrix";

// GET /api/dotpad/status — mock device status.
export async function GET() {
  return NextResponse.json({
    connected: false,
    deviceName: "Dot Pad (mock)",
    currentObject: OBJECT_SEQUENCE[0].name.en,
    mode: "guided",
  });
}
