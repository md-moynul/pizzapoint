import { constructMetadata } from '@/lib/metadata';
import { getAllOrders } from '@/lib/api/orders';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata = constructMetadata({
  title: 'Admin Orders & Delivery Control | PizzaPoint',
  description: 'Manage and update delivery status of customer orders',
});

interface AdminOrdersPageProps {
  searchParams: Promise<{
    q?: string;
    deliveryStatus?: string;
    status?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { q, deliveryStatus, status, page, limit: queryLimit } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const limit = queryLimit ? parseInt(queryLimit, 10) : undefined;

  const ordersRes = await getAllOrders({
    q,
    deliveryStatus,
    status,
    page: queryLimit ? currentPage : undefined,
    limit,
  }).catch(() => ({
    data: [],
    totalOrders: 0,
    activeOrdersCount: 0,
    deliveredOrdersCount: 0,
  }));

  const orders = ordersRes?.data || [];
  const totalOrders = ordersRes?.totalOrders ?? orders.length;
  const activeOrdersCount =
    ordersRes?.activeOrdersCount ??
    orders.filter((o: any) => (o.deliveryStatus || '').toLowerCase().trim() !== 'delivered').length;
  const deliveredOrdersCount =
    ordersRes?.deliveredOrdersCount ??
    orders.filter((o: any) => (o.deliveryStatus || '').toLowerCase().trim() === 'delivered').length;

  return (
    <AdminOrdersClient
      initialOrders={orders}
      totalOrders={totalOrders}
      activeCount={activeOrdersCount}
      deliveredCount={deliveredOrdersCount}
      initialSearch={q ?? ""}
      initialDeliveryStatus={deliveryStatus ?? "all"}
    />
  );
}