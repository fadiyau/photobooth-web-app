import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/bcrypt";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // =========================
    // VALIDASI INPUT
    // =========================
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Input tidak valid",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // =========================
    // CARI TOKEN
    // =========================
    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          token,
        },
      });

    if (!resetToken) {
      return NextResponse.json(
        {
          message: "Token tidak valid",
        },
        { status: 400 }
      );
    }

    // =========================
    // CEK EXPIRY
    // =========================
    if (resetToken.expiresAt < new Date()) {
      // Hapus token expired
      await prisma.passwordResetToken.delete({
        where: {
          id: resetToken.id,
        },
      });

      return NextResponse.json(
        {
          message: "Token sudah kadaluarsa",
        },
        { status: 400 }
      );
    }

    // =========================
    // HASH PASSWORD BARU
    // =========================
    const hashedPassword =
      await hashPassword(password);

    // =========================
    // UPDATE PASSWORD
    // =========================
    await prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    // =========================
    // HAPUS TOKEN
    // =========================
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    return NextResponse.json(
      {
        message: "Password berhasil diubah",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}