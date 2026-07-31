import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

type JwtPayload = {
  id: string;
  email: string;
  role: string;
};

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token) as JwtPayload;

    if (!decoded?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        provider: true,
        avatar: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);

    return null;
  }
}