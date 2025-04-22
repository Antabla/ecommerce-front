export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}
