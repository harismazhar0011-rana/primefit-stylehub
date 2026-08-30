import { supabase } from "@/integrations/supabase/client";
import { SITE } from "./site";

export type IncomingLine = {
  productId: string;
  size: string;
  quantity: number;
  name: string;
  price: number;
};

export type PlaceOrderInput = {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
  items: IncomingLine[];
};

export async function placeOrder(input: PlaceOrderInput) {
  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: input.customerName,
    p_phone: input.phone,
    p_email: input.email ?? "",
    p_address: input.address,
    p_city: input.city,
    p_notes: input.notes ?? "",
    p_items: input.items.map((i) => ({
      productId: i.productId,
      size: i.size,
      quantity: i.quantity,
    })),
  });

  if (error) {
    throw new Error(
      error.message?.replace(/^.*?:\s*/, "") ||
        "We couldn't save your order. Please try again or message us on WhatsApp.",
    );
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    throw new Error("We couldn't save your order. Please try again or message us on WhatsApp.");
  }

  const orderNumber = row.order_number as string;
  const total = Number(row.total);
  const subtotal = input.items.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const shipping = total - subtotal;

  const lines = input.items
    .map(
      (l) =>
        `• ${l.name} (${l.size}) x${l.quantity} — Rs ${(l.price * l.quantity).toLocaleString("en-PK")}`,
    )
    .join("\n");

  const message = [
    `*NEW ORDER — ${SITE.brand}*`,
    `Order: ${orderNumber}`,
    "",
    lines,
    "",
    `Subtotal: Rs ${subtotal.toLocaleString("en-PK")}`,
    `Shipping: Rs ${shipping.toLocaleString("en-PK")}`,
    `TOTAL: Rs ${total.toLocaleString("en-PK")}`,
    "",
    `Name: ${input.customerName}`,
    `Phone: ${input.phone}`,
    input.email ? `Email: ${input.email}` : null,
    `Address: ${input.address}, ${input.city}`,
    input.notes ? `Notes: ${input.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    orderNumber,
    total,
    subtotal,
    shipping,
    whatsappUrl: `https://wa.me/${SITE.whatsappDigits}?text=${encodeURIComponent(message)}`,
  };
}
