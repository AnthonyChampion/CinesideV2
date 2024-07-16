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
                if (!auth?.token) {
                    throw new Error('Authorization token is missing');
                }

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                });

                if (response.status !== 200) {
                    throw new Error('Failed to fetch users');
                }

                setUsers(response.data);
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

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Gestion des utlisateurs</h2>
            {error && <div className="text-white">Error: {error}</div>}
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
