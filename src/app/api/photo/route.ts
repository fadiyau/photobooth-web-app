import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const { sessionId, imageUrl } = body;

    if (!sessionId || !imageUrl) {
      return NextResponse.json(
        {
          message: "sessionId dan imageUrl wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return NextResponse.json(
        {
          message: "Session tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    if (session.userId !== user.id) {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const photo = await prisma.photo.create({
      data: {
        sessionId,
        imageUrl,
      },
    });

    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        status: "FINISHED",
      },
    });

    return NextResponse.json(
      {
        message: "Photo berhasil disimpan",
        photo,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("SAVE PHOTO ERROR:", error);

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