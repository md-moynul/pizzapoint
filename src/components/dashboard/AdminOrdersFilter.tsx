'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Magnifier, Xmark } from '@gravity-ui/icons';

interface AdminOrdersFilterProps {
  initialSearch?: string;
  initialDeliveryStatus?: string;
}

const deliveryStatusOptions = [
  { id: 'all', label: 'All Orders' },
  { id: 'active', label: '⏳ Active' },
  { id: 'Cooking', label: '👨‍🍳 Cooking' },
  { id: 'On Delivery', label: '🛵 On Delivery' },
  { id: 'Delivered', label: '🎉 Delivered' },
];

export default function AdminOrdersFilter({
  initialSearch = '',
  initialDeliveryStatus = 'all',
}: AdminOrdersFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [deliveryStatus, setDeliveryStatus] = useState(initialDeliveryStatus);

  const applyFilters = (nextSearch: string, nextStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    if (nextSearch.trim()) {
      params.set('q', nextSearch.trim());
    } else {
      params.delete('q');
    }

    if (nextStatus && nextStatus !== 'all') {
      params.set('deliveryStatus', nextStatus);
    } else {
      params.delete('deliveryStatus');
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== initialSearch) {
        applyFilters(search, deliveryStatus);
      }
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleStatusChange = (st: string) => {
    setDeliveryStatus(st);
    applyFilters(search, st);
  };

  const handleClear = () => {
    setSearch('');
    setDeliveryStatus('all');
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(
    search || (deliveryStatus && deliveryStatus !== 'all')
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
          placeholder="Search by customer, phone, email, address..."
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

      {/* Delivery Status Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {deliveryStatusOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleStatusChange(opt.id)}
            className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all border ${
              deliveryStatus === opt.id
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {opt.label}
          </button>
        ))}

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
    </div>
  );
}
