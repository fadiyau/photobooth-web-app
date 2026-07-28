import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type JwtPayload = {
  id: string;
  email: string;
  role: string;
};

export async function getUserId() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    console.log(payload);

    return payload.id;
  } catch (err) {
    console.error(err);
    return null;
  }
}