import { serverFetch, protectedFetch } from "../core/server";
import { getServerToken } from "../core/serverToken";

interface GetAllOrdersArgs {
  q?: string;
  deliveryStatus?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const getOrdersByUserId = async (userId: string) => {
  const token = await getServerToken();
  return protectedFetch(`/api/orders/user/${userId}`, token);
};

export const getAllOrders = async ({
  q,
  deliveryStatus,
  status,
  page = 1,
  limit = 8,
}: GetAllOrdersArgs = {}) => {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (deliveryStatus && deliveryStatus !== "all") sp.set("deliveryStatus", deliveryStatus);
  if (status && status !== "all") sp.set("status", status);
  if (page) sp.set("page", page.toString());
  if (limit) sp.set("limit", limit.toString());

  const qs = sp.toString();
  return serverFetch(qs ? `/api/orders/all?${qs}` : `/api/orders/all`);
};
