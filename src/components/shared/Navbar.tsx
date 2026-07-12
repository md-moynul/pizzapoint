// components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Bars, Xmark, ShoppingCart } from "@gravity-ui/icons";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Menu", href: "/menu" },
  { label: "Build your pizza", href: "/build" },
  { label: "Track order", href: "/track" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll blocking when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-bg/80 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <Xmark className="h-6 w-6 text-text" />
            ) : (
              <Bars className="h-6 w-6 text-text" />
            )}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/Pizzapoint.png" alt="PizzaPoint" width={18} height={18} />
            <p className="font-display text-lg font-bold text-text">
              PizzaPoint
            </p>
          </Link>
        </div>

        {/* Desktop nav items */}
        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className=" text-sm text-text-muted hover:text-text"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right content */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            aria-label="Cart"
            className="relative rounded-full border border-border p-2 hover:border-text"
          >
            <ShoppingCart className="h-4 w-4 text-text" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary  text-[10px] text-white">
              0
            </span>
          </button>
          <Link href="/auth/signin">
            <Button
              size="sm"
              className="border-text text-text bg-background/55"

            >
              Sign in
            </Button>
          </Link>
          <Link href="/build">
            <Button
              className="bg-primary font-semibold text-white"
            >
              Start building
            </Button>
          </Link>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="border-t border-border bg-bg md:hidden">
          <ul className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-sm text-text"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Link href="/auth/signin">
                <Button
                  size="sm"
                  className="border-text text-text bg-background/55"

                >
                  Sign in
                </Button>
              </Link>
              <Link href="/build">
                <Button
                  className="bg-primary font-semibold text-white"
                >
                  Start building
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}