import { z } from "zod";

export const createSessionSchema = z.object({
  templateId: z.string().optional(),
});

export const joinSessionSchema = z.object({
  code: z.string().length(6),
});

export const readySchema = z.object({
  sessionCode: z.string().length(6),
  ready: z.boolean(),
});

export const startSessionSchema = z.object({
  sessionCode: z.string().length(6),
});