import { constructMetadata } from '@/lib/metadata';
import { getInventoryItems } from '@/lib/api/inventory';
import InventoryClient from './InventoryClient';
import PizzaPagination from '@/components/home/Pagination';

export const metadata = constructMetadata({
  title: 'Pizza Making Items (Inventory) | PizzaPoint Admin',
  description: 'Manage raw pizza ingredients and making stock levels',
});

interface AdminInventoryPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminInventoryPage({ searchParams }: AdminInventoryPageProps) {
  const { q, category, status, page, limit: queryLimit } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const limit = parseInt(queryLimit || "8", 10);

  const itemsRes = await getInventoryItems({
    q,
    category,
    status,
    page: currentPage,
    limit,
  }).catch(() => ({
    data: [],
    pagination: { totalPages: 1, totalItems: 0 },
  }));

  const items = itemsRes?.data || [];
  const totalPages = itemsRes?.pagination?.totalPages || 1;
  const totalItems = itemsRes?.pagination?.totalItems ?? items.length;

  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (category && category !== "all") sp.set("category", category);
  if (status && status !== "all") sp.set("status", status);
  if (queryLimit) sp.set("limit", queryLimit);
  const paramsStr = sp.toString();

  return (
    <div className="flex-1">
      <InventoryClient
        initialItems={items}
        totalItems={totalItems}
        initialSearch={q ?? ""}
        initialCategory={category ?? "all"}
        initialStatus={status ?? "all"}
      />
      <div className="px-6 pb-8 md:px-10">
        <PizzaPagination
          page={currentPage}
          totalPages={totalPages}
          paramsStr={paramsStr}
          link="/dashboard/admin/inventory"
        />
      </div>
    </div>
  );
}