import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendResetPasswordEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // =========================
    // VALIDASI INPUT
    // =========================
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid email address.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

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
          message: "We couldn't find an account with that email. Please check your spelling or Sign Up.",
        },
        { status: 404 }
      );
    }

    // =========================
    // HAPUS TOKEN LAMA
    // =========================
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // =========================
    // GENERATE TOKEN BARU
    // =========================
    const resetToken = crypto.randomBytes(32).toString("hex");

    if (process.env.NODE_ENV !== "production") {
      console.log("RESET TOKEN:", resetToken);
    }

    // =========================
    // SIMPAN TOKEN
    // =========================
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
      },
    });

    // =========================
    // KIRIM EMAIL
    // =========================
    try {
      await sendResetPasswordEmail(
        user.email,
        user.name,
        resetToken
      );
    } catch (emailError) {
      console.error(
        "Failed to send password reset email:",
        emailError
      );

      await prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
        },
      });

      return NextResponse.json(
        {
          message: "We couldn't send the reset email. Please try again later.",
        },
        { status: 500 }
      );
    }

    // =========================
    // RESPONSE SUKSES
    // =========================
    return NextResponse.json(
      {
        message: "Password reset link has been sent to your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        message: "We couldn't process your request. Please try again later.",
      },
      { status: 500 }
    );
  }
}