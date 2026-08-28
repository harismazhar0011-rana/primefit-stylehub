import { Link } from "@tanstack/react-router";
import { formatPKR } from "@/lib/site";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/shop/$slug"
      params={{ slug: product.slug }}
      className="group block overflow-hidden border border-border bg-card transition-colors hover:border-primary"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.front_image}
          alt={`${product.name} front view`}
          loading="lazy"
          className="size-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {product.back_image && (
          <img
            src={product.back_image}
            alt={`${product.name} back view`}
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {!product.in_stock && (
          <span className="absolute left-3 top-3 bg-background/90 px-2 py-1 text-[11px] uppercase tracking-widest">
            Sold out
          </span>
        )}
        {product.featured && product.in_stock && (
          <span className="absolute left-3 top-3 bg-primary px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
            Hot
          </span>
        )}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="display text-lg">{product.name}</h3>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.colour}</p>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-semibold">{formatPKR(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
