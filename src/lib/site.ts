export const SITE = {
  brand: "PR!ME F!T",
  tagline: "PREMIUM WEAR",
  email: "primefit.storee@gmail.com",
  instagram: "primefit.storeee",
  instagramUrl: "https://instagram.com/primefit.storeee",
  whatsappNumber: "+92 332 4692958",
  whatsappDigits: "923324692958",
  currency: "PKR",
  shippingFlat: 0,
  freeShippingOver: 0,
} as const;

export const LOGO_URL = "/__l5e/assets-v1/b7ccdba5-a167-455f-8f0a-eede77103c4f/image.png";

export function formatPKR(value: number) {
  return `Rs ${Math.round(value).toLocaleString("en-PK")}`;
}

export function whatsappLink(text: string) {
  return `https://wa.me/${SITE.whatsappDigits}?text=${encodeURIComponent(text)}`;
}
