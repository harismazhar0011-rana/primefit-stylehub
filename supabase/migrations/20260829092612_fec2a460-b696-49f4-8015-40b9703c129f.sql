UPDATE public.products
SET front_image = CASE WHEN front_image LIKE '/__l5e/%' THEN '/products/' || regexp_replace(split_part(front_image, '/', 5), '\.png$', '.webp') ELSE front_image END,
    back_image  = CASE WHEN back_image  LIKE '/__l5e/%' THEN '/products/' || regexp_replace(split_part(back_image,  '/', 5), '\.png$', '.webp') ELSE back_image END;