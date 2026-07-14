import { serverFetch } from "../core/server"


export const getAllPizzas = async () => {
   return serverFetch('/api/pizza')
}