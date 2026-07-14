import { getCart } from '@/lib/api/cart';
import { getServerSession } from '@/lib/sessions/serverSession';
import React from 'react';

const CartPage = async () => {
    const user = await getServerSession();
    const cart = await getCart(user?.id || '');
    console.log(cart);
    return (
        <div>
            
        </div>
    );
};

export default CartPage;