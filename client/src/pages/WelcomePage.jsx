import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen text-white">
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-5xl font-bold mb-4">Bienvenue sur Cineside !</h1>
                <p className="text-lg mb-6 text-center">
                    Votre portail vers le monde magique du cinéma.
                </p>
                <Link to="/accueil" className="relative inline-block w-40 border-4 border-cyan-200 py-2 px-6 text-cyan-200 font-bold bg-cyan-800 rounded-xl outline-none shadow-glow hover:text-cyan-800 hover:bg-cyan-200 transition-all duration-300 text-center">
                    Entrer
                </Link>
            </div>
            <style>{`
                .shadow-glow {
                    box-shadow: 0 0 1em 0.25em rgb(174, 234, 255),
                                0 0 4em 1em rgba(135, 206, 235, 0.781),
                                inset 0 0 0.75em 0.25em rgb(174, 234, 255);
                    text-shadow: 0 0 0.5em rgb(174, 234, 255);
                }

                .shadow-glow::after {
                    content: "";
                    position: absolute;
                    top: 120%;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(135, 206, 235, 0.781);
                    filter: blur(2em);
                    opacity: 0.7;
                    transform: perspective(1.5em) rotateX(35deg) scale(1, 0.6);
                    pointer-events: none;
                }

                .shadow-glow:active {
                    box-shadow: 0 0 0.6em 0.25em rgb(174, 234, 255),
                                0 0 2.5em 2em rgba(135, 206, 235, 0.781),
                                inset 0 0 0.5em 0.25em rgb(174, 234, 255);
                }
            `}</style>
        </div>
    );
}
