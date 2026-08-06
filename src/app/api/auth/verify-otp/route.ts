import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // =========================
    // VALIDASI INPUT
    // =========================
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid Input",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;

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
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // =========================
    // CARI OTP
    // =========================
    const otpData = await prisma.emailVerificationOtp.findFirst({
      where: {
        userId: user.id,
        code: otp,
      },
    });

    if (!otpData) {
      return NextResponse.json(
        {
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    // =========================
    // CEK MASA BERLAKU
    // =========================
    if (otpData.expiresAt < new Date()) {
      // Hapus OTP yang sudah expired
      await prisma.emailVerificationOtp.delete({
        where: {
          id: otpData.id,
        },
      });

      return NextResponse.json(
        {
          message: "OTP has expired",
        },
        { status: 400 }
      );
    }

    // =========================
    // VERIFIKASI USER
    // =========================
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });

    // =========================
    // HAPUS OTP TERPAKAI
    // =========================
    await prisma.emailVerificationOtp.delete({
      where: {
        id: otpData.id,
      },
    });

    return NextResponse.json(
      {
        message: "Email successfully verified",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}