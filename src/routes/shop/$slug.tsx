import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/site/Layout";
import { productQuery } from "@/lib/products";
import { formatPKR, SITE } from "@/lib/site";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/shop/$slug")({
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${name} — PR!ME F!T Oversized Tee` },
        {
          name: "description",
          content: `${name} — premium 240 GSM oversized tee by PR!ME F!T with full back print. Cash on delivery across Pakistan.`,
        },
        { property: "og:title", content: `${name} — PR!ME F!T` },
        {
          property: "og:description",
          content: `${name}: heavyweight oversized fit, bold front and back print.`,
        },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = useParams({ from: "/shop/$slug" });
  const { data: product, isLoading } = useQuery(productQuery(slug));
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [view, setView] = useState<"front" | "back">("front");

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="aspect-square max-w-lg animate-pulse bg-secondary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="display text-4xl">Product not found</h1>
          <Link to="/shop" className="display mt-6 inline-flex bg-primary px-6 py-3 text-primary-foreground">
            Back to shop
          </Link>
        </div>
      </Layout>
    );
  }

  const image = view === "back" && product.back_image ? product.back_image : product.front_image;

  return (
    <Layout>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <img
            src={image}
            alt={`${product.name} ${view} view`}
            className="aspect-square w-full border border-border object-cover"
          />
          <div className="flex gap-3">
            {(["front", "back"] as const)
              .filter((v) => v === "front" || product.back_image)
              .map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`size-20 border ${view === v ? "border-primary" : "border-border"}`}
                  aria-label={`Show ${v} view`}
                >
                  <img
                    src={v === "back" ? (product.back_image ?? product.front_image) : product.front_image}
                    alt={`${product.name} ${v} thumbnail`}
                    className="size-full object-cover"
                  />
                </button>
              ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="display text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              {product.colour}
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="display text-3xl text-primary">{formatPKR(product.price)}</span>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest">Select size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`display min-w-14 border px-4 py-2 text-sm tracking-widest transition-colors ${
                    size === s ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!product.in_stock}
            onClick={() => {
              if (!size) {
                toast.error("Pick a size first");
                return;
              }
              add({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.front_image,
                price: product.price,
                size,
                quantity: 1,
              });
              toast.success(`${product.name} (${size}) added to cart`);
            }}
            className="display w-full bg-primary px-8 py-4 text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {product.in_stock ? "Add to cart" : "Sold out"}
          </button>

          <ul className="space-y-1 border-t border-border pt-6 text-sm text-muted-foreground">
            <li>240 GSM heavyweight combed cotton, oversized drop-shoulder fit</li>
            <li>Cash on delivery all over Pakistan</li>
            <li>Free shipping over {formatPKR(SITE.freeShippingOver)}</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
