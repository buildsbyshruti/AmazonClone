USE amazon_clone;

INSERT INTO users (id, name, email, password)
VALUES (1, 'Default User', 'shrutimittal1518@gmail.com', 'password123')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), password = VALUES(password);

INSERT INTO categories (name, category_key, image_url) VALUES
('Fresh', 'fresh', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'),
('Mobiles', 'mobiles', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'),
('Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80'),
('Fashion', 'fashion', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80'),
('Home & Kitchen', 'home_kitchen', 'https://images.unsplash.com/photo-1583845112239-97ef1341b271?w=800&q=80'),
('Best Sellers', 'best_sellers', 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80'),
('Today''s Deals', 'deals', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80'),
('New Releases', 'new_releases', 'https://images.unsplash.com/photo-1517638851339-4aa32003c11a?w=800&q=80'),
('Prime', 'prime', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80'),
('Amazon Pay', 'amazon_pay', 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80')
ON DUPLICATE KEY UPDATE name = VALUES(name), image_url = VALUES(image_url);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 101, 'Fresh Farm Apples - 1 kg', c.id, 159, 20, 'Premium orchard apples delivered fresh.', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=900&q=80', 120, 4.4, 318
FROM categories c WHERE c.category_key = 'fresh'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 102, 'Fresh Spinach Bundle', c.id, 49, 15, 'Leafy spinach ideal for salads and curries.', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=900&q=80', 200, 4.2, 92
FROM categories c WHERE c.category_key = 'fresh'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 103, 'Smartphone 5G 8GB/128GB', c.id, 16999, 24, 'Fast 5G smartphone with high refresh display.', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80', 35, 4.5, 2110
FROM categories c WHERE c.category_key = 'mobiles'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 104, 'Pro Camera Smartphone', c.id, 29999, 18, 'Flagship mobile with advanced camera system.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80', 25, 4.6, 1408
FROM categories c WHERE c.category_key = 'mobiles'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 105, 'Noise Cancelling Earbuds', c.id, 2499, 35, 'Wireless earbuds with active noise cancellation.', 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=900&q=80', 80, 4.3, 678
FROM categories c WHERE c.category_key = 'electronics'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 106, 'Ultra HD Smart TV 43 inch', c.id, 27999, 28, '4K smart TV with HDR and Dolby audio.', 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=900&q=80', 18, 4.4, 843
FROM categories c WHERE c.category_key = 'electronics'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 107, 'Cotton Casual T-Shirt', c.id, 599, 50, 'Soft cotton fit for all-day comfort.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80', 140, 4.2, 1209
FROM categories c WHERE c.category_key = 'fashion'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 108, 'Non-stick Cookware Set', c.id, 1899, 45, 'Durable cookware set for everyday cooking.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80', 70, 4.1, 711
FROM categories c WHERE c.category_key = 'home_kitchen'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 125, 'Glass Mixing Bowls - Set of 3', c.id, 849, 25, 'Premium glass bowls for easy mixing.', 'https://images.unsplash.com/photo-1610555356070-d0efb6505f81?w=900&q=80', 50, 4.4, 430
FROM categories c WHERE c.category_key = 'home_kitchen'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 126, 'Stainless Steel Serving Spoons', c.id, 499, 30, 'Elegant spoons for your dining table.', 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?w=900&q=80', 100, 4.3, 210
FROM categories c WHERE c.category_key = 'home_kitchen'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 127, 'Ceramic Coffee Mugs - 4pcs', c.id, 1299, 40, 'Modern coffee mugs for a perfect morning.', 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=900&q=80', 80, 4.5, 890
FROM categories c WHERE c.category_key = 'home_kitchen'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 128, 'Wooden Cutting Board', c.id, 599, 20, 'Solid wood board for everyday prep.', 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=900&q=80', 120, 4.2, 156
FROM categories c WHERE c.category_key = 'home_kitchen'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 129, 'Electric Kettle 1.5L', c.id, 999, 50, 'Quick-boil kettle with auto shut-off.', 'https://images.unsplash.com/photo-1594051808233-e30fffc0e984?w=900&q=80', 300, 4.6, 2310
FROM categories c WHERE c.category_key = 'home_kitchen'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 109, 'Kitchen Knife Set', c.id, 1099, 31, 'Professional stainless steel knife combo.', 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=900&q=80', 95, 4.3, 1500
FROM categories c WHERE c.category_key = 'best_sellers'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 110, 'Wireless Charging Pad', c.id, 799, 48, 'Fast charging pad compatible with modern phones.', 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=900&q=80', 110, 4.0, 274
FROM categories c WHERE c.category_key = 'deals'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 111, 'New Release Smartwatch', c.id, 3499, 12, 'Fitness watch with SPO2 and GPS tracking.', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80', 45, 4.2, 167
FROM categories c WHERE c.category_key = 'new_releases'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 112, 'Prime Video Family Pack', c.id, 1499, 25, 'Annual entertainment subscription package.', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=900&q=80', 9999, 4.7, 2670
FROM categories c WHERE c.category_key = 'prime'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

INSERT INTO products (id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count)
SELECT 113, 'Amazon Pay Cashback Pack', c.id, 399, 35, 'Utility payments and recharge cashback combo.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=80', 1000, 4.1, 340
FROM categories c WHERE c.category_key = 'amazon_pay'
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), discount = VALUES(discount), description = VALUES(description), image_url = VALUES(image_url), stock = VALUES(stock), rating = VALUES(rating), reviews_count = VALUES(reviews_count);

DELETE FROM product_images;

INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(101, 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=900&q=80', 1, 1),
(101, 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=900&q=80', 0, 2),
(101, 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=900&q=80', 0, 3),
(102, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=900&q=80', 1, 1),
(102, 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=900&q=80', 0, 2),
(103, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80', 1, 1),
(103, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80', 0, 2),
(103, 'https://images.unsplash.com/photo-1510557880182-3f8c67be31a2?w=900&q=80', 0, 3),
(104, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80', 1, 1),
(104, 'https://images.unsplash.com/photo-1522148546421-5f8d9eb5f0bf?w=900&q=80', 0, 2),
(105, 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=900&q=80', 1, 1),
(105, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=80', 0, 2),
(106, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=900&q=80', 1, 1),
(106, 'https://images.unsplash.com/photo-1542556398-95fb5b9f9b40?w=900&q=80', 0, 2),
(107, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80', 1, 1),
(108, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80', 1, 1),
(109, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=900&q=80', 1, 1),
(110, 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=900&q=80', 1, 1),
(111, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80', 1, 1),
(111, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80', 0, 2),
(112, 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=900&q=80', 1, 1),
(112, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&q=80', 0, 2),
(113, 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=80', 1, 1),
(113, 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=900&q=80', 0, 2);

DELETE FROM product_specs;

INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
(103, 'Display', '6.6 inch FHD+'),
(103, 'Processor', 'Octa-core 5G'),
(103, 'Battery', '5000 mAh'),
(103, 'RAM', '8 GB'),
(103, 'Storage', '128 GB'),
(104, 'Display', '6.7 inch AMOLED'),
(104, 'Camera', '50MP + 12MP + 8MP'),
(104, 'Battery', '4800 mAh'),
(104, 'OS', 'Android 14'),
(106, 'Resolution', '3840 x 2160 4K'),
(106, 'Audio', 'Dolby Audio'),
(106, 'Ports', '3x HDMI, 2x USB'),
(106, 'Smart TV OS', 'Fire TV Built-in'),
(101, 'Weight', '1 kg'),
(101, 'Type', 'Fruit'),
(101, 'Origin', 'Himachal Pradesh'),
(108, 'Material', 'Hard-anodized aluminium'),
(108, 'Pieces', '8-piece set'),
(108, 'Dishwasher Safe', 'No'),
(105, 'Driver Size', '12mm'),
(105, 'Battery Life', '28 hours'),
(105, 'Connectivity', 'Bluetooth 5.3'),
(107, 'Material', '100% Cotton'),
(107, 'Fit', 'Regular Fit'),
(109, 'Material', 'Stainless Steel'),
(109, 'Pieces', '6 knives + block'),
(111, 'Display', '1.4 inch AMOLED'),
(111, 'Battery Life', '7 days'),
(111, 'Water Resistance', 'IP68');
