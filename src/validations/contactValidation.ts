import { z, ZodType } from "zod";

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(3).max(30),
    last_name: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(8).max(20).optional()
  });
  static readonly UPDATE: ZodType = z.object({
    id: z.string(),
    first_name: z.string().min(3).max(30),
    last_name: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(8).max(20).optional()
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    page: z.number().min(1).positive(),
    perPage: z.number().min(1).max(100).positive()
  })
}
