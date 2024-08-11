import { z } from "zod";

const optionSchema = z.object({
  disable: z.boolean().optional(),
  label: z.string(),
  value: z.string(),
});

export const funModeSchema = z.object({
  tags: z.array(optionSchema).min(1),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  fileKey: z.array(z.string()).min(1).optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  platform: z.string().optional(),
  scammerInfo: z.string().optional(),
});

export type FunModeSchema = z.infer<typeof funModeSchema>;
