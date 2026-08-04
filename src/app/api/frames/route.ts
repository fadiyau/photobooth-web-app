import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const frames = await prisma.frame.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(
      {
        message: "Frames berhasil diambil",
        frames,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET FRAMES ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}