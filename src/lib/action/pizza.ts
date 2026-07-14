import { getClientToken } from "../core/clientToken"
import { protectedMutation } from "../core/server"


export const postPizza = async (data :object) => {
    const token = await getClientToken()

    return protectedMutation('/api/pizza/admin/add', data , token ? token : '')
}