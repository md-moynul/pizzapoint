// components/home/Highlights.tsx
import Link from "next/link";
import PizzaCard, { type Pizza } from "@/components/menu/PizzaCard";
import { Button } from "@heroui/react";

// TODO: replace with a real fetch, e.g. GET /pizzas?featured=true&limit=3
const featuredPizzas: Pizza[] = [
  {
    _id: "6a55fe2070a1df95c84495c3",
    name: "Chicken Paradise",
    category: "non-veg",
    cheeses: ["Mozzarella", "Cheddar"],
    shortDescription: "Grilled chicken, smoky BBQ sauce, red onion",
    imageUrl:
      "https://i.ibb.co/zTBSZwj5/tasty-italian-classic-original-pepperoni-pizza-top-view-tasty-italian-classic-original-pepperoni-piz.webp",
    price: "450",
    rating: "4.8",
  },
];

export default function Highlights() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
              Highlights
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-text md:text-3xl">
              Most loved right now
            </h2>
          </div>
          <Link href="/menu">
            <Button className="rounded-full border-border text-text bg-background">
              View full menu
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPizzas.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
      </div>
    </section>
  );
}