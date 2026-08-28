import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lineSchema = z.object({
  productId: z.string().uuid(),
  size: z.string().min(1).max(8),
  quantity: z.number().int().min(1).max(20),
});

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(25),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  address: z.string().trim().min(6).max(300),
  city: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  items: z.array(lineSchema).min(1).max(30),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { createOrder } = await import("./orders.server");
    return createOrder({
      customerName: data.customerName,
      phone: data.phone,
      email: data.email ? data.email : undefined,
      address: data.address,
      city: data.city,
      notes: data.notes ? data.notes : undefined,
      items: data.items,
    });
  });
