import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";
import { formatPKR, SITE } from "@/lib/site";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — PR!ME F!T" },
      {
        name: "description",
        content: "Review the PR!ME F!T oversized tees in your cart and checkout with cash on delivery.",
      },
      { property: "og:title", content: "Your Cart — PR!ME F!T" },
      { property: "og:description", content: "Review your PR!ME F!T order before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, setQuantity, remove, hydrated } = useCart();
  const shipping = subtotal === 0 || subtotal >= SITE.freeShippingOver ? 0 : SITE.shippingFlat;

  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="display text-4xl sm:text-5xl">Your cart</h1>

        {!hydrated ? null : lines.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/shop" className="display mt-6 inline-flex bg-primary px-6 py-3 text-primary-foreground">
              Shop the drop
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {lines.map((l) => (
                <li key={`${l.productId}-${l.size}`} className="flex gap-4 py-4">
                  <img src={l.image} alt={l.name} className="size-24 border border-border object-cover" />
                  <div className="flex-1">
                    <h2 className="display text-lg">{l.name}</h2>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Size {l.size}</p>
                    <p className="mt-1 text-sm">{formatPKR(l.price)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={l.quantity}
                        onChange={(e) => setQuantity(l.productId, l.size, Number(e.target.value))}
                        className="w-16 border border-border bg-background px-2 py-1 text-sm"
                        aria-label={`Quantity for ${l.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => remove(l.productId, l.size)}
                        className="text-muted-foreground transition-colors hover:text-primary"
                        aria-label={`Remove ${l.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="font-semibold">{formatPKR(l.price * l.quantity)}</div>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-lg font-semibold">
                <span>Total</span>
                <span>{formatPKR(subtotal + shipping)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="display mt-8 inline-flex w-full justify-center bg-primary px-8 py-4 text-primary-foreground"
            >
              Checkout
            </Link>
          </>
        )}
      </section>
    </Layout>
  );
}
