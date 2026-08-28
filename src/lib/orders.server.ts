import { SITE } from "./site";

export type IncomingLine = { productId: string; size: string; quantity: number };

export type PlaceOrderInput = {
  customerName: string;
  phone: string;
  email?: string | undefined;
  address: string;
  city: string;
  notes?: string | undefined;
  items: IncomingLine[];
};

export async function createOrder(input: PlaceOrderInput) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const ids = [...new Set(input.items.map((i) => i.productId))];
  const { data: products, error: productError } = await supabaseAdmin
    .from("products")
    .select("id, name, price, sizes, in_stock, is_visible")
    .in("id", ids);

  if (productError) {
    console.error("[order] product lookup failed", productError.message);
    throw new Error("Could not verify the products in your cart. Please try again.");
  }

  const priced = input.items.map((line) => {
    const product = products?.find((p) => p.id === line.productId);
    if (!product || !product.is_visible || !product.in_stock) {
      throw new Error("One of the items in your cart is no longer available.");
    }
    if (!product.sizes.includes(line.size)) {
      throw new Error(`Size ${line.size} is not available for ${product.name}.`);
    }
    return {
      product_id: product.id,
      name: product.name,
      size: line.size,
      quantity: line.quantity,
      price: Number(product.price),
      line_total: Number(product.price) * line.quantity,
    };
  });

  const subtotal = priced.reduce((sum, l) => sum + l.line_total, 0);
  const shipping = subtotal >= SITE.freeShippingOver ? 0 : SITE.shippingFlat;
  const total = subtotal + shipping;

  const orderNumber = `${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number: `PF-${orderNumber}`,
      customer_name: input.customerName,
      phone: input.phone,
      email: input.email ?? null,
      address: input.address,
      city: input.city,
      notes: input.notes ?? null,
      items: priced,
      subtotal,
      shipping,
      total,
    })
    .select("order_number, total")
    .single();

  if (error || !order) {
    console.error("[order] insert failed", error?.message);
    throw new Error("We couldn't save your order. Please try again or message us on WhatsApp.");
  }

  const lines = priced
    .map((l) => `• ${l.name} (${l.size}) x${l.quantity} — Rs ${l.line_total.toLocaleString("en-PK")}`)
    .join("\n");

  const message = [
    `*NEW ORDER — ${SITE.brand}*`,
    `Order: ${order.order_number}`,
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
    orderNumber: order.order_number,
    total,
    subtotal,
    shipping,
    whatsappUrl: `https://wa.me/${SITE.whatsappDigits}?text=${encodeURIComponent(message)}`,
  };
}
