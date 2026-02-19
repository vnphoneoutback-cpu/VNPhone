-- VNPhone Database Schema + Seed Data
-- Run this in Supabase SQL Editor

-- 1. Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  storage text NOT NULL,
  price integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Price checks log table
CREATE TABLE IF NOT EXISTS price_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  user_name text,
  user_email text,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  total_price integer NOT NULL,
  checked_at timestamptz DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_checks ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies - products: anyone can read
CREATE POLICY "Anyone can read products" ON products
  FOR SELECT USING (true);

-- 5. RLS Policies - price_checks: anyone can insert, only authenticated can read all
CREATE POLICY "Anyone can insert price_checks" ON price_checks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read price_checks" ON price_checks
  FOR SELECT USING (auth.role() = 'authenticated');

-- 6. Seed product data (29 records)
INSERT INTO products (brand, model, storage, price) VALUES
  ('IPHONE', 'IPHONE 13', '128 GB', 13930),
  ('IPHONE', 'IPHONE 14', '128 GB', 15800),
  ('IPHONE', 'IPHONE 14 PLUS', '128 GB', 25223),
  ('IPHONE', 'IPHONE 15', '128 GB', 19450),
  ('IPHONE', 'IPHONE 15', '256 GB', 30800),
  ('IPHONE', 'IPHONE 15 PLUS', '128 GB', 31100),
  ('IPHONE', 'IPHONE 15 PLUS', '256 GB', 34800),
  ('IPHONE', 'IPHONE 15 PRO', '128 GB', 34280),
  ('IPHONE', 'IPHONE 15 PRO', '256 GB', 38050),
  ('IPHONE', 'IPHONE 15 PRO MAX', '256 GB', 42480),
  ('IPHONE', 'IPHONE 15 PRO MAX', '512 GB', 50950),
  ('IPHONE', 'IPHONE 16', '128 GB', 24800),
  ('IPHONE', 'IPHONE 16', '256 GB', 33900),
  ('IPHONE', 'IPHONE 17', '256 GB', 29900),
  ('IPHONE', 'IPHONE 16e', '128 GB', 21291),
  ('IPHONE', 'IPHONE 16 PLUS', '128 GB', 31950),
  ('IPHONE', 'IPHONE 16 PLUS', '256 GB', 38900),
  ('IPHONE', 'IPHONE 16 PRO', '128 GB', 32035),
  ('IPHONE', 'IPHONE 16 PRO', '256 GB', 43900),
  ('IPHONE', 'IPHONE 16 PRO MAX', '256 GB', 43623),
  ('IPHONE', 'IPHONE 16 PRO MAX', '512 GB', 56900),
  ('IPHONE', 'IPHONE 17 PRO', '256 GB', 40950),
  ('IPHONE', 'IPHONE 17 PRO MAX', '256 GB', 46600),
  ('IPAD', 'iPad Wi-Fi Gen 11', '128 GB', 11000),
  ('IPAD', '11-inch iPad Pro M4 - Wi-Fi', '256 GB', 37900),
  ('IPAD', '11-inch iPad Pro M4 - Wi-Fi + Cellular', '256 GB', 45900),
  ('IPAD', '13-inch iPad Pro M4 - Wi-Fi', '256 GB', 50900),
  ('IPAD', '13-inch iPad Pro M4 - Wi-Fi + Cellular', '256 GB', 58900),
  ('IPAD', 'APPLE iPad Air 11-inch (M3) Wi-Fi 128', '128 GB', 15793);
