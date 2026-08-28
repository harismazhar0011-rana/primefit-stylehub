import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-14 text-center">
        <span className="display text-5xl tracking-tight">{SITE.brand}</span>
        <p className="max-w-md text-sm text-muted-foreground">
          Premium oversized streetwear, printed in limited drops. Cash on delivery across Pakistan.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={whatsappLink(`Hi ${SITE.brand}! I have a question.`)}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
          >
            <MessageCircle className="size-4" /> {SITE.whatsappNumber}
          </a>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
          >
            <Instagram className="size-4" /> @{SITE.instagram}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
          >
            <Mail className="size-4" /> {SITE.email}
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin">Store admin</Link>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.brand}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
