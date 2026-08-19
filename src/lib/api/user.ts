import { protectedFetch } from "../core/server";
import { getServerToken } from "../core/serverToken";

interface GetUserArgs {
  q?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export const getUser = async ({
  q,
  role,
  page = 1,
  limit = 10,
}: GetUserArgs = {}) => {
  const token = await getServerToken();
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (role && role !== "all") sp.set("role", role);
  if (page) sp.set("page", page.toString());
  if (limit) sp.set("limit", limit.toString());

  const qs = sp.toString();
  return protectedFetch(qs ? `/api/users?${qs}` : `/api/users`, token);
};