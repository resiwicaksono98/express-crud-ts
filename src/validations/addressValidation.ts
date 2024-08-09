import { ZodType, z } from "zod";

export class AddressValidation {
  static readonly CREATE: ZodType = z.object({
    contact_id: z.string(),
    street: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    country: z.string().min(3),
    postal_code: z.string().min(3)
  });

  static readonly GET: ZodType = z.object({
    contact_id: z.string(),
    id: z.string()
  });

  static readonly REMOVE : ZodType = z.object({
    contact_id: z.string(),
    id: z.string(),
})

static readonly UPDATE : ZodType = z.object({
    id: z.string(),
    contact_id: z.string(),
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(10),
})
}
