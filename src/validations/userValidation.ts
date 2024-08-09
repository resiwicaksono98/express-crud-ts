import { ZodType, z } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(30),
    name: z.string().min(3).max(30),
    password: z.string().min(3).max(30)
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(3).max(30)
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(3).max(30).optional(),
    password: z.optional(z.string().min(3).max(30)).optional()
  });
}
