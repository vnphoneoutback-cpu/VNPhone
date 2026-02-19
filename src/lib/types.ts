export interface Product {
  id: string;
  brand: string;
  model: string;
  storage: string;
  price: number;
  created_at: string;
}

export interface PriceCheck {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  product_id: string;
  quantity: number;
  total_price: number;
  checked_at: string;
  products?: Product;
}
