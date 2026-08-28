export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  colour: string;
  front_image: string;
  back_image: string | null;
  sizes: string[];
  in_stock: boolean;
  is_visible: boolean;
  featured: boolean;
  sort_order: number;
  created_at?: string;
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
};

export type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  notes: string | null;
  items: Array<{ name: string; size: string; quantity: number; price: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at: string;
};
