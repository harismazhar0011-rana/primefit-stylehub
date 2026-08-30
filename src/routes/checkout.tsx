import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";
import { placeOrder } from "@/lib/orders";
import { formatPKR, SITE } from "@/lib/site";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — PR!ME F!T Cash on Delivery" },
      {
        name: "description",
        content: "Place your PR!ME F!T order with cash on delivery. Nationwide shipping across Pakistan.",
      },
      { property: "og:title", content: "Checkout — PR!ME F!T" },
      { property: "og:description", content: "Complete your PR!ME F!T order with cash on delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

const field = "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Checkout() {
  const { lines, subtotal, clear, hydrated } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ orderNumber: string; total: number } | null>(null);

  const shipping = subtotal >= SITE.freeShippingOver ? 0 : SITE.shippingFlat;

  if (done) {
    return (
      <Layout>
        <section className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="display text-4xl">Order confirmed</h1>
          <p className="mt-3 text-muted-foreground">
            Order <span className="text-primary">{done.orderNumber}</span> — {formatPKR(done.total)}.
            We'll call you shortly to confirm delivery.
          </p>
          <Link to="/shop" className="display mt-8 inline-flex bg-primary px-6 py-3 text-primary-foreground">
            Keep shopping
          </Link>
        </section>
      </Layout>
    );
  }

  if (hydrated && lines.length === 0) {
    return (
      <Layout>
        <section className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="display text-4xl">Nothing to checkout</h1>
          <Link to="/shop" className="display mt-6 inline-flex bg-primary px-6 py-3 text-primary-foreground">
            Shop the drop
          </Link>
        </section>
      </Layout>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const result = await placeOrder({
        customerName: String(form.get("customerName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        address: String(form.get("address") ?? ""),
        city: String(form.get("city") ?? ""),
        notes: String(form.get("notes") ?? ""),
        items: lines.map((l) => ({
          productId: l.productId,
          size: l.size,
          quantity: l.quantity,
          name: l.name,
          price: l.price,
        })),
      });
      clear();
      setDone({ orderNumber: result.orderNumber, total: result.total });
      window.open(result.whatsappUrl, "_blank", "noopener");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place the order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="display text-4xl">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">Cash on delivery all over Pakistan.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="customerName" className="text-xs uppercase tracking-widest">Full name</label>
              <input id="customerName" name="customerName" required minLength={2} className={field} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="text-xs uppercase tracking-widest">Phone</label>
                <input id="phone" name="phone" required minLength={7} className={field} />
              </div>
              <div>
                <label htmlFor="email" className="text-xs uppercase tracking-widest">Email (optional)</label>
                <input id="email" name="email" type="email" className={field} />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="text-xs uppercase tracking-widest">Address</label>
              <input id="address" name="address" required minLength={6} className={field} />
            </div>
            <div>
              <label htmlFor="city" className="text-xs uppercase tracking-widest">City</label>
              <input id="city" name="city" required minLength={2} className={field} />
            </div>
            <div>
              <label htmlFor="notes" className="text-xs uppercase tracking-widest">Notes (optional)</label>
              <textarea id="notes" name="notes" rows={3} className={field} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="display w-full bg-primary px-8 py-4 text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Placing order…" : "Place order"}
            </button>
          </form>
        </div>

        <aside className="h-fit border border-border bg-card p-5">
          <h2 className="display text-xl">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.size}`} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {l.name} ({l.size}) x{l.quantity}
                </span>
                <span>{formatPKR(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPKR(subtotal + shipping)}</span>
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  );
}
