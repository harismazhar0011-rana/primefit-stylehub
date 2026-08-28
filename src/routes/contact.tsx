import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact PR!ME F!T — WhatsApp, Instagram & Email" },
      {
        name: "description",
        content:
          "Reach PR!ME F!T on WhatsApp +92 332 4692958, Instagram @primefit.storeee or email primefit.storee@gmail.com for orders and support.",
      },
      { property: "og:title", content: "Contact PR!ME F!T" },
      { property: "og:description", content: "WhatsApp, Instagram and email support for your order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const items = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: SITE.whatsappNumber,
      href: whatsappLink(`Hi ${SITE.brand}! I have a question about an order.`),
    },
    { icon: Instagram, label: "Instagram", value: `@${SITE.instagram}`, href: SITE.instagramUrl },
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  ];

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="display text-4xl sm:text-5xl">Talk to us</h1>
        <p className="mt-3 text-muted-foreground">
          Sizing help, order status, bulk orders — we reply fast.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {items.map((i) => (
            <a
              key={i.label}
              href={i.href}
              target="_blank"
              rel="noreferrer noopener"
              className="border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <i.icon className="size-5 text-primary" />
              <p className="display mt-3 text-lg">{i.label}</p>
              <p className="break-words text-sm text-muted-foreground">{i.value}</p>
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}
