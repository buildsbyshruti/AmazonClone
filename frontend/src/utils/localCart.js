

const CART_KEY = "amazon_clone_local_cart";
const WISHLIST_KEY = "amazon_clone_local_wishlist";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function localGetCart() {
  const items = readCart();
  const item_count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return { items, summary: { item_count, total } };
}

export function localAddToCart(product, quantity = 1) {
  const items = readCart();
  const existing = items.find((i) => i.product_id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      id: `local_${product.id}_${Date.now()}`,
      product_id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url || "",
      quantity,
    });
  }
  writeCart(items);
  return localGetCart();
}

export function localUpdateCartItem(itemId, quantity) {
  const items = readCart();
  const item = items.find((i) => i.id === itemId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  writeCart(items);
  return localGetCart();
}

export function localRemoveCartItem(itemId) {
  let items = readCart();
  items = items.filter((i) => i.id !== itemId);
  writeCart(items);
  return localGetCart();
}

export function localClearCart() {
  localStorage.removeItem(CART_KEY);
  return { items: [], summary: { item_count: 0, total: 0 } };
}

function readWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function writeWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export function localGetWishlist() {
  return readWishlist();
}

export function localAddToWishlist(product) {
  const items = readWishlist();
  if (items.find((i) => i.product_id === product.id)) {
    return items;
  }
  items.push({
    id: `local_wish_${product.id}_${Date.now()}`,
    product_id: product.id,
    name: product.name,
    price: Number(product.price),
    image_url: product.image_url || "",
    added_at: new Date().toISOString(),
  });
  writeWishlist(items);
  return items;
}

export function localRemoveFromWishlist(productId) {
  let items = readWishlist();
  items = items.filter((i) => i.product_id !== productId);
  writeWishlist(items);
  return items;
}
