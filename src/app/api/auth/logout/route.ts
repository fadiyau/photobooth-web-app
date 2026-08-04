import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout berhasil",
  });

  // Pastikan atribut disesuaikan dengan opsi cookie saat login
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // Menghapus cookie dengan mengatur tanggal ke masa lalu
  });

  return response;
}