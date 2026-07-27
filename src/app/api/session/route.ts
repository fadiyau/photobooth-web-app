import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUser";
import { generateSessionCode } from "@/utils/generateSessionCode";
import { createSessionSchema } from "@/lib/session-validation";

export async function POST(req: Request) {
  try {
    // Cek user login
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Ambil body request
    const body = await req.json();

    // Validasi input
    const parsed = createSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Input tidak valid",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    // Generate session code yang unik
    let code = generateSessionCode();

    while (
      await prisma.session.findUnique({
        where: {
          code,
        },
      })
    ) {
      code = generateSessionCode();
    }

    // Buat session
    const session = await prisma.session.create({
      data: {
        code,
        ownerId: userId,
        templateId: parsed.data.templateId ?? null,
      },
    });

    // Owner otomatis menjadi participant pertama
    await prisma.participant.create({
      data: {
        sessionId: session.id,
        userId,
      },
    });

    return NextResponse.json(
      {
        message: "Session berhasil dibuat",
        data: session,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server",
      },
      {
        status: 500,
      }
    );
  }
}