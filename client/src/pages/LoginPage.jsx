import React, { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        setError('');

        if (!email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.SERVER_PORT}/login`, { email, password });

            console.log('Connexion effectuée !', response);


        } catch (error) {
            console.error('Erreur lors de la connexion:', error.message);
            setError(error.response ? error.response.message : 'Erreur lors de la connexion');
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-[#101522]">
            <div className="bg-zinc-800 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md -mt-10">
                <h1 className="text-2xl font-bold text-white mb-4">Connexion</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
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
                        />
                    </div>
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
