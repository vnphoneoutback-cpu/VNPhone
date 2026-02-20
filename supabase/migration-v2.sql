-- ============================================
-- VNPhone Staff Tool v2 - Migration
-- Run in Supabase SQL Editor
-- ============================================

-- Drop old tables if needed (comment out if you want to keep data)
-- DROP TABLE IF EXISTS price_checks CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;

-- ============================================
-- Table: staff
-- ============================================
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  nickname text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text UNIQUE NOT NULL,
  company text NOT NULL CHECK (company IN ('vnphone', 'siamchai')),
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  approved_by uuid REFERENCES staff(id),
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_phone ON staff(phone);
CREATE INDEX IF NOT EXISTS idx_staff_company ON staff(company);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);

-- ============================================
-- Table: activity_logs
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES staff(id),
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_staff ON activity_logs(staff_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (API routes use service_role key)
CREATE POLICY "Service role full access on staff"
  ON staff FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on activity_logs"
  ON activity_logs FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Seed: First admin account (เบส)
-- ============================================
INSERT INTO staff (first_name, last_name, nickname, email, phone, company, role, status)
VALUES ('เบส', 'เจ้าของ', 'เบส', 'bass@vnphone.com', '0994395550', 'vnphone', 'admin', 'active')
ON CONFLICT (email) DO NOTHING;
