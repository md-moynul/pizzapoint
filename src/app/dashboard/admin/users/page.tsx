import { getUser } from '@/lib/api/user';
import React from 'react';
import UserTable, { User } from './UserTable'; // Adjust path if necessary

export default async function Page() {
    // Assuming getUser() returns an array of users (e.g. User[])
    const users: User[] = await getUser();
    
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-[#2B2420] dark:text-[#F4EDE4]">
                Users List
            </h1>
            <UserTable users={users} />
        </div>
    );
}