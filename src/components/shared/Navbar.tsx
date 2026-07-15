"use client";


import { useState, useEffect, useRef } from "react";
import { Avatar, Button } from "@heroui/react";
import { Bars, Xmark, ShoppingCart, LayoutHeader, ArrowRightFromSquare } from "@gravity-ui/icons";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { sessionsClient } from "@/lib/sessions/clinetSide";

interface navItem {
  label: string;
  href: string;
}

interface CustomUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string; 
}

const baseNavItems: navItem[] = [
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const user = sessionsClient().session?.user as CustomUser | undefined;


  const navItems: navItem[] = [
    ...baseNavItems,
    ...(user && user.role !== "admin" ? [{ label: "Cart", href: "/dashboard/user/cart" }, { label: "profile", href: "/dashboard/profile" }] : []),
    ...(user?.role === "admin"
      ? [{ label: "Dashboard", href: `/dashboard/${user.role}` }, { label: "profile", href: "/dashboard/profile" }]
      : []
    ),
  ];

  // Scroll blocking when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsProfileOpen(false);
    redirect('/');
  };

  const navEnd = (
    <>
      {user ? (
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen((v) => !v)}
            aria-label="Your profile"
            aria-expanded={isProfileOpen}
          >
            <Avatar className="cursor-pointer">
              <Avatar.Image
                alt={user?.name ?? "Profile"}
                src={user?.image || 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg'}
              />
              <Avatar.Fallback>{user.name?.[0] ?? "U"}</Avatar.Fallback>
            </Avatar>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
              {user?.role === "admin" ? (
                <Link
                  href={`/dashboard/${user.role}`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-bg"
                >
                  <LayoutHeader className="h-4 w-4" />
                  Dashboard
                </Link>
              ) :
                (
                  <Link
                    href={`/dashboard/user/cart`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-bg"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                  </Link>
                )
              }
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-primary hover:bg-bg"
              >
                <ArrowRightFromSquare className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/auth/signin">
          <Button size="sm" className="bg-primary font-semibold text-white">
            Sign in
          </Button>
        </Link>
      )}
    </>
  );

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
                className="text-sm text-text-muted hover:text-text"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right content */}
        <div className="hidden items-center gap-3 md:flex">
          {user?.role !== "admin" && (
            <button
              aria-label="Cart"
              className="relative rounded-full border border-border p-2 hover:border-text"
            >
              <ShoppingCart className="h-4 w-4 text-text" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                0
              </span>
            </button>
          )}
          {navEnd}
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
              {navEnd}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}