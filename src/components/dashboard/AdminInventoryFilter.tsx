'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Magnifier, Xmark } from '@gravity-ui/icons';

interface AdminInventoryFilterProps {
  initialSearch?: string;
  initialCategory?: string;
  initialStatus?: string;
}

const inventoryCategories = [
  { id: 'all', label: 'All Categories' },
  { id: 'base', label: 'Base / Crust' },
  { id: 'sauce', label: 'Sauce' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'topping', label: 'Topping' },
  { id: 'meat', label: 'Meat' },
  { id: 'spice', label: 'Spice' },
  { id: 'other', label: 'Other' },
];

const stockStatuses = [
  { id: 'all', label: 'All Stock Status' },
  { id: 'instock', label: '✓ In Stock' },
  { id: 'low', label: '⚠️ Low Stock' },
];

export default function AdminInventoryFilter({
  initialSearch = '',
  initialCategory = 'all',
  initialStatus = 'all',
}: AdminInventoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);

  const applyFilters = (nextSearch: string, nextCategory: string, nextStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    if (nextSearch.trim()) {
      params.set('q', nextSearch.trim());
    } else {
      params.delete('q');
    }

    if (nextCategory && nextCategory !== 'all') {
      params.set('category', nextCategory);
    } else {
      params.delete('category');
    }

    if (nextStatus && nextStatus !== 'all') {
      params.set('status', nextStatus);
    } else {
      params.delete('status');
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== initialSearch) {
        applyFilters(search, category, status);
      }
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    applyFilters(search, cat, status);
  };

  const handleStatusChange = (st: string) => {
    setStatus(st);
    applyFilters(search, category, st);
  };

  const handleClear = () => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(
    search || (category && category !== 'all') || (status && status !== 'all')
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Magnifier className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ingredient by name..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-9 text-sm text-gray-900 placeholder:text-gray-400 outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Clear search"
          >
            <Xmark className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-hidden focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer shadow-xs"
      >
        {inventoryCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>

      {/* Stock Status Dropdown */}
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-hidden focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer shadow-xs"
      >
        {stockStatuses.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="cursor-pointer rounded-xl px-3 py-2 text-xs font-medium text-gray-500 hover:text-primary transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Reset
        </button>
      )}
    </div>
  );
}
