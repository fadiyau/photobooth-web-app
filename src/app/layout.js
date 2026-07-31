import "./globals.css";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt"; // <--- Import fungsi verify JWT kamu
import { prisma } from "@/lib/prisma";   // <--- Import prisma jika butuh data user lengkap

export const metadata = {
  title: "OnlinePhotobooth",
  description: "Online Photobooth Application",
};

async function getAuthStatus() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { isLoggedIn: false, user: null };
    }

    // 1. Verifikasi JWT langsung di Server
    const decoded = verifyToken(token); 

    if (!decoded) {
      return { isLoggedIn: false, user: null };
    }

    // 2. Ambil data user segar dari database via Prisma
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return { isLoggedIn: false, user: null };
    }

    return {
      isLoggedIn: true,
      user,
    };
  } catch (error) {
    console.error("Error verifying auth status:", error);
    return { isLoggedIn: false, user: null };
  }
}

export default async function RootLayout({ children }) {
  const { isLoggedIn, user } = await getAuthStatus();

  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar user={user} isLoggedIn={isLoggedIn} />
        <main>{children}</main>
      </body>
    </html>
  );
}