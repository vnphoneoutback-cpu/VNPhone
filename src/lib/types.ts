// ============================================
// Staff
// ============================================

export interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  phone: string;
  company: "vnphone" | "siamchai";
  role: "admin" | "staff";
  status: "pending" | "active" | "inactive";
  approved_by: string | null;
  last_login_at: string | null;
  created_at: string;
}

export type StaffPublic = Pick<
  Staff,
  "id" | "first_name" | "last_name" | "nickname" | "email" | "phone" | "company" | "role" | "status" | "created_at"
>;

// ============================================
// Auth
// ============================================

export interface AuthPayload {
  sub: string;
  email: string;
  role: "admin" | "staff";
  nickname: string;
  company: "vnphone" | "siamchai";
}

export interface LoginRequest {
  identifier: string; // email or phone
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  phone: string;
  company: "vnphone" | "siamchai";
}

// ============================================
// Google Sheets Products
// ============================================

export interface CashProduct {
  brand: string;
  model: string;
  storage: string;
  price: number;
  color: string;
}

export interface InstallmentProduct {
  brand: string;
  model: string;
  storage: string;
  downPayment: number | null;
  month6: number | null;
  month8: number | null;
  month10: number | null;
  month12: number | null;
  note: string;
}

// ============================================
// Cart (สยามชัย)
// ============================================

export interface CartItem {
  id: string;
  brand: string;
  model: string;
  storage: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ============================================
// Activity Log
// ============================================

export interface ActivityLog {
  id: string;
  staff_id: string | null;
  action: "login" | "view_product" | "add_to_cart" | "export_quote";
  details: Record<string, unknown>;
  created_at: string;
  staff?: StaffPublic;
}
