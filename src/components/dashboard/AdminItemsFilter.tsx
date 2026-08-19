'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Magnifier, Xmark } from '@gravity-ui/icons';

interface AdminItemsFilterProps {
  initialSearch?: string;
  initialCategory?: string;
}

export default function AdminItemsFilter({
  initialSearch = '',
  initialCategory = 'all',
}: AdminItemsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const applyFilters = (nextSearch: string, nextCategory: string) => {
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

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== initialSearch) {
        applyFilters(search, category);
      }
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    applyFilters(search, cat);
  };

  const handleClear = () => {
    setSearch('');
    setCategory('all');
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(search || (category && category !== 'all'));

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Magnifier className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pizzas by name..."
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-9 text-sm text-text placeholder:text-text-muted outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text cursor-pointer"
            aria-label="Clear search"
          >
            <Xmark className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'veg', label: 'Veg' },
          { id: 'non-veg', label: 'Non-Veg' },
        ].map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleCategoryChange(opt.id)}
            className={`cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border ${
              category === opt.id
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-surface text-text-muted border-border hover:bg-bg hover:text-text'
            }`}
          >
            {opt.label}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="cursor-pointer rounded-xl px-3 py-2 text-xs font-medium text-text-muted hover:text-primary transition-colors whitespace-nowrap"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
