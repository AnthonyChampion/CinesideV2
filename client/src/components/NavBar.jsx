import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaTimes } from 'react-icons/fa';
import { TiThMenuOutline } from 'react-icons/ti';
import { IoLogIn, IoLogOut, IoHeart } from 'react-icons/io5';
import { RiMovie2Line } from "react-icons/ri";
import { TbMovie } from "react-icons/tb";
import MovieSearch from './MovieSearch';
import { Button } from 'flowbite-react';


export default function NavBar({ showSearch }) {

    const { auth, logout } = useAuth();
    const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    function openModal() {
        setFilterModalIsOpen(!filterModalIsOpen);
    }

    const handleClick = () => {
        setOpenMenu(!openMenu);
    }

    const handleLogout = () => {
        logout();
    }

    const mobileContent = (
        <div className="md:hidden z-10 block absolute justify-center w-full right-0 top-[3rem] transition-transform transform">
            <ul className={`h-screen text-center text-white text-xl pt-8 md:bg-zinc-900 md:bg-opacity-20 bg-[#111111] transition-transform transform ${openMenu ? 'translate-x-0 ' : 'translate-x-full'}`}>
                <li className="py-4 flex justify-center items-center">
                    <Link to="films" onClick={() => { openModal(); setOpenMenu(false); }} className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                        <RiMovie2Line className="mr-2" size={24} />
                        <span>Films</span>
                    </Link>
                </li>
                <li className="py-4 flex justify-center items-center">
                    <Link to="filmsavenir" onClick={() => { openModal(); setOpenMenu(false); }} className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                        <TbMovie className="mr-2" size={24} />
                        <span>A venir</span>
                    </Link>
                </li>

                {auth && (
                    <li className="py-4 flex justify-center items-center">
                        <Link to="favoris" onClick={() => { setOpenMenu(false); }} className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                            <IoHeart className="mr-2" size={24} />
                            <span>Mes favoris</span>
                        </Link>
                    </li>
                )}
                <li className="py-4 flex justify-center items-center">
                    {auth ? (
                        <Button onClick={() => { handleLogout(); setOpenMenu(false); }} className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                            <IoLogOut className="mr-2" size={24} />
                            <span>Déconnexion</span>
                        </Button>
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
        <nav className="w-screen md:h-[7.2vh] relative z-20 pt-2 md:bg-zinc-900 md:bg-opacity-10 bg-[#111111]">
            <div className="flex md:items-center md:justify-between px-4 md:px-10 pb-3 pt-1 text-white">
                <div className="flex items-center w-full md:w-auto">
                    <div>
                        {openMenu && mobileContent}
                    </div>
                    <button className="md:hidden transition p-2 pr-20" onClick={handleClick}>
                        {openMenu ? <FaTimes className="text-2xl" /> : <TiThMenuOutline className="text-2xl" />}
                    </button>
                    <div className="flex items-center space-x-1 pl-4 md:pl-0">
                        <img src="../src/assets/cinelogo.png" className="w-7 h-7" alt="cinelogo" />
                        <Link className="text-2xl font-bold" to="/">
                            <span className="text-green-400">ine</span>side
                        </Link>
                    </div>
                </div>
                <div className="hidden md:flex space-x-10 items-center uppercase">
                    <Link to="films" className="flex items-center space-x-2 hover:text-green-400 transition duration-300">
                        <RiMovie2Line size={24} />
                        <span className="text-[16px]">Films</span>
                    </Link>
                    <Link to="filmsavenir" className="flex items-center space-x-2 hover:text-green-400 transition duration-300">
                        <TbMovie size={24} />
                        <span className="text-[16px]">A venir</span>
                    </Link>
                    {auth && (
                        <Link to="favoris" className="flex items-center space-x-2 hover:text-green-400 transition duration-300">
                            <IoHeart size={24} />
                            <span className="text-[16px]">Favoris</span>
                        </Link>
                    )}
                    <MovieSearch show={showSearch} />
                </div>
                <div className="hidden md:flex items-center space-x-2 uppercase">
                    {auth ? (
                        <Button onClick={handleLogout} className="flex items-center space-x-1 hover:text-green-400 transition duration-300">
                            <IoLogOut size={24} />
                            <span className="text-[16px] uppercase">Déconnexion</span>
                        </Button>
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
