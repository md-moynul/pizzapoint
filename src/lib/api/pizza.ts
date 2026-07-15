import { serverFetch } from "../core/server"


interface GetAllPizzasArgs {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}

export const getAllPizzas = async ({ q, category, minPrice, maxPrice }: GetAllPizzasArgs) => {
  return serverFetch(`/api/pizza?q=${q ?? ''}&category=${category ?? ''}&minPrice=${minPrice ?? ''}&maxPrice=${maxPrice ?? ''}`)
}

export const getPizzaById = async (id: string) => {
  return serverFetch(`/api/pizza/${id}`)
}