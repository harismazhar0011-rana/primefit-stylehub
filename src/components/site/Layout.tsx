import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

const TICKER_ITEMS = [
  "PR!ME F!T • PREMIUM WEAR",
  "FRONT & BACK PRINTS",
  "CASH ON DELIVERY",
  "FREE DELIVERY ALL OVER PAKISTAN",
  "LIMITED DROPS — ONCE GONE, GONE",
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Marquee items={TICKER_ITEMS} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 1500);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <div className="relative overflow-hidden bg-ticker py-3 text-ticker-foreground">
      <div
        key={index}
        className="display text-center text-sm tracking-[0.25em] animate-fade-in"
      >
        {items[index]}
      </div>
    </div>
  );
}
