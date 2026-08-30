CREATE OR REPLACE FUNCTION public.place_order(
  p_customer_name text,
  p_phone text,
  p_email text,
  p_address text,
  p_city text,
  p_notes text,
  p_items jsonb
)
RETURNS TABLE (order_number text, total numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_priced jsonb := '[]'::jsonb;
  v_item jsonb;
  v_product record;
  v_subtotal numeric := 0;
  v_shipping numeric := 0;
  v_total numeric := 0;
  v_free_shipping_over numeric := 0;
  v_shipping_flat numeric := 0;
  v_order_number text;
BEGIN
  IF p_customer_name IS NULL OR length(trim(p_customer_name)) < 2 THEN
    RAISE EXCEPTION 'Please enter your full name.';
  END IF;
  IF p_phone IS NULL OR length(trim(p_phone)) < 7 THEN
    RAISE EXCEPTION 'Please enter a valid phone number.';
  END IF;
  IF p_address IS NULL OR length(trim(p_address)) < 6 THEN
    RAISE EXCEPTION 'Please enter a valid address.';
  END IF;
  IF p_city IS NULL OR length(trim(p_city)) < 2 THEN
    RAISE EXCEPTION 'Please enter a valid city.';
  END IF;
  IF p_items IS NULL OR jsonb_array_length(p_items) < 1 THEN
    RAISE EXCEPTION 'Your cart is empty.';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    SELECT id, name, price, sizes, in_stock, is_visible
      INTO v_product
      FROM public.products
      WHERE id = (v_item->>'productId')::uuid;

    IF NOT FOUND OR v_product.is_visible IS NOT TRUE OR v_product.in_stock IS NOT TRUE THEN
      RAISE EXCEPTION 'One of the items in your cart is no longer available.';
    END IF;

    IF NOT (v_item->>'size' = ANY(v_product.sizes)) THEN
      RAISE EXCEPTION 'Size % is not available for %.', (v_item->>'size'), v_product.name;
    END IF;

    v_subtotal := v_subtotal + (v_product.price * (v_item->>'quantity')::int);

    v_priced := v_priced || jsonb_build_object(
      'product_id', v_product.id,
      'name', v_product.name,
      'size', v_item->>'size',
      'quantity', (v_item->>'quantity')::int,
      'price', v_product.price,
      'line_total', v_product.price * (v_item->>'quantity')::int
    );
  END LOOP;

  v_shipping := CASE WHEN v_subtotal >= v_free_shipping_over THEN 0 ELSE v_shipping_flat END;
  v_total := v_subtotal + v_shipping;

  v_order_number := 'PF-' || upper(to_hex(floor(extract(epoch from clock_timestamp()) * 1000)::bigint))
                    || floor(random() * 900 + 100)::text;

  INSERT INTO public.orders (
    order_number, customer_name, phone, email, address, city, notes,
    items, subtotal, shipping, total
  ) VALUES (
    v_order_number, trim(p_customer_name), trim(p_phone),
    NULLIF(trim(coalesce(p_email, '')), ''),
    trim(p_address), trim(p_city),
    NULLIF(trim(coalesce(p_notes, '')), ''),
    v_priced, v_subtotal, v_shipping, v_total
  );

  RETURN QUERY SELECT v_order_number, v_total;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(text, text, text, text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order(text, text, text, text, text, text, jsonb) TO anon, authenticated;