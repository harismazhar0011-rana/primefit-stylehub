import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./types";

function normalize(row: Record<string, unknown>): Product {
  return {
    ...(row as unknown as Product),
    price: Number(row["price"]),
    compare_at_price: row["compare_at_price"] == null ? null : Number(row["compare_at_price"]),
  };
}

export const productsQuery = queryOptions({
  queryKey: ["products", "public"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(normalize);
  },
});

export const adminProductsQuery = queryOptions({
  queryKey: ["products", "admin"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(normalize);
  },
});

export function productQuery(slug: string) {
  return queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_visible", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? normalize(data) : null;
    },
  });
}
