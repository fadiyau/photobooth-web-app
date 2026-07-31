import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyOtpSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Input tidak valid",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;

    // Cari user berdasarkan email
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

    // Cari OTP sesuai user & kode OTP
    const otpData = await prisma.emailVerificationOtp.findFirst({
      where: {
        userId: user.id,
        code: otp,
      },
    });

    if (!otpData) {
      return NextResponse.json(
        {
          message: "OTP salah",
        },
        { status: 400 }
      );
    }

    // Cek masa berlaku
    if (otpData.expiresAt < new Date()) {
      return NextResponse.json(
        {
          message: "OTP sudah kadaluarsa",
        },
        { status: 400 }
      );
    }

    // Verifikasi email
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });

    // Hapus OTP yang sudah dipakai
    await prisma.emailVerificationOtp.delete({
      where: {
        id: otpData.id,
      },
    });

    return NextResponse.json(
      {
        message: "Email berhasil diverifikasi",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

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