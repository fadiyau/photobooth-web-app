import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/bcrypt";
import { loginSchema } from "@/lib/validation";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // =========================
    // VALIDASI INPUT
    // =========================
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Input tidak valid",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // =========================
    // CARI USER
    // =========================
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

    // =========================
    // GOOGLE USER
    // =========================
    if (!user.password) {
      return NextResponse.json(
        {
          message: "Silakan login menggunakan Google",
        },
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
    const valid = await comparePassword(
      password,
      user.password
    );

    if (!valid) {
      return NextResponse.json(
        {
          message: "Email atau password salah",
        },
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
    // RESPONSE
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

    // =========================
    // SET COOKIE
    // =========================
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
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}