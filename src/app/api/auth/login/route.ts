import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/bcrypt";
import { loginSchema } from "@/lib/validation";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

<<<<<<< HEAD
    // =========================
    // VALIDASI INPUT
    // =========================
=======
>>>>>>> dev
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Input tidak valid",
<<<<<<< HEAD
          errors: parsed.error.flatten(),
=======
>>>>>>> dev
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

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

    if (!user) {
      return NextResponse.json(
        {
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

<<<<<<< HEAD
    // =========================
    // GOOGLE USER
    // =========================
=======
>>>>>>> dev
    if (!user.password) {
      return NextResponse.json(
        {
          message: "Silakan login menggunakan Google",
        },
        { status: 401 }
      );
    }

<<<<<<< HEAD
    // =========================
    // CEK EMAIL VERIFIED
    // =========================
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          message: "Email belum diverifikasi",
          emailVerified: false,
        },
        { status: 403 }
      );
    }

    // =========================
    // CEK PASSWORD
    // =========================
=======
>>>>>>> dev
    const valid = await comparePassword(
      password,
      user.password
    );

    if (!valid) {
      return NextResponse.json(
        {
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

<<<<<<< HEAD
    // =========================
    // BUAT JWT
    // =========================
=======
>>>>>>> dev
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

<<<<<<< HEAD
    // =========================
    // RESPONSE
    // =========================
=======
>>>>>>> dev
    const response = NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
<<<<<<< HEAD
        emailVerified: user.emailVerified,
      },
    });

    // =========================
    // SET COOKIE
    // =========================
=======
      },
    });

>>>>>>> dev
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
<<<<<<< HEAD
  } catch (error) {
    console.error("LOGIN ERROR:", error);
=======
  } catch (err) {
    console.error(err);
>>>>>>> dev

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