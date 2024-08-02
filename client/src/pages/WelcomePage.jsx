import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen text-white">
            <img className="absolute inset-0 z-0 h-[45vh] w-screen object-cover" src="../src/assets/gradient.png" alt="Background Gradient" />
            <div className="absolute inset-0 z-0 h-[45vh] bg-gradient-to-t from-[#0a0a0b] via-transparent" />
            <div className="absolute inset-0 z-0 h-[45vh] bg-gradient-to-r from-[#0a0a0b] via-transparent" />
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="md:text-5xl text-3xl font-bold mb-4">Bienvenue sur </h1>
                <img src="../src/assets/cinelogo.png" className="md:w-[20rem] md:h-20 w-48 h-18" />
                <p className="md:text-lg text-md mt-4 mb-6 text-center">
                    Votre portail vers le monde magique du cinéma.
                </p>
                <Link to="/accueil" className="relative inline-block w-40 border-4 border-white py-2 px-6 text-white font-bold bg-red-700 rounded-xl outline-none shadow-glow hover:text-black hover:bg-white transition-all duration-300 text-center">
                    Entrer
                </Link>
            </div>
            <style>{`
                .shadow-glow {
                box-shadow: 0 0 1em 0.25em rgb(255, 255, 255), /* White outer glow */
                    0 0 4em 1em rgba(255, 0, 0, 0.6), /* Red glow with transparency */
                    inset 0 0 0.75em 0.25em rgb(255, 0, 0); /* Red inner glow */
                    text-shadow: 0 0 0.5em rgb(255, 0, 0); /* Red text shadow */
                    }

                .shadow-glow::after {
                    content: "";
                    position: absolute;
                    top: 120%;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(255, 0, 0, 0.6); /* Lighter red with transparency */
                    filter: blur(2em);
                    opacity: 0.7;
                    transform: perspective(1.5em) rotateX(35deg) scale(1, 0.6);
                    pointer-events: none;
                    }

                .shadow-glow:active {
                    box-shadow: 0 0 0.6em 0.25em rgb(255, 255, 255), /* White outer glow on active */
                    0 0 2.5em 2em rgba(255, 0, 0, 0.6), /* Red glow with transparency */
                    inset 0 0 0.5em 0.25em rgb(255, 0, 0); /* Red inner glow */
                    }
            `}</style>
        </div>
    );
}
