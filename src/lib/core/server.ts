import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export const serverMutation = async (path: string, data: object, method: string = 'POST') => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: {
            'content-type': 'application/json',
        },
        // Dynamically spreads the body property only if data is truthy
        ...(data && { body: JSON.stringify(data) }),
    });
    return res.json();
};
export const protectedMutation = async (path: string, data :object, token : string, method: string = 'POST') => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: {
            'content-type': 'application/json',
            'authorization': token
        },
        // Dynamically spreads the body property only if data is truthy
        ...(data && { body: JSON.stringify(data) }),
    });
    if (res.status === 401) {
        redirect('/auth/login');
    }
    if (res.status === 403) {
        redirect('/unauthorized');
    }
    return res.json();
};

export const serverFetch = async (path :string) => {
    const res = await fetch(`${baseUrl}${path}`);
    return res.json();
};