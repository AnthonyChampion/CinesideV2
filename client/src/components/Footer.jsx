import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="dark:bg-[#18181b] bg-white rounded-lg shadow m-4 dark:text-white text-[#101522] md:mt-20 mb-20 md:mb-0">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-400 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center mb-4 sm:mb-0 space-x-1 rtl:space-x-reverse">
                        <img src="../src/assets/cinelogo.png" className="h-7 w-7" alt="Cineside logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ineside</span>
                    </div>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-[#101522] sm:mb-0 dark:text-gray-400">
                        <Link to="/" className="hover:text-cyan-700 me-4 md:me-6">
                            Accueil
                        </Link>
                        <Link to="/film_par_genre" className="hover:text-cyan-700 me-4 md:me-6">
                            Genres
                        </Link>
                        <Link to="/film_par_annee" className="hover:text-cyan-700 me-4 md:me-6">
                            Années
                        </Link>
                        <Link to="https://github.com/AnthonyChampion/CinesideV2" className="me-4 md:me-6 dark:bg-transparent bg-[#101522] rounded-full">
                            <img src="../src/assets/github.png" className="h-7 w-7" />
                        </Link>
                    </ul>
                </div>
                <span className="block mt-4 text-sm text-[#101522] md:text-center dark:text-gray-400">© 2024 Cineside. ArcWeb. Données fournies par TMDB</span>
            </div>
        </footer>
    );
}

export default Footer;



