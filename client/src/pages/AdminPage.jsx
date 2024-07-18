import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function AdminPage() {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    const [editUser, setEditUser] = useState(null);
    const [editUserData, setEditUserData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleEditClick = (user) => {
        setEditUser(user.id);
        setEditUserData({
            name: user.name,
            email: user.email,
            password: "",
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/users/${editUser}`, editUserData);

            setEditUser(null);
            window.location.reload();

            navigate(`/admin`);

        } catch (error) {
            console.error("Error updating user:", error);
            setError("Failed to update user");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`);

            navigate(`/admin`);

        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Failed to delete user");
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
                setUsers(response.data);
            } catch (error) {
                setError('Failed to fetch users');
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
            {error && <div className="text-white mb-4">Erreur: {error}</div>}

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
                    <thead className="bg-gray-200">
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
                                {editUser === user.id ? (
                                    <>
                                        <td className="py-2 px-4 border-b border-gray-300">
                                            {user.id}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-300">
                                            <input
                                                type="text"
                                                name="name"
                                                value={editUserData.name}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded-md"
                                                placeholder="Nom"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-300">
                                            <input
                                                type="email"
                                                name="email"
                                                value={editUserData.email}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full rounded-md"
                                                placeholder="Email"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-300">
                                            <div className="flex justify-start">
                                                <button
                                                    type="button"
                                                    className="bg-green-800 text-white py-1 px-3 rounded-md hover:bg-green-800 hover:text-white mr-2"
                                                    onClick={handleEditSubmit}
                                                >
                                                    Enregistrer
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-700"
                                                    onClick={() => setEditUser(null)}
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.id}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{user.email}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
