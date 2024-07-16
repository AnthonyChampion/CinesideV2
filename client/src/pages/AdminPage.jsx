import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminPage = () => {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
                    headers: {
                        'Authorization': `Bearer ${auth?.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);

            } catch (error) {
                setError(error.message);

            }
        };

        if (auth && auth.isAdmin) {
            fetchUsers();
        }
    }, [auth]);

    if (!auth || !auth.isAdmin) {
        return <p>Acces refusé. Vous n'êtes pas administrateur.</p>;
    }

    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gestion des utlisateurs</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200">ID</th>
                            <th className="py-2 px-4 border-b border-gray-200">Nom</th>
                            <th className="py-2 px-4 border-b border-gray-200">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b border-gray-200">{user.id}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{user.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
