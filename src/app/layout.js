import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper"; // <--- Import Wrapper baru
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

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

    const decoded = verifyToken(token); 

    if (!decoded) {
      return { isLoggedIn: false, user: null };
    }

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
      <body className="antialiased no-scrollbar">
        {/* Gunakan NavbarWrapper di sini */}
        <NavbarWrapper user={user} isLoggedIn={isLoggedIn} />
        <main>{children}</main>
      </body>
    </html>
  );
}