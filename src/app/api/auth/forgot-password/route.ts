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
          message: "Input tidak valid",
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

    /*
     * Jangan memberi tahu apakah email
     * terdaftar atau tidak.
     * Ini mencegah email enumeration.
     */
    if (!user) {
      return NextResponse.json(
        {
          message:
            "Jika email terdaftar, link reset password telah dikirim.",
        },
        { status: 200 }
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

    // Log token untuk keperluan debugging di lokal (dari dev)
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
        "Gagal mengirim reset password email:",
        emailError
      );

      /*
       * Hapus token jika email gagal dikirim.
       * Supaya tidak ada token yang tersimpan
       * tetapi user tidak pernah menerimanya.
       */
      await prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
        },
      });

      return NextResponse.json(
        {
          message: "Gagal mengirim email reset password",
        },
        { status: 500 }
      );
    }

    // =========================
    // RESPONSE
    // =========================
    return NextResponse.json(
      {
        message:
          "Jika email terdaftar, link reset password telah dikirim.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}