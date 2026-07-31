import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/bcrypt";
import { registerSchema } from "@/lib/validation";
<<<<<<< HEAD
import {
  sendWelcomeEmail,
  sendOtpVerificationEmail,
} from "@/lib/email";
=======
>>>>>>> dev

export async function POST(req: Request) {
  try {
    const body = await req.json();

<<<<<<< HEAD
    // =========================
    // VALIDASI INPUT
    // =========================
=======
    console.log(body);

    // Validasi input
>>>>>>> dev
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

<<<<<<< HEAD
    const {
      username,
      name,
      email,
      password,
    } = parsed.data;

    // =========================
    // CEK USERNAME
    // =========================
    const usernameExist =
      await prisma.user.findUnique({
        where: {
          username,
        },
      });
=======
    const { username, name, email, password } = parsed.data;

    // Cek username
    const usernameExist = await prisma.user.findUnique({
      where: {
        username,
      },
    });
>>>>>>> dev

    if (usernameExist) {
      return NextResponse.json(
        {
          message: "Username sudah digunakan",
        },
        { status: 409 }
      );
    }

<<<<<<< HEAD
    // =========================
    // CEK EMAIL
    // =========================
    const emailExist =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });
=======
    // Cek email
    const emailExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
>>>>>>> dev

    if (emailExist) {
      return NextResponse.json(
        {
          message: "Email sudah digunakan",
        },
        { status: 409 }
      );
    }

<<<<<<< HEAD
    // =========================
    // HASH PASSWORD
    // =========================
    const hashedPassword =
      await hashPassword(password);

    // =========================
    // CREATE USER
    // =========================
    const user = await prisma.user.create({
      data: {
=======
    // Hash password
    const hashedPassword = await hashPassword(password);

    // Simpan user
    const user = await prisma.user.create({
    data: {
>>>>>>> dev
        username,
        name,
        email,
        password: hashedPassword,
<<<<<<< HEAD
        emailVerified: false,
      },
      select: {
=======
  },
    select: {
>>>>>>> dev
        id: true,
        username: true,
        name: true,
        email: true,
        provider: true,
        avatar: true,
        role: true,
<<<<<<< HEAD
        emailVerified: true,
        createdAt: true,
      },
    });

    // =========================
    // GENERATE OTP
    // =========================
    const otp = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    // =========================
    // SIMPAN OTP
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
    // KIRIM OTP EMAIL
    // =========================
    try {
      await sendOtpVerificationEmail(
        user.email,
        user.name,
        otp
      );
    } catch (emailError) {
      console.error(
        "Gagal mengirim OTP:",
        emailError
      );
    }

    // =========================
    // KIRIM WELCOME EMAIL
    // =========================
    try {
      await sendWelcomeEmail(
        user.email,
        user.name
      );
    } catch (emailError) {
      console.error(
        "Gagal mengirim welcome email:",
        emailError
      );
    }

    // =========================
    // RESPONSE
    // =========================
    return NextResponse.json(
      {
        message:
          "Register berhasil. Silakan verifikasi email kamu.",
        user,
        emailVerified: false,
        requiresVerification: true,
=======
        createdAt: true,
  },
});

    return NextResponse.json(
      {
        message: "Register berhasil",
        user,
>>>>>>> dev
      },
      { status: 201 }
    );
  } catch (error) {
<<<<<<< HEAD
    console.error(
      "REGISTER ERROR:",
      error
    );
=======
    console.error(error);
>>>>>>> dev

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
<<<<<<< HEAD
      {
        status: 500,
      }
=======
      { status: 500 }
>>>>>>> dev
    );
  }
}