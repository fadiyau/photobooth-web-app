import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
<<<<<<< HEAD
import { sendResetPasswordEmail } from "@/lib/email";
=======
>>>>>>> dev
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

<<<<<<< HEAD
    // =========================
    // VALIDASI INPUT
    // =========================
=======
>>>>>>> dev
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

<<<<<<< HEAD
    // =========================
    // CARI USER
    // =========================
=======
>>>>>>> dev
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
<<<<<<< HEAD

    /*
     * Jangan memberi tahu apakah email
     * terdaftar atau tidak.
     *
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
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // =========================
    // SIMPAN TOKEN
    // =========================
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + 1000 * 60 * 15
        ),
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
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );
=======
    console.log("User ditemukan:", user);
    console.log("Email:", email);

    if (user) {
  console.log("Masuk IF");

  const resetToken = crypto.randomBytes(32).toString("hex");

  if (process.env.NODE_ENV !== "production") {
  console.log("RESET TOKEN:", resetToken);
}

  await prisma.passwordResetToken.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  console.log("Token berhasil disimpan");
}

    if (user) {
        await prisma.passwordResetToken.deleteMany({
         where: {
        userId: user.id,
     },
    });

      const resetToken = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
    data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
    },
    });

    console.log("RESET TOKEN:", resetToken);

    return NextResponse.json({
      message: "Jika email terdaftar, link reset password telah dikirim.",
    });

  } 
}
  catch (error) {
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