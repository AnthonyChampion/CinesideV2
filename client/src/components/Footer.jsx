import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-zinc-900 text-white py-6">
            <div className="container mx-auto text-center">
                <div className="mb-4 flex justify-center items-center">
                    <svg className="w-6 h-6 text-gray-400 hover:text-white mx-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.112.82-.262.82-.582 0-.287-.01-1.045-.015-2.05-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.73.083-.73 1.204.084 1.837 1.236 1.837 1.236 1.07 1.835 2.81 1.305 3.495.998.108-.775.42-1.305.762-1.605-2.665-.3-5.467-1.335-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.123-.3-.535-1.515.117-3.155 0 0 1.005-.322 3.3 1.23.957-.266 1.98-.4 3-.405 1.02.005 2.043.14 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.655 1.64.243 2.855.12 3.155.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.478 5.92.43.37.81 1.1.81 2.22 0 1.606-.015 2.897-.015 3.292 0 .322.217.698.825.58C20.565 21.798 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <Link to="https://github.com/AnthonyChampion/Cineside" className="text-gray-400 hover:text-white">GitHub</Link>
                </div>
                <p className="text-sm">© 2024 Anthony Champion Rodrigues.</p>
                <div className="flex justify-center space-x-2 pt-1">
                    <p className="text-sm">Données via</p>
                    <img className="w-8" src='../src/assets/tmdb.png' />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
