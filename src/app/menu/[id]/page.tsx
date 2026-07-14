import { getPizzaById } from '@/lib/api/pizza';
import React from 'react';

const PizzaDeatilsPage = async ({ params }: Readonly<{ params: { id: string } }>
) => {
    const {id} = await params;
    const pizza = await getPizzaById(id);
    console.log(pizza)
    return (
        <div>
            {id}
        </div>
    );
};

export default PizzaDeatilsPage;