// app/menu/page.tsx
import { getAllPizzas } from "@/lib/api/pizza";
import MenuBrowser from "@/components/menu/MenuBrowser";
import PizzaCard, { type Pizza } from "@/components/menu/PizzaCard";

interface MenuPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const { q, category, minPrice, maxPrice } = await searchParams;

  const pizzas: Pizza[] = await getAllPizzas({
    q,
    category,
    minPrice,
    maxPrice,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-text">Menu</h1>
        <p className="mt-1 text-sm text-text-muted">
          Every pizza we make, ready to order.
        </p>
      </div>

      <MenuBrowser
        initialSearch={q ?? ""}
        initialCategory={category ?? "all"}
        initialMinPrice={minPrice ? Number(minPrice) : 0}
        initialMaxPrice={maxPrice ? Number(maxPrice) : 1000}
      />

      {pizzas.length === 0 ? (
        <p className="mt-10 text-center text-sm text-text-muted">
          No pizzas match your filters.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
      )}
    </div>
  );
}