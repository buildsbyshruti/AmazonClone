import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("amazon_clone_user"));
  if (user && user.id) {
    config.headers["user-id"] = user.id;
  }
  return config;
});

export const apiLogin = async (email, password) => {
  const res = await client.post("/login", { email, password });
  return res.data;
};

export const apiRegister = async (name, email, password) => {
  const res = await client.post("/register", {
    name,
    email,
    password,
  });
  return res.data;
};

export async function getProducts(params = {}) {
  const response = await client.get("/products", { params });
  return response.data;
}

export async function getProductById(id) {
  const response = await client.get(`/products/${id}`);
  return response.data;
}

export async function getCategories() {
  const response = await client.get("/categories");
  return response.data;
}

export async function getCart() {
  const response = await client.get("/cart");
  return response.data;
}

export async function addToCart(productId, quantity = 1) {
  const response = await client.post("/cart/items", {
    product_id: productId,
    quantity,
  });
  return response.data;
}

export async function updateCartItem(itemId, quantity) {
  const response = await client.put(`/cart/items/${itemId}`, { quantity });
  return response.data;
}

export async function removeCartItem(itemId) {
  const response = await client.delete(`/cart/items/${itemId}`);
  return response.data;
}

export async function clearCart() {
  const response = await client.delete("/cart");
  return response.data;
}

export async function placeOrder(shipping, items = null) {
  const payload = { shipping };
  if (items) payload.items = items;
  const response = await client.post("/orders", payload);
  return response.data;
}

export async function getOrderById(orderId) {
  const response = await client.get(`/orders/${orderId}`);
  return response.data;
}

export async function getOrders() {
  const response = await client.get("/orders");
  return response.data;
}
export async function getWishlist() {
  const response = await client.get("/wishlist");
  return response.data;
}

export async function addToWishlist(productId) {
  const response = await client.post("/wishlist/items", { product_id: productId });
  return response.data;
}

export async function removeFromWishlist(productId) {
  const response = await client.delete(`/wishlist/items/${productId}`);
  return response.data;
}
