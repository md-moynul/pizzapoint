// components/dashboard/DashboardSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutSideContentLeft,
    LayoutCellsLarge,
    ShoppingCart,
    Box,
    Plus,
    ListCheck,
    Bell,
    Person,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";

interface DashboardSidebarProps {
    user?: { name?: string; role?: string };
}
interface navItems {
    icon: any;
    label: string;
    href: string;
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
    const pathname = usePathname();

   
    const adminNavItems: navItems[] = [
        {
            icon: LayoutCellsLarge,
            label: "Overview",
            href: "/dashboard/admin",
        },
        {
            icon: ShoppingCart,
            label: "Orders",
            href: "/dashboard/admin/orders",
        },
        {
            icon: Box,
            label: "Inventory",
            href: "/dashboard/admin/inventory",
        },
        {
            icon: Plus,
            label: "Add Item",
            href: "/dashboard/admin/items/add",
        },
        {
            icon: ListCheck,
            label: "Manage Items",
            href: "/dashboard/admin/items",
        },
        {
            icon: Bell,
            label: "Stock Alerts",
            href: "/dashboard/admin/alerts",
        },
        {
            icon: Person,
            label: "Profile",
            href: "/dashboard/profile",
        },
    ];

    // `onLinkClick` lets us close the drawer on mobile when a nav item is tapped.
    const renderNavLinks = (onLinkClick?: () => void) => (
        <nav className="flex w-full flex-col gap-1.5">
            {adminNavItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link key={item.href} href={item.href} onClick={onLinkClick}>
                        <button
                            type="button"
                            className={`group relative flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-muted hover:bg-surface hover:text-text"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <IconComponent
                                    className={`h-5 w-5 ${isActive
                                            ? "text-primary"
                                            : "text-text-muted group-hover:text-text"
                                        }`}
                                />
                                <span>{item.label}</span>
                            </div>

                            {isActive && (
                                <div className="absolute right-0 top-1/4 h-1/2 w-0.5 rounded-l bg-primary" />
                            )}
                        </button>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div>
            {/* Mobile Header + Drawer
          IMPORTANT (HeroUI v3): the trigger button must be the FIRST child of
          <Drawer>, with <Drawer.Backdrop> as the second child. If the trigger
          isn't the first child, v3's DialogTrigger wiring breaks and the
          drawer never opens. */}
            <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border p-4 lg:hidden">
                <Drawer>
                    <Button
                        size="sm"
                        className="gap-2 rounded-xl border-border text-text"
                    >
                        <LayoutSideContentLeft className="h-4 w-4" />
                        Menu
                    </Button>

                    <Drawer.Backdrop>
                        <Drawer.Content
                            placement="left"
                            className="fixed inset-y-0 left-0 z-50 h-screen w-72 max-w-72 overflow-y-auto border-r border-border bg-bg"
                        >
                            <Drawer.Dialog className="p-5 text-text">
                                {({ close }: { close: () => void }) => (
                                    <>
                                        <Drawer.Header className="mb-6 p-0">
                                            <div>
                                                <h2 className="font-display text-2xl font-semibold text-text">
                                                    PizzaPoint
                                                </h2>
                                                <p className="text-sm text-text-muted">
                                                    Admin Dashboard
                                                </p>
                                            </div>
                                        </Drawer.Header>

                                        <Drawer.Body className="p-0">
                                            {renderNavLinks(close)}
                                        </Drawer.Body>
                                    </>
                                )}
                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                </Drawer>
            </div>

            {/* Desktop Sidebar */}
            <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-border bg-bg p-5 lg:flex">
                <div className="mb-8">
                    <h2 className="font-display text-2xl font-semibold text-text">
                        PizzaPoint
                    </h2>
                    <p className="text-sm text-text-muted">Admin Dashboard</p>
                </div>

                {renderNavLinks()}

                <div className="mt-auto rounded-2xl border border-border p-4">
                    <p className="text-sm font-medium text-text">
                        {user?.name ?? "Admin"}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                        Signed in as {user?.role ?? "admin"}
                    </p>
                </div>
            </aside>
        </div>
    );
}