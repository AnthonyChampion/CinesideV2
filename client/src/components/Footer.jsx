import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="dark:bg-[#0a0a0b] bg-white rounded-lg shadow m-4 dark:text-white text-[#101522] md:mt-20 mb-20 md:mb-0">
            <div className="w-[90%] mx-auto p-4 md:py-8">
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-400 lg:my-8" />
                <div className="flex  md:items-center md:justify-between justify-center">
                    <img src="../src/assets/cinelogo.png" className="h-8 w-28" alt="Cineside logo" />
                    <ul className="hidden md:flex flex-wrap items-center mb-6 text-sm font-medium text-[#101522] sm:mb-0 dark:text-gray-400">
                        <Link to="/" className="hover:text-cyan-700 me-4 md:me-6">
                            Accueil
                        </Link>
                        <Link to="/film_par_genre" className="hover:text-cyan-700 me-4 md:me-6">
                            Genres
                        </Link>
                        <Link to="/film_par_annee" className="hover:text-cyan-700 me-4 md:me-6">
                            Années
                        </Link>
                        <Link to="https://github.com/AnthonyChampion/CinesideV2" className="me-4 md:me-6 dark:bg-transparent bg-[#0a0a0b] rounded-full">
                            <img src="../src/assets/github.png" className="h-7 w-7" />
                        </Link>
                    </ul>
                </div>
                <span className="block mt-4 text-sm text-[#101522] text-center dark:text-gray-400">© 2024 Cineside. ArcWeb. Données fournies par TMDB</span>
            </div>
        </footer>
    );
}

export default Footer;



