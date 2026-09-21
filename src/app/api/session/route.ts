import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { frameKey } = body;

    if (!frameKey) {
      return NextResponse.json(
        {
          message: "Frame wajib dipilih",
        },
        {
          status: 400,
        }
      );
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        frameKey,
      },
    });

    return NextResponse.json(
      {
        message: "Session berhasil dibuat",
        session,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE SESSION ERROR:", error);

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