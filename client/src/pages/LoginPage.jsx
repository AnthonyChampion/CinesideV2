import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        console.log(`API URL: ${import.meta.env.VITE_API_URL}/login`);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });

            const { token } = response.data;
            login(token);

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            navigate('/');
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Une erreur est survenue');
            } else {
                setErrorMessage('Erreur de connexion. Veuillez réessayer.');
            }
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-[#101522]">
            <div className="bg-zinc-800 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md -mt-10">
                <h1 className="text-2xl font-bold text-white mb-4">Connexion</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-white mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-white mb-2">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-cyan-700 transition duration-300"
                    >
                        Connexion
                    </button>
                </form>
                <p className="mt-4 text-white text-center">
                    Vous n'avez pas de compte ? <Link to="/inscription" className="text-green-500 hover:underline">S'enregistrer</Link>
                </p>
            </div>
        </div>
    );
}
