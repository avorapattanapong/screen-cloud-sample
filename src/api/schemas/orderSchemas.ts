import {z} from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const verifyOrderBodySchema = z.object({
  quantity: z.number().int().min(1),
  shippingLat: z.number().refine((lat) => lat >= -90 && lat <= 90, {
    message: "Latitude must be between -90 and 90",
  }),
  shippingLng: z.number().refine((lng) => lng >= -180 && lng <= 180, {
    message: "Longitude must be between -180 and 180",
  }),
});
export const verifyOrderBodyJsonSchema = zodToJsonSchema(verifyOrderBodySchema);
export type VerifyOrderBody = z.infer<typeof verifyOrderBodySchema>;

export const createOrderBodySchema = z.object({
  email: z.string().email(),
  quantity: z.number().int().min(1),
  shippingLat: z.number().refine((lat) => lat >= -90 && lat <= 90, {
    message: "Latitude must be between -90 and 90",
  }),
  shippingLng: z.number().refine((lng) => lng >= -180 && lng <= 180, {
    message: "Longitude must be between -180 and 180",
  }),
});
export const createOrderBodyJsonSchema = zodToJsonSchema(createOrderBodySchema);
export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;
