import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { productsQuery } from "@/lib/products";

const COLLECTIONS: Record<string, string[]> = {
  anime: [
    "gear-5-one-piece",
    "ryujin-dragon",
    "sun-god-nika",
    "behind",
  ],
  racing: ["schumacher-legacy", "porsche-gt3-rs"],
  calligraphy: ["arabic-calligraphy", "cream-calligraphy-rug"],
};

const COLLECTION_TITLES: Record<string, string> = {
  anime: "Anime Collection",
  racing: "Racing Collection",
  calligraphy: "Calligraphy",
};

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop All Drops — PR!ME F!T Oversized Tees" },
      {
        name: "description",
        content:
          "Browse every PR!ME F!T drop: 240 GSM oversized tees with bold front and back prints. Cash on delivery across Pakistan.",
      },
      { property: "og:title", content: "Shop All Drops — PR!ME F!T" },
      {
        property: "og:description",
        content: "Every PR!ME F!T oversized tee in one place. Limited runs, premium heavyweight cotton.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const search = useSearch({ from: "/shop/" }) as { collection?: string };
  const collection = search.collection?.toLowerCase();
  const slugs = collection ? COLLECTIONS[collection] : null;
  const title = collection ? COLLECTION_TITLES[collection] ?? collection : "The Drops";

  const { data: products = [], isLoading } = useQuery(productsQuery);

  const filtered = slugs
    ? products.filter((p) => slugs.includes(p.slug))
    : products;

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="display text-4xl sm:text-5xl">{title}</h1>
          {collection && (
            <Link
              to="/shop"
              className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              View all drops
            </Link>
          )}
        </div>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Heavyweight oversized tees, printed front and back. Limited quantities per design.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse bg-secondary" />
              ))
            : filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {!isLoading && filtered.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            No products in this collection yet.
          </p>
        )}
      </section>
    </Layout>
  );
}
