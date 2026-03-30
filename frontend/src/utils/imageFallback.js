export const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";

export function handleImageError(event) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === "true") return;
  image.dataset.fallbackApplied = "true";
  image.src = FALLBACK_PRODUCT_IMAGE;
}
