// src/app/api/socket-port/route.ts
import { NextResponse } from "next/server";
import { getSocketPort } from "@/config/socket";

export async function GET() {
  const port = getSocketPort();
  if (port) {
    return NextResponse.json({ port });
  }
  return NextResponse.json({ error: "Socket.IO server not running" }, { status: 500 });
}