import { getClientToken } from "../core/clientToken";
import { protectedMutation } from "../core/server"


export const addToCart = async (cartData: object) => {
    console.log(cartData);
    const token = await getClientToken();
    return protectedMutation("/api/cart/add", cartData, token ? token : '', 'POST');
}