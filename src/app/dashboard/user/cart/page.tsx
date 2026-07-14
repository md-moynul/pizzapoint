// app/cart/page.tsx
import { getCart } from '@/lib/api/cart';
import { getServerSession } from '@/lib/sessions/serverSession';
import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Your Cart | PizzaPoint',
  description: 'Review your pizza orders and proceed to checkout',
};

interface CartItem {
  pizzaId: string;
  size: string;
  inches: number;
  unitPrice: number;
  quantity: number;
}

interface CartData {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

const CartPage = async () => {
  const user = await getServerSession();
  const cart: CartData = await getCart(user?.id || '');

  return <CartClient initialCart={cart} userId={user?.id || ''} />;
};

export default CartPage;