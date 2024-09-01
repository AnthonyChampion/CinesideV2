import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PopupMessage from '../components/PopupMessage';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [popupMessage, setPopupMessage] = useState({ message: '', type: '' });

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        setPopupMessage({ message: '', type: '' });

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { name, email, password });

            if (response.data.user && response.data.token) {
                login(response.data.user, response.data.token);
                setPopupMessage({ message: 'Inscription réussie !', type: 'success' });
                setTimeout(() => {
                    setPopupMessage({ message: '', type: '' });
                    navigate('/accueil');
                }, 2000);
            } else {
                setPopupMessage({ message: 'Erreur lors de l\'inscription', type: 'error' });
            }
        } catch (error) {
            const errorMessage = error.response ? (error.response.data.error || 'Une erreur est survenue. Veuillez ressayer !') : 'Une erreur est survenue. Veuillez ressayer !';
            setPopupMessage({ message: errorMessage, type: 'error' });
        }

    };

    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-zinc-800 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md mt-4">
                <h1 className="text-2xl font-bold text-white mb-4">Inscription</h1>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-white mb-2">Nom</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                            placeholder="Nom"
                        />
                    </div>
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
                            placeholder="Email"
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
                            autoComplete="new-password"
                            placeholder="Mot de passe"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-white hover:text-red-600 transition duration-300"
                    >
                        S'inscrire
                    </button>
                </form>
                <p className="mt-4 text-white text-center">
                    Vous avez déjà un compte ? <Link to="/connexion" className="text-red-600 hover:text-white">Connectez-vous !</Link>
                </p>
            </div>
            {popupMessage.message && (
                <PopupMessage
                    message={popupMessage.message}
                    type={popupMessage.type}
                    onClose={() => setPopupMessage({ message: '', type: '' })}
                />
            )}
        </div>
    );
}
