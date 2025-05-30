import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description } = body;

    if (!id || !title || !description) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, {status: 404});
    }

    const imageFound = await prisma.image.findMany()

    if (imageFound.length === 0) {
      return NextResponse.json({ error: "No se encontró imagenes" }, {status: 404});
    }

    return NextResponse.json(imageFound);

  } catch (error) {
    return NextResponse.json({ message: error}, {status: 500})
  }
}