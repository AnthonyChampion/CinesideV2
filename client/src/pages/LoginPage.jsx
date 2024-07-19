import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setShowPopup(false);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });

            login(response.data.user, response.data.token);

            // Show popup and navigate after a short delay to allow the user to see the popup
            setShowPopup(true);
            setTimeout(() => navigate('/'), 2000);
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
            {showPopup && (
                <div className="absolute inset-0 flex justify-center items-center z-50 w-full bg-black bg-opacity-70">
                    <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg transform scale-95 transition-transform duration-300 ease-in-out">
                        <p className="text-lg font-semibold mb-2">Connexion réussie !</p>
                        <p className="text-sm">Vous serez redirigé vers la page d'accueil dans quelques secondes.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
