import mysql from "mysql2/promise";
import fs from "fs";

const pool = mysql.createPool({
  host: "hopper.proxy.rlwy.net",
  port: 41272,
  user: "root",
  password: "QNFzygMqtebPEpFGtIhCnLYwUwhytInH",
  database: "railway",
  waitForConnections: true,
});

async function seed() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("✅ Connected to Railway MySQL");

    console.log("🗑️  Dropping existing tables...");
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    const tables = [
      "order_items", "orders", "addresses",
      "wishlist", "cart_items",
      "product_specs", "product_images", "products",
      "categories", "users",
    ];
    for (const t of tables) {
      await conn.query(`DROP TABLE IF EXISTS ${t}`);
    }
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("📦 Creating tables...");

    await conn.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category_key VARCHAR(100) NOT NULL UNIQUE,
        image_url TEXT
      )
    `);

    await conn.query(`
      CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        discount INT DEFAULT 0,
        stock INT DEFAULT 100,
        rating DECIMAL(2,1) DEFAULT 4.0,
        reviews INT DEFAULT 0,
        image_url TEXT,
        category_id INT,
        is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    await conn.query(`
      CREATE TABLE product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url TEXT NOT NULL,
        is_primary TINYINT DEFAULT 0,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    await conn.query(`
      CREATE TABLE product_specs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        spec_key VARCHAR(255) NOT NULL,
        spec_value VARCHAR(500) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    await conn.query(`
      CREATE TABLE cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    await conn.query(`
      CREATE TABLE wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    await conn.query(`
      CREATE TABLE addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(20),
        line1 VARCHAR(500),
        line2 VARCHAR(500),
        city VARCHAR(255),
        state VARCHAR(255),
        pincode VARCHAR(20),
        country VARCHAR(100) DEFAULT 'India',
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await conn.query(`
      CREATE TABLE orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        address_id INT,
        total_amount DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (address_id) REFERENCES addresses(id)
      )
    `);

    await conn.query(`
      CREATE TABLE order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(500),
        quantity INT DEFAULT 1,
        price DECIMAL(10,2),
        image_url TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
    `);

    console.log("👤 Seeding users...");
    await conn.query(`INSERT INTO users (id, name, email, password) VALUES
      (1, 'Guest User', 'guest@amazon.in', 'guest123'),
      (2, 'Shruti Mittal', 'shruti@example.com', 'shruti123'),
      (3, 'Test User', 'test@example.com', 'test123')
    `);

    console.log("📂 Seeding categories...");
    await conn.query(`INSERT INTO categories (id, name, category_key, image_url) VALUES
      (1, 'Fresh', 'fresh', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'),
      (2, 'Mobiles', 'mobiles', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'),
      (3, 'Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80'),
      (4, 'Fashion', 'fashion', 'https://images.unsplash.com/photo-1445205170230-053b83e26371?w=400&q=80'),
      (5, 'Home & Kitchen', 'home_kitchen', 'https://images.unsplash.com/photo-1556911223-435b9d1f35f9?w=400&q=80'),
      (6, 'Best Sellers', 'best_sellers', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'),
      (7, 'Today\\'s Deals', 'deals', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80'),
      (8, 'New Releases', 'new_releases', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'),
      (9, 'Prime', 'prime', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80'),
      (10, 'Amazon Pay', 'amazon_pay', 'https://images.unsplash.com/photo-1556742044-3c52d6e88c02?w=400&q=80'),
      (11, 'Sell', 'sell', 'https://images.unsplash.com/photo-1556740738-b6a63e2791cc?w=400&q=80'),
      (12, 'Customer Service', 'customer_service', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80'),
      (13, 'MX Player', 'mx_player', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80')
    `);

    console.log("🛒 Seeding products...");

    const products = [
      [1001, "Fresh Farm Apples - 1 kg", "Fresh and juicy apples sourced from Himachal farms.", 159, 20, 44, 4.3, 318, "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp", 1],
      [1002, "Fresh Spinach Bundle", "Organic farm-fresh spinach for healthy cooking.", 49, 15, 38, 4.1, 92, "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp", 1],
      [1003, "Smartphone 5G 8GB/128GB", "Latest 5G smartphone with powerful processor.", 16999, 24, 54, 4.5, 2110, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", 2],
      [1004, "Pro Camera Smartphone", "Professional camera phone with 108MP sensor.", 29999, 18, 18, 4.6, 1408, "https://images.unsplash.com/photo-1510557880182-3f8c67be31a2?w=400", 2],
      [1005, "Noise Cancelling Earbuds", "Premium ANC earbuds with deep bass.", 2499, 35, 63, 4.4, 678, "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", 3],
      [1006, "Ultra HD Smart TV 43 inch", "4K Smart TV with Dolby Atmos and built-in apps.", 27999, 28, 0, 4.3, 843, "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400", 3],
      [1007, "Cotton Casual T-Shirt", "Premium cotton casual t-shirt for everyday wear.", 599, 50, 59, 4.2, 1209, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", 4],
      [1008, "Slim Fit Denim Jeans", "Stretch slim-fit denim jeans in dark wash.", 1299, 42, 61, 4.1, 932, "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", 4],
      [1009, "Non-stick Cookware Set", "5-piece non-stick cookware set with glass lids.", 1899, 45, 0, 4.5, 711, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400", 5],
      [1010, "Vacuum Flask Bottle", "Double-wall stainless steel vacuum flask, 1L.", 699, 39, 37, 4.3, 502, "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400", 5],
      [1011, "Kitchen Knife Set", "Professional stainless steel kitchen knife set.", 1099, 31, 0, 4.4, 1500, "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp", 6],
      [1012, "Premium Yoga Mat", "Extra thick anti-slip yoga mat, 6mm.", 899, 33, 29, 4.2, 640, "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=400", 6],
      [1013, "Bluetooth Neckband", "Wireless bluetooth neckband with 20hr battery.", 1199, 60, 96, 4.0, 389, "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400", 7],
      [1014, "Wireless Charging Pad", "Qi-certified 15W fast wireless charging pad.", 799, 48, 0, 4.1, 274, "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=400", 7],
      [1015, "New Release Smartwatch", "Fitness smartwatch with AMOLED display.", 3499, 12, 78, 4.3, 167, "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400", 8],
      [1016, "Mini Espresso Machine", "Compact espresso maker with milk frother.", 6999, 15, 70, 4.5, 84, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", 8],
      [1017, "Prime Video Family Pack", "Annual streaming subscription for the family.", 1499, 25, 90, 4.7, 2670, "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400", 9],
      [1018, "Prime Gaming Starter Bundle", "Gaming perks and in-game loot bundle.", 999, 20, 87, 4.2, 440, "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400", 9],
      [1019, "Merchant POS Device", "Portable POS device for businesses.", 2999, 10, 0, 4.0, 90, "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400", 10],
      [1020, "Recharge & Bill Cashback Pack", "Cashback on recharges and bill payments.", 399, 35, 55, 4.1, 340, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400", 10],
      [1021, "Seller Starter Packaging Kit", "Complete packaging starter kit for sellers.", 749, 22, 75, 3.9, 54, "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400", 11],
      [1022, "Catalog Photography Light Box", "Portable photo studio light box for products.", 1299, 27, 51, 4.0, 71, "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400", 11],
      [1023, "Customer Service Headset", "Noise-cancelling USB headset for support.", 1599, 30, 0, 4.2, 124, "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400", 12],
      [1024, "MX Player Streaming Stick", "4K streaming stick with voice remote.", 2199, 26, 43, 4.3, 203, "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400", 13],
      [1025, "Glass Mixing Bowls - Set of 3", "Tempered glass nesting mixing bowls.", 849, 25, 0, 4.2, 430, "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp", 5],
      [1026, "Stainless Steel Serving Spoons", "Set of 6 premium serving spoons.", 499, 30, 69, 4.1, 210, "https://images.unsplash.com/photo-1591871937573-74dbba515c4c?w=400", 5],
      [1027, "Ceramic Coffee Mugs - 4pcs", "Hand-painted ceramic mugs, 300ml each.", 1299, 40, 70, 4.4, 890, "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=400", 5],
      [1028, "Wooden Cutting Board", "Premium acacia wood cutting board.", 599, 20, 81, 4.0, 156, "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=400", 5],
      [1029, "Electric Kettle 1.5L", "Stainless steel fast-boil electric kettle.", 999, 50, 56, 4.6, 2310, "https://images.unsplash.com/photo-1594051808233-e30fffc0e984?w=400", 5],
      [1030, "Cotton Tablecloth - Floral", "100% cotton tablecloth with floral print.", 749, 15, 89, 3.8, 88, "https://images.unsplash.com/photo-1520170350707-b2da59970118?w=400", 5],
      [1031, "Non-stick Baking Tray", "Carbon steel non-stick baking tray.", 459, 10, 76, 4.1, 320, "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp", 5],
      [1032, "Silicone Spatula Set", "Heat-resistant silicone spatula set, 5 pieces.", 349, 12, 21, 4.2, 445, "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp", 5],
      [2001, "Premium Cushion Cover (Set of 2)", "Velvet cushion covers with zip closure.", 499, 10, 19, 4.0, 156, "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400", 5],
      [2002, "Decorative Flower Vase", "Handcrafted ceramic flower vase.", 899, 20, 0, 4.1, 89, "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400", 5],
      [2003, "Smart Air Conditioner - 1.5 Ton", "Inverter split AC with Wi-Fi control.", 34999, 15, 0, 4.4, 245, "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400", 3],
      [2004, "Double Door Refrigerator", "Frost-free double door refrigerator 260L.", 28999, 12, 22, 4.3, 188, "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400", 3],
      [2005, "Convection Microwave Oven", "28L convection microwave with auto-cook.", 12499, 18, 48, 4.2, 312, "https://images.unsplash.com/photo-1510557880182-3f8c67be31a2?w=400", 3],
      [2006, "Front Load Washing Machine", "7kg fully automatic front load washer.", 24999, 20, 44, 4.5, 423, "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400", 3],
      [2007, "Men's Casual Shirt", "Slim fit casual shirt in premium cotton.", 899, 50, 84, 4.1, 654, "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", 4],
      [2008, "Sports Running Shoes", "Lightweight running shoes with cushion sole.", 1999, 30, 70, 4.3, 876, "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400", 4],
      [2009, "Leather Laptop Bag", "Genuine leather laptop bag with padded compartment.", 2499, 25, 16, 4.0, 143, "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400", 4],
      [2010, "Complete Home Cleaning Kit", "All-in-one cleaning supplies kit.", 1299, 35, 83, 4.2, 298, "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400", 5],
      [2011, "Modern Bathroom Set", "5-piece modern bathroom accessory set.", 2499, 15, 97, 3.9, 67, "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400", 5],
      [2012, "Multipurpose Power Tool Kit", "20V cordless drill with accessories.", 3499, 40, 79, 4.4, 512, "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400", 5],
      [2013, "Decorative Peel & Stick Wallpaper", "Self-adhesive vinyl wallpaper roll.", 799, 10, 0, 3.7, 45, "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400", 5],
      [2014, "Flagship Smartphone 12GB/256GB", "Premium flagship phone with S-Pen.", 49999, 10, 25, 4.7, 1243, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400", 2],
      [2015, "Budget Smartphone 4GB/64GB", "Affordable smartphone with dual camera.", 8999, 20, 71, 4.0, 567, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", 2],
      [2016, "Fast Charging Adapter 65W", "GaN USB-C fast charger, universal.", 1499, 30, 14, 4.3, 890, "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400", 3],
      [2017, "Modular Home Storage Units", "Stackable cube storage organizer.", 3999, 20, 0, 4.1, 231, "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400", 5],
      [2018, "Smart LED Lighting System", "RGB smart LED strip with app control.", 1899, 15, 0, 4.2, 412, "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400", 5],
      [2019, "Classic Analogue Watch", "Stainless steel classic watch with leather strap.", 5499, 45, 36, 4.5, 890, "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", 4],
    ];

    for (const p of products) {
      await conn.query(
        `INSERT INTO products (id, name, description, price, discount, stock, rating, reviews, image_url, category_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        p
      );
    }

    console.log("🖼️  Seeding product images...");
    const productImages = [];
    let dummyData = [];
    try {
      dummyData = JSON.parse(fs.readFileSync("/tmp/dummy_products.json", "utf8")).products;
    } catch(e) {}

    for (const p of products) {
      const productId = p[0];
      const productName = p[1];
      const primaryImage = p[8];

      const dummyMatch = dummyData.find(d => 
        d.title.toLowerCase().includes(productName.toLowerCase().split(' ')[0])
      );

      const gallery = [];
      if (dummyMatch && dummyMatch.images && dummyMatch.images.length > 1) {
        dummyMatch.images.forEach((img, idx) => {
          gallery.push([productId, img, idx === 0 ? 1 : 0, idx + 1]);
        });
      } else {
        const unsplashIds = [
          "photo-1542291026-7eec264c27ff", "photo-1505740420928-5e560c06d30e",
          "photo-1523275335684-37898b6baf30", "photo-1526170315873-3a923f4820dc",
          "photo-1572635196237-14b3f281503f", "photo-1491553895911-0055eca6402d"
        ];
        gallery.push([productId, primaryImage, 1, 1]);
        for (let i = 1; i < 5; i++) {
          const randomId = unsplashIds[(productId + i) % unsplashIds.length];
          gallery.push([productId, `https://images.unsplash.com/${randomId}?w=800&q=80`, 0, i + 1]);
        }
      }
      productImages.push(...gallery);
    }

    const imageSql = "INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ?";
    await conn.query(imageSql, [productImages]);

    console.log("📋 Seeding product specs...");
    const specsData = [
      [1003, [["RAM", "8 GB"], ["Storage", "128 GB"], ["Display", "6.5 inch AMOLED"], ["Battery", "5000 mAh"], ["OS", "Android 14"]]],
      [1004, [["Camera", "108 MP"], ["RAM", "12 GB"], ["Storage", "256 GB"], ["Display", "6.7 inch AMOLED"], ["5G", "Yes"]]],
      [1005, [["Type", "In-ear TWS"], ["ANC", "Active Noise Cancellation"], ["Battery", "28 hrs total"], ["Driver", "10mm"], ["Bluetooth", "5.3"]]],
      [1006, [["Screen Size", "43 inches"], ["Resolution", "3840 x 2160 (4K)"], ["Smart TV", "Yes"], ["HDMI Ports", "3"], ["Sound", "Dolby Atmos"]]],
      [1009, [["Material", "Aluminium + Non-stick"], ["Pieces", "5"], ["Induction", "Compatible"], ["Lid", "Glass"], ["Warranty", "2 Years"]]],
      [1015, [["Display", "1.4 inch AMOLED"], ["Battery", "7 days"], ["SpO2", "Yes"], ["GPS", "Built-in"], ["Water Resist", "5 ATM"]]],
      [2003, [["Capacity", "1.5 Ton"], ["Type", "Inverter Split"], ["Star Rating", "5 Star"], ["Wi-Fi", "Yes"], ["Warranty", "5 Years Compressor"]]],
      [2014, [["RAM", "12 GB"], ["Storage", "256 GB"], ["Camera", "200 MP"], ["Chipset", "Snapdragon 8 Gen 3"], ["S-Pen", "Yes"]]],
    ];
    for (const [productId, specs] of specsData) {
      for (const [key, value] of specs) {
        await conn.query(
          `INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES (?, ?, ?)`,
          [productId, key, value]
        );
      }
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log("   ✅ 3 users");
    console.log("   ✅ 13 categories");
    console.log("   ✅ 51 products");
    console.log("   ✅ 153 product images (3 per product)");
    console.log("   ✅ Product specifications for key items");

  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

seed();
