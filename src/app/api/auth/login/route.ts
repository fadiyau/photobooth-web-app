import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/bcrypt";
import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validation"; // 1. Import loginSchema

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { 
          message: "Input tidak valid", 
          errors: parsed.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { identifier, password } = parsed.data;

    //Cari User 
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: identifier, mode: "insensitive" } },
          { username: { equals: identifier, mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Username/Email atau password salah" },
        { status: 401 }
      );
    }

    // =========================
    // GOOGLE USER
    // =========================
    if (!user.password) {
      return NextResponse.json(
        { message: "Silakan login menggunakan Google" },
        { status: 401 }
      );
    }

    // =========================
    // CEK EMAIL VERIFIED
    // =========================
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          message: "Email belum diverifikasi",
          emailVerified: false,
        },
        { status: 403 }
      );
    }

    // =========================
    // CEK PASSWORD
    // =========================
    const valid = await comparePassword(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { message: "Username/Email atau password salah" },
        { status: 401 }
      );
    }

    // =========================
    // BUAT JWT
    // =========================
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // =========================
    // RESPONSE & COOKIE
    // =========================
    const response = NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}