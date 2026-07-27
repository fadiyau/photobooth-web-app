import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/bcrypt";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(body);

    // Validasi input
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

    const { username, name, email, password } = parsed.data;

    // Cek username
    const usernameExist = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (usernameExist) {
      return NextResponse.json(
        {
          message: "Username sudah digunakan",
        },
        { status: 409 }
      );
    }

    // Cek email
    const emailExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailExist) {
      return NextResponse.json(
        {
          message: "Email sudah digunakan",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Simpan user
    const user = await prisma.user.create({
    data: {
        username,
        name,
        email,
        password: hashedPassword,
  },
    select: {
        id: true,
        username: true,
        name: true,
        email: true,
        provider: true,
        avatar: true,
        role: true,
        createdAt: true,
  },
});

    return NextResponse.json(
      {
        message: "Register berhasil",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}