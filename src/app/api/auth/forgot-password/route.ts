import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
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