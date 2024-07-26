import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('/path/to/your/movie-background.jpg')" }}>
            <img className='absolute inset-0' src="../src/assets/darkknight.jpg" />
            <div className="absolute inset-0 bg-black opacity-80"></div>
            <div className="relative z-10 flex flex-col items-start">
                <h1 className="text-5xl font-bold mb-4">Bienvenue sur Cineside !</h1>
                <p className="text-lg mb-6">
                    Votre portail vers le monde magique du cinéma.<br />
                    Plongez dans les dernières nouveautés et découvrez des trésors cinématographiques qui éveilleront vos émotions.
                </p>
                <Link to="/accueil" className="bg-cyan-700 hover:bg-white hover:text-black hover:border hover:border-black text-white py-2 px-4 rounded transition duration-300">
                    Entrer
                </Link>
            </div>
        </div>
    );
}
