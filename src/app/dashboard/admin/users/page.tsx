import { constructMetadata } from '@/lib/metadata';
import { getUser } from '@/lib/api/user';
import React from 'react';
import UserTable, { User } from './UserTable';
import PizzaPagination from '@/components/home/Pagination';

export const metadata = constructMetadata({
  title: 'Dashboard | Admin | Users | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});

interface AdminUsersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function Page({ searchParams }: AdminUsersPageProps) {
  const { page, limit: queryLimit } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const limit = parseInt(queryLimit || "10", 10);

  const res = await getUser({ page: currentPage, limit }).catch(() => ({
    data: [],
    pagination: { totalPages: 1, totalItems: 0 },
  }));

  const users: User[] = Array.isArray(res) ? res : res?.data || [];
  const totalPages = res?.pagination?.totalPages || 1;
  const totalUsers = res?.pagination?.totalItems ?? users.length;

  const sp = new URLSearchParams();
  if (queryLimit && queryLimit !== "10") sp.set("limit", queryLimit);
  const paramsStr = sp.toString();

  return (
    <div className="p-6 max-w-7xl mx-auto flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2420] dark:text-[#F4EDE4]">
            Users List
          </h1>
          <p className="mt-1 text-sm text-[#6B6155] dark:text-[#9C9388]">
            Manage registered users and customer accounts.
          </p>
        </div>
        <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary self-start sm:self-auto">
          Total Users: {totalUsers}
        </div>
      </div>

      <UserTable users={users} />

      <div className="mt-6">
        <PizzaPagination
          page={currentPage}
          totalPages={totalPages}
          paramsStr={paramsStr}
          link="/dashboard/admin/users"
        />
      </div>
    </div>
  );
}