import { constructMetadata } from '@/lib/metadata';
import { getAllPizzas } from "@/lib/api/pizza";
import ItemsTable from "@/components/dashboard/ItemsTable";
import PizzaPagination from "@/components/home/Pagination";
import AdminItemsFilter from "@/components/dashboard/AdminItemsFilter";

export const metadata = constructMetadata({
  title: 'Dashboard | Admin Items | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});

interface AdminItemsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
    limit?: string;
  }>;
}

const AllItemsPage = async ({ searchParams }: AdminItemsPageProps) => {
  const { q, category, page, limit: queryLimit } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const limit = parseInt(queryLimit || "8", 10);

  const response = await getAllPizzas({
    q,
    category,
    page: currentPage,
    limit,
  });

  const pizzas = response?.data || [];
  const totalPages = response?.pagination?.totalPages || 1;
  const totalItems = response?.pagination?.totalItems ?? pizzas.length;

  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (category && category !== "all") sp.set("category", category);
  if (queryLimit) sp.set("limit", queryLimit);
  const paramsStr = sp.toString();

  const isFiltering = Boolean(q || (category && category !== "all"));

  return (
    <div className="flex-1 px-6 py-8 md:px-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Manage items
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Edit or remove pizzas from the menu.
          </p>
        </div>
        <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary self-start sm:self-auto">
          Total Pizzas: {totalItems}
        </div>
      </div>

      <div className="mt-6">
        <AdminItemsFilter initialSearch={q ?? ""} initialCategory={category ?? "all"} />
      </div>

      <div className="mt-6">
        {pizzas.length === 0 && isFiltering ? (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center">
            <p className="text-sm text-text-muted">No pizzas found matching &quot;{q || category}&quot;.</p>
          </div>
        ) : (
          <ItemsTable initialPizzas={pizzas} />
        )}
      </div>

      <PizzaPagination
        page={currentPage}
        totalPages={totalPages}
        paramsStr={paramsStr}
        link="/dashboard/admin/items"
      />
    </div>
  );
};

export default AllItemsPage;