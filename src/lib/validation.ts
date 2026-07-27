import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Format email tidak valid"),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});