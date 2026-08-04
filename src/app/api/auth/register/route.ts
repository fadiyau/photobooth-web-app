import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/bcrypt";
import { registerSchema } from "@/lib/validation";
import {
  sendWelcomeEmail,
  sendOtpVerificationEmail,
} from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // =========================
    // VALIDASI INPUT
    // =========================
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Input tidak valid",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { username, name, email, password } = parsed.data;

    // =========================
    // CEK USERNAME
    // =========================
    const usernameExist = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (usernameExist) {
      return NextResponse.json(
        {
          message: "Username sudah digunakan",
        },
        { status: 409 }
      );
    }

    // =========================
    // CEK EMAIL
    // =========================
    const emailExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailExist) {
      return NextResponse.json(
        {
          message: "Email sudah digunakan",
        },
        { status: 409 }
      );
    }

    // =========================
    // HASH PASSWORD
    // =========================
    const hashedPassword = await hashPassword(password);

    // =========================
    // CREATE USER
    // =========================
    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        provider: true,
        avatar: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // =========================
    // GENERATE OTP
    // =========================
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // =========================
    // SIMPAN OTP
    // =========================
    await prisma.emailVerificationOtp.create({
      data: {
        code: otp,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      },
    });

    // =========================
    // KIRIM OTP EMAIL
    // =========================
    try {
      await sendOtpVerificationEmail(
        user.email,
        user.name,
        otp
      );
    } catch (emailError) {
      console.error("Gagal mengirim OTP:", emailError);
    }

    // =========================
    // KIRIM WELCOME EMAIL
    // =========================
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error("Gagal mengirim welcome email:", emailError);
    }

    // =========================
    // RESPONSE
    // =========================
    return NextResponse.json(
      {
        message: "Register berhasil. Silakan verifikasi email kamu.",
        user,
        emailVerified: false,
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}