import { serverFetch } from "../core/server"


export const getAllPizzas = async () => {
   return serverFetch('/api/pizza')
}

export const getPizzaById = async (id: string) => {
  return serverFetch(`/api/pizza/${id}`)
}