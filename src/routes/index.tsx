import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { productsQuery } from "@/lib/products";
import { SITE } from "@/lib/site";
const modelPorsche = { url: "/products/model-porsche.webp" };
const modelCalligraphy = { url: "/products/model-calligraphy.webp" };


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PR!ME F!T — Premium Oversized Streetwear in Pakistan" },
      {
        name: "description",
        content:
          "PR!ME F!T drops premium 240 GSM oversized tees with bold front & back prints. Anime, racing and calligraphy graphics. Cash on delivery across Pakistan.",
      },
      { property: "og:title", content: "PR!ME F!T — Premium Wear" },
      {
        property: "og:description",
        content: "Premium oversized tees with bold front & back prints. Limited drops, shipped across Pakistan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const featured = products.filter((p) => p.featured).slice(0, 6);
  

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-block border border-primary px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-primary">
              New drop live
            </span>
            <h1 className="display text-5xl sm:text-6xl lg:text-7xl">
              Wear it <span className="text-primary">loud.</span>
              <br />
              Wear it <span className="text-accent">prime.</span>
            </h1>
            <p className="mx-auto max-w-md text-muted-foreground md:mx-0">
              Heavyweight 240 GSM oversized tees with full back prints. Made in limited runs — once
              a drop is gone, it's gone.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                to="/shop"
                className="display inline-flex items-center gap-2 bg-primary px-7 py-3 text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Shop the drop <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/about"
                className="display inline-flex items-center gap-2 border border-border px-7 py-3 transition-colors hover:border-primary hover:text-primary"
              >
                Our story
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg pb-16 pr-12 sm:pb-20 sm:pr-20">
            <div className="absolute inset-0 -z-10 blur-3xl" style={{ background: "radial-gradient(circle at 60% 40%, oklch(0.47 0.093 176 / 22%), transparent 65%)" }} />
            <img
              src={modelPorsche.url}
              alt="Model wearing the PR!ME F!T Porsche GT3 RS oversized tee"
              className="w-[78%] border border-border object-cover shadow-[12px_12px_0_0_var(--color-accent)]"
              loading="eager"
            />
            <img
              src={modelCalligraphy.url}
              alt="Model wearing the PR!ME F!T Arabic calligraphy oversized tee"
              className="absolute bottom-0 right-0 w-[62%] border border-border object-cover shadow-[12px_12px_0_0_var(--color-primary)]"
              loading="eager"
            />
          </div>

        </div>
      </section>


      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="display text-3xl sm:text-4xl">Featured drops</h2>
          <Link to="/shop" className="text-sm uppercase tracking-widest text-primary">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-secondary" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featured.length ? featured : products.slice(0, 6)).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-3">
          {[
            { icon: Sparkles, title: "240 GSM heavyweight", text: "Combed cotton, drop-shoulder oversized fit that holds shape." },
            { icon: Truck, title: "Nationwide delivery", text: "Cash on delivery all over Pakistan. Free shipping on every order." },
            { icon: ShieldCheck, title: "Print that lasts", text: "High-density prints that survive wash after wash." },
          ].map((f) => (
            <div key={f.title} className="space-y-2 text-center">
              <f.icon className="mx-auto size-6 text-primary" />
              <h3 className="display text-xl">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="display text-3xl sm:text-4xl">Questions before you order?</h2>
        <p className="mt-3 text-muted-foreground">
          Message us on WhatsApp at {SITE.whatsappNumber} or DM @{SITE.instagram} — we reply fast.
        </p>
        <Link
          to="/contact"
          className="display mt-6 inline-flex bg-accent px-7 py-3 text-accent-foreground transition-transform hover:-translate-y-0.5"
        >
          Contact us
        </Link>
      </section>
    </Layout>
  );
}
