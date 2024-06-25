import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { TiThMenuOutline } from 'react-icons/ti';
import { IoLogIn, IoLogOut, IoHeart, IoFilm, IoStar } from 'react-icons/io5';
import MovieSearch from './MovieSearch';

export default function NavBar({ showSearch }) {
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function openModal() {
        setFilterModalIsOpen(!filterModalIsOpen);
    }

    const handleClick = () => {
        setOpenMenu(!openMenu);
    }

    const handleLogout = () => {
        setIsLoggedIn(false);
    }

    const mobileContent = (
        <div className="md:hidden z-10 block absolute justify-center w-full right-0 top-14 transition-transform transform">
            <ul className={`h-screen text-center text-white text-xl bg-zinc-900 bg-opacity-95 border-t border-black pt-8 transition-transform transform ${openMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                <li className="py-4 flex justify-center items-center">
                    <Link to="films" onClick={() => { openModal(); setOpenMenu(false); }} className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                        <IoFilm className="mr-2" size={24} />
                        <span>Films</span>
                    </Link>
                </li>
                <li className="py-4 flex justify-center items-center">
                    <Link to="top_TMDB" onClick={() => setOpenMenu(false)} className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                        <IoStar className="mr-2" size={24} />
                        <span className="pr-2">Top</span>
                        <img src="../src/assets/tmdb.png" className="w-8" alt="tmdb-logo" />
                    </Link>
                </li>
                <li className="py-4 flex justify-center items-center">
                    <Link to="favoris" onClick={() => { setOpenMenu(false); }} className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                        <IoHeart className="mr-2" size={24} />
                        <span>Mes favoris</span>
                    </Link>
                </li>
                <li className="py-4 flex justify-center items-center">
                    {isLoggedIn ? (
                        <button onClick={() => { handleLogout(); setOpenMenu(false); }} className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                            <IoLogOut className="mr-2" size={24} />
                            <span>Déconnexion</span>
                        </button>
                    ) : (
                        <Link to="connexion" onClick={() => { setOpenMenu(false); }} className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                            <IoLogIn className="mr-2" size={24} />
                            <span>Connexion</span>
                        </Link>
                    )}
                </li>
                <li className="py-4">
                    <div className="w-full flex justify-center">
                        <MovieSearch show={showSearch} />
                    </div>
                </li>
            </ul>
        </div>
    );

    return (
        <nav className="w-screen h-[10vh] relative z-20">
            <div className="flex md:items-center md:justify-between px-4 md:px-10 pt-2 pb-2 text-white bg-zinc-900 bg-opacity-95">
                <div className="flex items-center md:justify-between justify-center w-full md:w-auto">
                    <div>
                        {openMenu && mobileContent}
                    </div>
                    <button className="md:hidden transition p-2 pr-20" onClick={handleClick}>
                        {openMenu ? <FaTimes className="text-2xl" /> : <TiThMenuOutline className="text-2xl" />}
                    </button>
                    <div className="flex items-center space-x-1">
                        <img src="../src/assets/cinelogo.png" className="w-8 h-8" alt="cinelogo" />
                        <Link className="text-2xl font-bold" to="/">
                            <span className="text-green-400">ine</span>side
                        </Link>
                    </div>
                </div>
                <div className="hidden md:flex space-x-10 items-center">
                    <Link to="films" className="flex items-center space-x-1 hover:text-green-400 transition duration-300">
                        <IoFilm size={24} />
                        <span className="text-[16px]">Films</span>
                    </Link>
                    <Link to="top_TMDB" className="flex items-center space-x-1 hover:text-green-400 transition duration-300">
                        <IoStar size={24} />
                        <span className="text-[16px]">Top</span>
                        <img src="../src/assets/tmdb.png" className="w-8 h-7 ml-1" alt="tmdb-logo" />
                    </Link>
                    <Link to="favoris" className="flex items-center space-x-1 hover:text-green-400 transition duration-300">
                        <IoHeart size={24} />
                        <span className="text-[16px]">Favoris</span>
                    </Link>
                    <MovieSearch show={showSearch} />
                </div>
                <div className="hidden md:flex items-center space-x-2">
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-green-400 transition duration-300">
                            <IoLogOut size={24} />
                            <span className="text-[16px]">Déconnexion</span>
                        </button>
                    ) : (
                        <Link to="connexion" className="flex items-center space-x-1 hover:text-green-400 transition duration-300">
                            <IoLogIn size={24} />
                            <span className="text-[16px]">Connexion</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

NavBar.propTypes = {
    showSearch: PropTypes.bool.isRequired,
};

NavBar.defaultProps = {
    showSearch: false,
};
