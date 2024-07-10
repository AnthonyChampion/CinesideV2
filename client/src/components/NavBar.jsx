import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IoLogIn, IoLogOut, IoHeart, IoSearchOutline, IoClose } from 'react-icons/io5';
import { RiMovie2Line } from "react-icons/ri";
import { TbMovie } from "react-icons/tb";
import MovieSearch from './MovieSearch';
import { Button } from 'flowbite-react';

export default function NavBar() {
    const { auth, logout } = useAuth();
    const [showSearch, setShowSearch] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const handleSearchClick = () => {
        setShowSearch(!showSearch);
    };

    return (
        <nav className="w-screen md:h-[8vh] relative z-20 pt-2 md:bg-zinc-900 md:bg-opacity-10 bg-[#111111]">
            <div className="flex md:items-center md:justify-between px-4 md:px-10 pb-3 pt-1 text-white">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="flex items-center space-x-1 pl-4 md:pl-0">
                        <img src="../src/assets/cinelogo.png" className="w-7 h-7" alt="cinelogo" />
                        <Link className="text-2xl font-bold" to="/">
                            <span className="text-green-400">ine</span>side
                        </Link>
                    </div>
                    <button className="md:hidden transition p-2" onClick={handleSearchClick}>
                        {showSearch ? <IoClose size={24} /> : <IoSearchOutline size={24} />}
                    </button>
                </div>
                <div className="hidden md:flex space-x-10 items-center">
                    <Link to="films" className="flex items-center space-x-2 hover:text-green-400 transition duration-300">
                        <RiMovie2Line size={24} />
                        <span className="text-[16px]">Films</span>
                    </Link>
                    <Link to="filmsavenir" className="flex items-center space-x-2 hover:text-green-400 transition duration-300">
                        <TbMovie size={24} />
                        <span className="text-[16px]">Films a venir</span>
                    </Link>
                    {auth && (
                        <Link to="favoris" className="flex items-center space-x-2 hover:text-green-400 transition duration-300">
                            <IoHeart size={24} />
                            <span className="text-[16px]">Favoris</span>
                        </Link>
                    )}
                    <MovieSearch />
                </div>
                <div className="hidden md:flex items-center space-x-2">
                    {auth ? (
                        <Button onClick={handleLogout} className="flex items-center space-x-1 hover:text-green-400 transition duration-300">
                            <IoLogOut size={24} />
                            <span className="text-[16px]">Deconnexion</span>
                        </Button>
                    ) : (
                        <Link to="connexion">
                            <Button className="flex items-center space-x-1 hover:text-green-400 transition duration-300">
                                <IoLogIn size={24} />
                                <span className="text-[16px]">Connexion</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Bottom navigation for mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#111111]">
                <div className="flex justify-around py-2 text-white">
                    <Link to="films" className="flex flex-col items-center">
                        <RiMovie2Line size={20} />
                        <span className="text-xs">Films</span>
                    </Link>
                    <Link to="filmsavenir" className="flex flex-col items-center ml-7">
                        <TbMovie size={20} />
                        <span className="text-xs">Sorties a venir</span>
                    </Link>
                    {auth && (
                        <Link to="favoris" className="flex flex-col items-center">
                            <IoHeart size={20} />
                            <span className="text-xs">Favoris</span>
                        </Link>
                    )}
                    {auth ? (
                        <button onClick={handleLogout} className="flex flex-col items-center">
                            <IoLogOut size={20} />
                            <span className="text-xs">Deconnexion</span>
                        </button>
                    ) : (
                        <Link to="connexion" className="flex flex-col items-center">
                            <IoLogIn size={20} />
                            <span className="text-xs">Connexion</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Conditional rendering of MovieSearch */}
            {showSearch && (
                <div className="absolute w-full bg-black bg-opacity-90 z-30 p-4">
                    <MovieSearch />
                </div>
            )}
        </nav>
    );
}

NavBar.propTypes = {
    showSearch: PropTypes.bool,
};

NavBar.defaultProps = {
    showSearch: false,
};
