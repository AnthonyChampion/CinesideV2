import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-[#101522] rounded-lg shadow dark:bg-gray-900 m-4 text-white mt-20">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center mb-4 sm:mb-0 space-x-1 rtl:space-x-reverse">
                        <img src="../src/assets/cinelogo.png" className="h-7 w-7" alt="Cineside logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ineside</span>
                    </div>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <Link to="/" className="hover:underline me-4 md:me-6">
                            Accueil
                        </Link>
                        <Link to="/films" className="hover:underline me-4 md:me-6">
                            Films
                        </Link>
                        <Link to="https://github.com/AnthonyChampion/CinesideV2" className="hover:underline me-4 md:me-6">
                            <img src="../src/assets/github.png" className="h-7 w-7" />
                        </Link>
                    </ul>
                </div>
                <span className="block mt-4 text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 Cineside. ArcWeb. Données fournies par TMDB</span>
            </div>
        </footer>
    );
}

export default Footer;



