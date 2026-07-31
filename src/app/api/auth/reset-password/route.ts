import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/bcrypt";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

<<<<<<< HEAD
    // =========================
    // VALIDASI INPUT
    // =========================
=======
>>>>>>> dev
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

<<<<<<< HEAD
    // =========================
    // CARI TOKEN
    // =========================
    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          token,
        },
      });
=======
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
>>>>>>> dev

    if (!resetToken) {
      return NextResponse.json(
        {
          message: "Token tidak valid",
        },
<<<<<<< HEAD
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

=======
        {
          status: 400,
        }
      );
    }

    if (resetToken.expiresAt < new Date()) {
>>>>>>> dev
      return NextResponse.json(
        {
          message: "Token sudah kadaluarsa",
        },
<<<<<<< HEAD
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
=======
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await hashPassword(password);

>>>>>>> dev
    await prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

<<<<<<< HEAD
    // =========================
    // HAPUS TOKEN
    // =========================
=======
>>>>>>> dev
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

<<<<<<< HEAD
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
=======
    return NextResponse.json({
      message: "Password berhasil diubah",
    });

  } catch (error) {
    console.error(error);
>>>>>>> dev

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
<<<<<<< HEAD
      { status: 500 }
=======
      {
        status: 500,
      }
>>>>>>> dev
    );
  }
}