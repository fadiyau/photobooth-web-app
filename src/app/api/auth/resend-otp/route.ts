import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpVerificationEmail } from "@/lib/email";
import { z } from "zod";

const resendOtpSchema = z.object({
  email: z.email("Format email tidak valid"),
});

const RESEND_COOLDOWN = 60 * 1000; // 60 detik

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // =========================
    // VALIDASI INPUT
    // =========================
    const parsed = resendOtpSchema.safeParse(body);

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

    if (!user) {
      return NextResponse.json(
        {
          message: "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // =========================
    // CEK EMAIL SUDAH VERIFIED
    // =========================
    if (user.emailVerified) {
      return NextResponse.json(
        {
          message: "Email sudah diverifikasi",
        },
        { status: 400 }
      );
    }

    // =========================
    // CARI OTP TERAKHIR
    // =========================
    const existingOtp =
      await prisma.emailVerificationOtp.findUnique({
        where: {
          userId: user.id,
        },
      });

    // =========================
    // CEK COOLDOWN
    // =========================
    if (existingOtp) {
      const now = Date.now();
      const createdAt = existingOtp.createdAt.getTime();

      const elapsed = now - createdAt;

      if (elapsed < RESEND_COOLDOWN) {
        const remainingSeconds = Math.ceil(
          (RESEND_COOLDOWN - elapsed) / 1000
        );

        return NextResponse.json(
          {
            message: `Silakan tunggu ${remainingSeconds} detik sebelum meminta OTP baru`,
            remainingSeconds,
          },
          { status: 429 }
        );
      }
    }

    // =========================
    // GENERATE OTP BARU
    // =========================
    const otp = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    // =========================
    // HAPUS OTP LAMA
    // =========================
    if (existingOtp) {
      await prisma.emailVerificationOtp.delete({
        where: {
          id: existingOtp.id,
        },
      });
    }

    // =========================
    // SIMPAN OTP BARU
    // =========================
    await prisma.emailVerificationOtp.create({
      data: {
        code: otp,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + 1000 * 60 * 5
        ),
      },
    });

    // =========================
    // KIRIM OTP VIA BREVO
    // =========================
    await sendOtpVerificationEmail(
      user.email,
      user.name,
      otp
    );

    // =========================
    // RESPONSE
    // =========================
    return NextResponse.json(
      {
        message: "OTP baru berhasil dikirim",
        cooldown: 60,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    return NextResponse.json(
      {
        message: "Gagal mengirim OTP",
      },
      { status: 500 }
    );
  }
}