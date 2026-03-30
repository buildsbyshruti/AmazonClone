import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import compression from "compression";
import { fileURLToPath } from "url";
import { sendOrderConfirmation } from "./utils/mailer.js";

dotenv.config();

const app = express();
const DEFAULT_USER_ID = 1;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(compression());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, "public")));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "amazon_clone",
});

async function getUserId(req) {
  const headerUserId = req.headers["user-id"];
  if (headerUserId && !isNaN(Number(headerUserId))) {
    const uid = Number(headerUserId);
    try {
      const [rows] = await pool.query("SELECT id FROM users WHERE id = ?", [uid]);
      if (rows.length > 0) return uid;
    } catch {}
  }
  return DEFAULT_USER_ID;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    res.json({ id: result.insertId, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email FROM users WHERE email = ? AND password = ?",
      [email, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, category_key, image_url FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name AS category, c.category_key
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
      ORDER BY p.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category, c.category_key
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = rows[0];

    const [images] = await pool.query(
      "SELECT id, image_url, is_primary, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order",
      [product.id],
    );
    product.images = images;

    const [specs] = await pool.query(
      "SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?",
      [product.id],
    );
    product.specifications = specs;

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/cart", async (req, res) => {
  const userId = await getUserId(req);
  try {
    const [items] = await pool.query(
      `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [userId],
    );

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    res.json({
      items,
      summary: {
        subtotal,
        total: subtotal,
        item_count: items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/cart/items", async (req, res) => {
  const { product_id, quantity } = req.body;
  const userId = await getUserId(req);

  try {
    const [existing] = await pool.query(
      "SELECT id FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, product_id],
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
        [quantity || 1, existing[0].id],
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, product_id, quantity || 1],
      );
    }

    res.json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/cart/items/:id", async (req, res) => {
  const { quantity } = req.body;
  const userId = await getUserId(req);
  console.log(`[Quantity Update] ItemID: ${req.params.id}, NewQty: ${quantity}, UserId: ${userId}`);
  try {
    const [result] = await pool.query(
      "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
      [Number(quantity), Number(req.params.id), userId]
    );
    if (result.affectedRows === 0) {
        console.warn(`[Quantity Update] No rows affected for ItemID: ${req.params.id}`);
        return res.status(404).json({ error: "Item not found in cart" });
    }
    res.json({ message: "Quantity updated" });
  } catch (err) {
    console.error("[Quantity Update] DB Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cart/items/:id", async (req, res) => {
  const userId = await getUserId(req);
  try {
    await pool.query("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [
      req.params.id,
      userId,
    ]);
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders", async (req, res) => {
  const userId = await getUserId(req);
  const { shipping, items: directItems } = req.body;

  try {
    let orderItems = [];
    let isDirect = false;

    if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      orderItems = directItems;
      isDirect = true;
    } else {
      const [cartItems] = await pool.query(
        `SELECT ci.*, p.price, p.name, p.image_url
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = ?`,
        [userId],
      );

      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }
      orderItems = cartItems;
    }

    const total_amount = orderItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    // Insert shipping address
    const [addrResult] = await pool.query(
      `INSERT INTO addresses (user_id, full_name, phone, line1, line2, city, state, pincode, country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        shipping.full_name,
        shipping.phone,
        shipping.line1,
        shipping.line2 || "",
        shipping.city,
        shipping.state,
        shipping.pincode,
        shipping.country || "India",
      ]
    );

    const address_id = addrResult.insertId;

    // Insert order
    const [result] = await pool.query(
      "INSERT INTO orders (user_id, address_id, total_amount, status) VALUES (?, ?, ?, ?)",
      [userId, address_id, total_amount, "Pending"],
    );

    const order_id = result.insertId;

    for (const item of orderItems) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [order_id, item.product_id || item.id, item.name || item.product_name, item.quantity, item.price, item.image_url || ""],
      );
    }

    if (!isDirect) {
      await pool.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
    }

    // Send confirmation email
    try {
        const [userData] = await pool.query("SELECT name, email FROM users WHERE id = ?", [userId]);
        if (userData.length > 0) {
            await sendOrderConfirmation({
                order_id,
                email: userData[0].email,
                user_name: userData[0].name,
                items: orderItems,
                total_amount,
                shipping,
            });
        }
    } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
    }

    res.json({ message: "Order placed", order_id });
  } catch (err) {
    console.error("Place order backend error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders", async (req, res) => {
  const userId = await getUserId(req);
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name AS user_name, u.email AS user_email,
              a.full_name, a.phone, a.line1, a.line2, a.city, a.state, a.pincode, a.country
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId],
    );

    for (let order of orders) {
      const [items] = await pool.query(
        "SELECT *, (price * quantity) AS total_price FROM order_items WHERE order_id = ?",
        [order.id],
      );
      order.items = items;
      order.total = order.total_amount;
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  const userId = await getUserId(req);
  const orderIdParam = req.params.id;

  // Handle Demo IDs if needed, although we should aim for real IDs
  if (orderIdParam.startsWith("DEMO-")) {
      return res.json({
          id: orderIdParam,
          status: "Order Confirmed",
          total: "1,299.00",
          total_amount: 1299.00,
          full_name: "John Doe (Demo User)",
          line1: "123 Amazon Way",
          line2: "Apt 4B",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110001",
          country: "India",
          phone: "9876543210",
          created_at: new Date().toISOString(),
          items: [
              {
                  product_id: 1,
                  product_name: "Demo Product - Amazon Clone Sample",
                  quantity: 1,
                  price: 1299.00,
                  total_price: 1299.00,
                  image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"
              }
          ]
      });
  }

  try {
    const [orders] = await pool.query(
      `SELECT o.*, 
              a.full_name, a.phone, a.line1, a.line2, a.city, a.state, a.pincode, a.country
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.id = ? AND o.user_id = ?`,
      [orderIdParam, userId],
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orders[0];
    const [items] = await pool.query(
      "SELECT *, (price * quantity) AS total_price FROM order_items WHERE order_id = ?",
      [order.id],
    );
    order.items = items;
    order.total = order.total_amount; // Mapping for frontend expectation

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;