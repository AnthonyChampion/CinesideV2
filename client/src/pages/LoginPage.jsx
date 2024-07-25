import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LoginModal from '../components/LoginModal';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setShowErrorModal(false); // Hide the error modal initially

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });

            if (response.data.user && response.data.token) {
                login(response.data.user, response.data.token);
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigate('/');
                }, 2000);
            } else {
                setErrorMessage('Utilisateur ou mot de passe incorrect');
                setShowErrorModal(true);
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Une erreur est survenue');
            } else {
                setErrorMessage('Erreur de connexion. Veuillez réessayer.');
            }
            setShowErrorModal(true);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center dark:bg-[#18181b] bg-white">
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
                    <button
                        type="submit"
                        className="w-full bg-cyan-700 text-white font-bold py-2 px-4 rounded hover:bg-white hover:text-cyan-700 transition duration-300"
                    >
                        Connexion
                    </button>
                </form>
                <p className="mt-4 text-white text-center">
                    Vous n'avez pas de compte ? <Link to="/inscription" className="text-cyan-700 hover:text-white">S'enregistrer</Link>
                </p>
            </div>
            <LoginModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Succès"
            >
                <p>Connexion réussie !</p>
            </LoginModal>
            <LoginModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Erreur"
            >
                <p>{errorMessage}</p>
            </LoginModal>
        </div>
    );
}
