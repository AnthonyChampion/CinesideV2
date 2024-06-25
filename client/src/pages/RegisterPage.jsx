import React, { useState } from 'react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();

        // Réinitialiser les erreurs
        setError('');

        // Validation simple
        if (!name || !email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        // Ajouter ici la logique d'enregistrement, comme appeler une API

        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center mt-10">
            <div className="bg-zinc-800 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-4">Inscription</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-white mb-2">Nom</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
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
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                    >
                        S'inscrire
                    </button>
                </form>
            </div>
        </div>
    );
}
