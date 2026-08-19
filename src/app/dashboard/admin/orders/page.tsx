import { constructMetadata } from '@/lib/metadata';
import { getAllOrders } from '@/lib/api/orders';
import AdminOrdersClient from './AdminOrdersClient';
import PizzaPagination from '@/components/home/Pagination';

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
  const limit = parseInt(queryLimit || "8", 10);

  const ordersRes = await getAllOrders({
    q,
    deliveryStatus,
    status,
    page: currentPage,
    limit,
  }).catch(() => ({
    data: [],
    totalOrders: 0,
    activeOrdersCount: 0,
    deliveredOrdersCount: 0,
    pagination: { totalPages: 1, totalItems: 0 },
  }));

  const orders = ordersRes?.data || [];
  const totalOrders = ordersRes?.totalOrders ?? ordersRes?.pagination?.totalItems ?? orders.length;
  const activeOrdersCount =
    ordersRes?.activeOrdersCount ??
    orders.filter((o: any) => (o.deliveryStatus || '').toLowerCase().trim() !== 'delivered').length;
  const deliveredOrdersCount =
    ordersRes?.deliveredOrdersCount ??
    orders.filter((o: any) => (o.deliveryStatus || '').toLowerCase().trim() === 'delivered').length;
  const totalPages = ordersRes?.pagination?.totalPages || 1;

  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (deliveryStatus && deliveryStatus !== "all") sp.set("deliveryStatus", deliveryStatus);
  if (status && status !== "all") sp.set("status", status);
  if (queryLimit) sp.set("limit", queryLimit);
  const paramsStr = sp.toString();

  return (
    <div className="flex-1">
      <AdminOrdersClient
        initialOrders={orders}
        totalOrders={totalOrders}
        activeCount={activeOrdersCount}
        deliveredCount={deliveredOrdersCount}
        initialSearch={q ?? ""}
        initialDeliveryStatus={deliveryStatus ?? "all"}
      />
      <div className="px-6 pb-8 md:px-10">
        <PizzaPagination
          page={currentPage}
          totalPages={totalPages}
          paramsStr={paramsStr}
          link="/dashboard/admin/orders"
        />
      </div>
    </div>
  );
}