import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PR!ME F!T — Premium Streetwear Pakistan" },
      {
        name: "description",
        content:
          "PR!ME F!T is a Pakistani streetwear label making 240 GSM oversized tees in limited runs with bold front and back prints.",
      },
      { property: "og:title", content: "About PR!ME F!T" },
      {
        property: "og:description",
        content: "A Pakistani streetwear label built on heavyweight cotton and limited drops.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="display text-4xl sm:text-6xl">Built loud. Made to last.</h1>
        <div className="mt-8 space-y-5 text-muted-foreground">
          <p>
            {SITE.brand} started with a simple idea: streetwear in Pakistan shouldn't feel like a
            compromise. Every piece we release is heavyweight 240 GSM combed cotton with an oversized
            drop-shoulder fit that keeps its shape after wash after wash.
          </p>
          <p>
            We print big — full back graphics, high-density inks, no shortcuts. Anime, racing legends
            and calligraphy: the designs we personally want to wear.
          </p>
          <p>
            We produce in small, limited runs. When a drop sells out, it's gone. That keeps the
            quality tight and the pieces rare.
          </p>
        </div>
        <Link to="/shop" className="display mt-10 inline-flex bg-primary px-7 py-3 text-primary-foreground">
          See the drops
        </Link>
      </section>
      
    </Layout>
  );
}
