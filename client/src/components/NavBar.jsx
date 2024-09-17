import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IoLogIn, IoLogOut, IoSearchOutline, IoClose } from 'react-icons/io5';
import { RiMovie2Line } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import MovieSearch from './MovieSearch';
import PopupMessage from '../components/PopupMessage';

export default function NavBar({ showSearchProp }) {
    const { auth, logout } = useAuth();
    const [showSearch, setShowSearch] = useState(showSearchProp || false);
    const [showPopup, setShowPopup] = useState(false);

    const handleLogout = () => {
        logout();
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleSearchClick = () => {
        setShowSearch(!showSearch);
    };

    return (
        <nav className="w-screen relative md:mt-6 max-w-[90vw] mx-auto z-10">
            <div className="flex items-center justify-between p-4 md:bg-gradient-to-l md:from-zinc-700 md:to-transparent rounded-lg text-white">
                <div className="flex items-center">
                    <Link className="text-2xl font-semibold" to="/accueil">
                        <img src="../src/assets/cinelogo.png" className="md:w-40 md:h-10 w-30 h-8" alt="Cineside logo" />
                    </Link>
                </div>
                <div className="flex items-center space-x-10 pr-4">
                    <div className="hidden md:flex space-x-10">
                        <Link to="/accueil" className="flex items-center space-x-2">
                            <span className="text-md transform transition-transform duration-200 hover:scale-110">Accueil</span>
                        </Link>
                        <Link to="/film_par_genre" className="flex items-center space-x-2">
                            <span className="text-md transform transition-transform duration-200 hover:scale-110">Genres</span>
                        </Link>
                        <Link to="/film_par_annee" className="flex items-center space-x-2">
                            <span className="text-md transform transition-transform duration-200 hover:scale-110">Années</span>
                        </Link>
                        {auth && (
                            <Link to="/favoris" className="flex items-center space-x-2">
                                <span className="text-md transform transition-transform duration-200 hover:scale-110">Favoris</span>
                            </Link>
                        )}
                        {auth && auth.isAdmin && (
                            <Link to="/admin" className="flex items-center space-x-2">
                                <span className="text-md transform transition-transform duration-200 hover:scale-110">Admin</span>
                            </Link>
                        )}
                    </div>
                    {auth ? (
                        <>
                            <div className="hidden md:flex items-center space-x-4 transform transition-transform duration-200 hover:scale-110">
                                <Link to="/profil">
                                    <FaRegUser size={24} />
                                </Link>
                            </div>
                            <button onClick={handleLogout} className="hidden md:block text-md transform transition-transform duration-200 hover:scale-110">
                                Deconnexion
                            </button>
                        </>
                    ) : (
                        <Link to="/connexion">
                            <button className="hidden md:block text-md transform transition-transform duration-200 hover:scale-110">
                                Connexion
                            </button>
                        </Link>
                    )}
                    <button className="md:hidden transition p-2" onClick={handleSearchClick}>
                        {showSearch ? <IoClose size={24} /> : <IoSearchOutline size={24} />}
                    </button>
                </div>
            </div>

            {/* Bottom navigation for mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white">
                <div className="flex justify-around py-2 text-black">
                    <Link to="/accueil" className="flex flex-col items-center">
                        <AiFillHome size={20} />
                        <span className="text-xs">Accueil</span>
                    </Link>
                    <Link to="/film_par_genre" className="flex flex-col items-center">
                        <RiMovie2Line size={20} />
                        <span className="text-xs">Genres</span>
                    </Link>
                    <Link to="/film_par_annee" className="flex flex-col items-center">
                        <RiMovie2Line size={20} />
                        <span className="text-xs">Années</span>
                    </Link>
                    {auth && (
                        <Link to="/profil" className="flex flex-col items-center">
                            <FaRegUser size={20} />
                            <span className="text-xs">Profil</span>
                        </Link>
                    )}
                    {auth ? (
                        <button onClick={handleLogout} className="flex flex-col items-center">
                            <IoLogOut size={20} />
                            <span className="text-xs">Deconnexion</span>
                        </button>
                    ) : (
                        <Link to="/connexion" className="flex flex-col items-center">
                            <IoLogIn size={20} />
                            <span className="text-xs">Connexion</span>
                        </Link>
                    )}
                </div>
            </div>
            {showSearch && (
                <div className="relative z-50 w-full p-4">
                    <MovieSearch />
                </div>
            )}
            {showPopup && (
                <PopupMessage
                    message="Vous avez été déconnecté avec succès."
                    onClose={handleClosePopup}
                />
            )}
        </nav>
    );
}

NavBar.propTypes = {
    showSearchProp: PropTypes.bool,
};
