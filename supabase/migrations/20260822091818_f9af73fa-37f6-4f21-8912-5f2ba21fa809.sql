CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  compare_at_price numeric(10,2),
  category text NOT NULL DEFAULT 'Oversized Tee',
  colour text NOT NULL DEFAULT '',
  front_image text NOT NULL,
  back_image text,
  sizes text[] NOT NULL DEFAULT ARRAY['S','M','L','XL','XXL'],
  in_stock boolean NOT NULL DEFAULT true,
  is_visible boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible products" ON public.products
FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "Admins can view all products" ON public.products
FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can insert products" ON public.products
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update products" ON public.products
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete products" ON public.products
FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  city text NOT NULL,
  notes text,
  items jsonb NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view orders" ON public.orders
FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE SEQUENCE public.order_number_seq START 1001;
GRANT USAGE, SELECT ON SEQUENCE public.order_number_seq TO service_role;

INSERT INTO public.products (slug,name,description,price,compare_at_price,colour,front_image,back_image,featured,sort_order) VALUES
('gear-5-one-piece','GEAR 5 — ONE PIECE','Heavyweight oversized tee in deep cocoa brown. Minimal ONE PIECE chest hit, full Gear 5 Luffy print across the back. 240 GSM combed cotton, drop shoulder fit.',2499,3299,'Cocoa Brown','/__l5e/assets-v1/bba1c572-92db-4e43-be35-a3d193a0f253/image-2.png','/__l5e/assets-v1/c4dda6c1-1de7-402c-aa8b-9060a4faf1ef/image-3.png',true,1),
('ryujin-dragon','RYUJIN DRAGON','Jet black oversized tee with Japanese type on the front and a full red dragon-and-blade print on the back. Street-ready, boxy drop shoulder cut.',2499,3299,'Black','/__l5e/assets-v1/98d0a1e6-2a01-4686-ba44-e05405dd3172/image-4.png','/__l5e/assets-v1/1c9a5a11-007f-4742-8536-5a1080e7ecb2/image-5.png',true,2),
('arabic-calligraphy','ARABIC CALLIGRAPHY','Clean black tee with white Arabic calligraphy on the chest and a full ornamental paisley border print on the back. Premium soft-hand print.',2499,3299,'Black','/__l5e/assets-v1/847f378b-5179-441c-acc5-3e7c7e4e8480/image-6.png','/__l5e/assets-v1/af31217c-9ce5-462a-8597-c9e2a026c3ef/image-7.png',true,3),
('schumacher-legacy','SCHUMACHER LEGACY','Ice blue racing tee. Michael Schumacher signature on the chest, full team graphics across the back. For the F1 purists.',2699,3499,'Ice Blue','/__l5e/assets-v1/f6538776-516f-42ff-9a82-1bcdd0492942/image-8.png','/__l5e/assets-v1/1486bb85-af4c-4225-820d-f34abd74833e/image-9.png',true,4),
('never-look-back','NEVER LOOK BACK','Faded black oversized tee. Small PF chest mark, oversized NEVER LOOK BACK typography on the back. Everyday statement piece.',2299,2999,'Washed Black','/__l5e/assets-v1/c4d6a462-99b1-4efa-83bb-580e63185e35/image-10.png','/__l5e/assets-v1/7ac6ef1a-050a-49eb-94f2-aead852e5b88/image-11.png',false,5),
('porsche-gt3-rs','PORSCHE GT3 RS','Fog grey oversized tee with GT3 RS chest print and a full spec-sheet back graphic. Built for garage days.',2699,3499,'Fog Grey','/__l5e/assets-v1/9f71470e-ba5b-4f33-964e-e7b1bc509f3f/image-12.png','/__l5e/assets-v1/ea1a1f87-e138-4ceb-b30b-d05e8828764e/image-13.png',true,6),
('sun-god-nika','SUN GOD NIKA','Navy oversized tee. Micro SUN GOD chest print, full Nika Luffy back print in signature red. 240 GSM combed cotton.',2499,3299,'Navy','/__l5e/assets-v1/ef9b0805-f9df-4276-b295-e87f557a8b73/image-14.png','/__l5e/assets-v1/579f36c5-80c2-47e3-9ea3-e7cf4012c543/image-15.png',false,7);