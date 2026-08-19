import { serverFetch } from "../core/server";

interface GetInventoryArgs {
  q?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const getInventoryItems = async ({
  q,
  category,
  status,
  page = 1,
  limit = 8,
}: GetInventoryArgs = {}) => {
  return serverFetch(
    `/api/inventory?q=${q ?? ''}&category=${category ?? ''}&status=${status ?? ''}&page=${page}&limit=${limit}`
  );
};

export const getAllInventoryItems = async () => {
  return serverFetch(`/api/inventory/all`);
};
