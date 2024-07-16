import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminPage = () => {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);

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
        return <p>Accès refusé. Vous n'êtes pas administrateur.</p>;
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Gestion des utilisateurs</h2>
            {error && <div className="text-white mb-4">Error: {error}</div>}

            <div className="mb-4">
                <input
                    type="text"
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Rechercher des utilisateurs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-200 ">
                        <tr>
                            <th className="text-start py-2 px-4 border-b border-gray-300">ID</th>
                            <th className="text-start py-2 px-4 border-b border-gray-300">Nom</th>
                            <th className="text-start py-2 px-4 border-b border-gray-300">Email</th>
                            <th className="text-start py-2 px-4 border-b border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b border-gray-300">{user.id}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{user.name}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{user.email}</td>
                                <td className="py-2 px-4 border-b border-gray-300">
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Modifier</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
