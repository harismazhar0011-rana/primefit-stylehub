import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Store Admin — PR!ME F!T" },
      { name: "description", content: "Private admin area for managing PR!ME F!T products and orders." },
      { property: "og:title", content: "Store Admin — PR!ME F!T" },
      { property: "og:description", content: "Private admin area for the PR!ME F!T store." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="display text-4xl">Admin</h1>
        <p className="mt-3 text-muted-foreground">
          The product and order dashboard is coming next. Sign-in and management tools will live here.
        </p>
        <Link to="/shop" className="display mt-8 inline-flex bg-primary px-6 py-3 text-primary-foreground">
          Back to shop
        </Link>
      </section>
    </Layout>
  );
}
