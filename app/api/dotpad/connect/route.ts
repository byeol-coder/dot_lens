import { NextResponse } from "next/server";
import { OBJECT_SEQUENCE } from "@/lib/tactileMatrix";

// POST /api/dotpad/connect — mock pairing.
// TODO(real device): negotiate Web Bluetooth / WebHID / WebUSB with the Dot Pad.
export async function POST() {
  return NextResponse.json({
    connected: true,
    deviceName: "Dot Pad (mock)",
    currentObject: OBJECT_SEQUENCE[0].name.en,
    mode: "guided",
  });
}
