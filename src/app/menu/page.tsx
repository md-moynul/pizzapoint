// app/menu/page.tsx
"use client";

import { useEffect, useState } from "react";
import PizzaCard, { type Pizza } from "@/components/menu/PizzaCard";
import { getAllPizzas } from "@/lib/api/pizza";

export default function MenuPage() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    async function loadPizzas() {
      setIsLoading(true);
      const data = await getAllPizzas();
      setPizzas(data);
      setIsLoading(false);
    }
    loadPizzas();
  }, []);
  console.log(pizzas)
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-text">Menu</h1>
        <p className="mt-1 text-sm text-text-muted">
          Every pizza we make, ready to order.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
      ) : pizzas.length === 0 ? (
        <p className="mt-10 text-center text-sm text-text-muted">
          No pizzas available right now.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
      )}
    </div>
  );
}