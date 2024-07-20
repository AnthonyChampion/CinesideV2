import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProfilPage = () => {
    const { auth } = useAuth();
    const [error, setError] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [editUserData, setEditUserData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleEditClick = (auth) => {
        setEditUser(auth.id);
        setEditUserData({
            name: auth.name,
            email: auth.email,
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
            await axios.put(`${import.meta.env.VITE_API_URL}/users/${auth.id}`, editUserData);

            setEditUser(null);
            window.location.reload();

        } catch (error) {
            console.error("Error updating user:", error);
            setError("Failed to update user");
        }
    };

    return (
        <div className="container mx-auto mt-14 px-4">
            <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden md:max-w-6xl">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {/* Mobile view */}
                <div className="block md:hidden">
                    {editUser === auth.id ? (
                        <div className="p-4 border-b border-gray-200">
                            <div className="mb-4">
                                <label className="block text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editUserData.name}
                                    onChange={handleInputChange}
                                    className="border p-2 w-full rounded-md"
                                    placeholder="Nom"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editUserData.email}
                                    onChange={handleInputChange}
                                    className="border p-2 w-full rounded-md"
                                    placeholder="Email"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={editUserData.password}
                                    onChange={handleInputChange}
                                    className="border p-2 w-full rounded-md"
                                    placeholder="Nouveau mot de passe"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="bg-green-800 text-white py-1 px-3 rounded-md hover:bg-green-900"
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
                        </div>
                    ) : (
                        <div className="p-4 border-b border-gray-200">
                            <div className="mb-2">
                                <span className="font-semibold">Nom: </span>{auth.name}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Email: </span>{auth.email}
                            </div>
                            <div className="mb-4">
                                <span className="font-semibold">Mot de passe: </span>{"********"}
                            </div>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => handleEditClick(auth)}
                            >
                                Modifier
                            </button>
                        </div>
                    )}
                </div>

                {/* Desktop view */}
                <div className="hidden md:block">
                    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-200 text-left">
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-300">Nom</th>
                                    <th className="py-2 px-4 border-b border-gray-300">Email</th>
                                    <th className="py-2 px-4 border-b border-gray-300">Mot de passe</th>
                                    <th className="py-2 px-4 border-b border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {editUser === auth.id ? (
                                        <>
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
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={editUserData.password}
                                                    onChange={handleInputChange}
                                                    className="border p-2 w-full rounded-md"
                                                    placeholder="Nouveau mot de passe"
                                                />
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-300">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        className="bg-green-800 text-white py-1 px-3 rounded-md hover:bg-green-900"
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
                                            <td className="py-2 px-4 border-b border-gray-300">{auth.name}</td>
                                            <td className="py-2 px-4 border-b border-gray-300">{auth.email}</td>
                                            <td className="py-2 px-4 border-b border-gray-300">{"********"}</td>
                                            <td className="py-2 px-4 border-b border-gray-300">
                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                                    onClick={() => handleEditClick(auth)}
                                                >
                                                    Modifier
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="md:hidden mt-10 text-center">
                <Link to="/favoris" className="bg-cyan-700 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Voir mes favoris
                </Link>
            </div>
        </div>
    );
};

export default ProfilPage;
