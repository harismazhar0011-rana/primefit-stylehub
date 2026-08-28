import { Link } from "@tanstack/react-router";
import { ChevronRight, Instagram, Mail, Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE, whatsappLink } from "@/lib/site";
import { useCart } from "@/lib/cart";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

type MenuItem = { to: string; label: string; arrow?: boolean };

const MENU: MenuItem[] = [
  { to: "/shop", label: "New Releases" },
  { to: "/shop", label: "Best Sellers" },
  { to: "/shop", label: "Shop All Tees", arrow: true },
  { to: "/shop?collection=anime", label: "Anime Collection", arrow: true },
  { to: "/shop?collection=racing", label: "Racing Collection", arrow: true },
  { to: "/shop?collection=calligraphy", label: "Calligraphy" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center px-4 py-3">
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Open menu"
            className="p-2 transition-colors hover:text-primary"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          {NAV.slice(0, 2).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="display hidden text-sm tracking-widest text-muted-foreground transition-colors hover:text-primary md:inline"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          to="/"
          className="display flex flex-col items-center justify-center gap-1"
        >
          <span className="whitespace-nowrap text-2xl tracking-tight md:text-4xl">{SITE.brand}</span>
        </Link>

        <div className="flex items-center justify-end gap-6">
          {NAV.slice(2).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="display hidden text-sm tracking-widest text-muted-foreground transition-colors hover:text-primary md:inline"
            >
              {item.label}
            </Link>
          ))}

          <Link to="/cart" className="relative p-2" aria-label="Cart">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-accent/50"
            onClick={() => setOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-md flex-col bg-card shadow-2xl">
            <div className="px-5 py-5">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-1 transition-colors hover:text-primary"
              >
                <X className="size-7" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5">
              {MENU.map((item, i) => (
                <Link
                  key={`${item.label}-${i}`}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-border py-5 text-sm uppercase tracking-[0.2em] transition-colors hover:text-primary"
                >
                  <span>{item.label}</span>
                  {"arrow" in item && item.arrow ? <ChevronRight className="size-4" /> : null}
                </Link>
              ))}
            </nav>

            <div className="space-y-3 px-5 py-6 text-sm">
              <a
                href={whatsappLink(`Hi ${SITE.brand}! I have a question.`)}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 uppercase tracking-widest transition-colors hover:text-primary"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 uppercase tracking-widest transition-colors hover:text-primary"
              >
                <Instagram className="size-4" /> Instagram
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 uppercase tracking-widest transition-colors hover:text-primary"
              >
                <Mail className="size-4" /> Email us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
