import { z } from "zod";

const optionSchema = z.object({
  disable: z.boolean().optional(),
  label: z.string(),
  value: z.string(),
});

export const basicFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  phoneNumber: z.string().length(13).startsWith("601").trim(),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(160, {
      message: "Description must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Enter a valid email.",
    })
    .email(),
  favourite: z.string({
    required_error: "Please choose one.",
  }),
});

export type BasicFormSchema = z.infer<typeof basicFormSchema>;
