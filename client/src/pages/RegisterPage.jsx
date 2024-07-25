import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
    const [error, setError] = useState('');
    const [message, setMessage] = useState("");
    const [formDatas, setFormDatas] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { login } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDatas((prevState) => ({ ...prevState, [name]: value }));
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/register`,
                formDatas
            );
            const { user, token } = response.data;
            login(user, token);

            navigate(`/`);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white dark:bg-[#18181b]">
            <div className="bg-zinc-800 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md -mt-6">
                <h1 className="text-2xl font-bold text-white mb-4">Inscription</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {message && <p className="text-green-500 mb-4">{message}</p>}
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-white mb-2">Nom</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formDatas.name}
                            onChange={handleChange}
                            placeholder='Nom'
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-white mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formDatas.email}
                            onChange={handleChange}
                            placeholder='Email'
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-white mb-2">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formDatas.password}
                            onChange={handleChange}
                            placeholder='Mot de passe'
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-cyan-700 text-white font-bold py-2 px-4 rounded hover:bg-white hover:text-cyan-700 transition duration-300"
                    >
                        S'inscrire
                    </button>
                </form>
            </div>
        </div>
    );
}
