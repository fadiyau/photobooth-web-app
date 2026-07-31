import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const payload = verifyToken(token) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        provider: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(user);

  } catch (err) {

    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  }
}