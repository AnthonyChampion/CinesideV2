import React, { useState } from 'react';
import { searchMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { Card } from 'flowbite-react';

export default function MovieSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async (event) => {
        event.preventDefault();
        if (searchTerm.trim() === '') return;

        try {
            const params = { query: searchTerm };
            const results = await searchMovies(params);

            if (results && results.results && results.results.length > 0) {
                setMovies(results.results);
                setError('');
            } else {
                setMovies([]);
                setError('No movies found.');
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
            setMovies([]);
            setError('Failed to fetch movies. Please try again.');
        }
    };

    const handleClose = () => {
        setMovies([]);
        setError('');
        setSearchTerm('');
    };

    const renderStars = (vote_average) => {
        const totalStars = 5;
        const filledStars = Math.round((vote_average / 10) * totalStars);
        const emptyStars = totalStars - filledStars;

        return (
            <div className="flex space-x-1">
                {[...Array(filledStars)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                ))}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={i} className="text-gray-400">★</span>
                ))}
            </div>
        );
    };

    return (
        <section>
            <div className="flex">
                <form className="max-w-md mx-auto md:w-[22rem] w-[20rem]" onSubmit={handleSearch}>
                    <label htmlFor="" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Recherche</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-700 focus:border-cyan-700 " placeholder="Recherchez un film" required />
                        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-cyan-700 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Recherche</button>
                    </div>
                </form>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {movies.length > 0 && (
                <div className="fixed inset-0 z-50 h-screen flex justify-center items-center bg-black bg-opacity-70 p-4 md:p-8 lg:p-6">
                    <div className="bg-white text-black rounded-lg overflow-scroll noscroll-bar h-full w-full md:w-3/4 lg:w-3/4">
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto p-2">
                                {movies.map((movie) => (
                                    <Card
                                        key={movie.id}
                                        className="relative group cursor-pointer border-none overflow-hidden rounded-lg shadow-lg bg-zinc-800"
                                        onClick={handleClose}
                                    >
                                        <Link to={`/film/${movie.id}`}>
                                            <img
                                                className="w-full md:h-[350px] h-[180px] object-cover rounded-lg transform transition duration-300 group-hover:scale-105"
                                                src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                                                alt={movie.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                            <div className="md:mt-4 mt-2">
                                                <div className="text-white text-start">
                                                    <h2 className="text-[16px] md:text-xl font-bold normal-case truncate">{movie.title}</h2>
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="flex md:flex-row flex-col md:justify-between md:items-center">
                                                            {renderStars(movie.vote_average) || "Note inconnue"}
                                                            <p className="md:text-md text-sm">{Math.round(movie.vote_average * 100) / 100} /10</p>
                                                        </div>
                                                        <div className="text-sm md:text-md">
                                                            {new Date(movie.release_date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                            <button
                                className="absolute top-4 right-4 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                                onClick={handleClose}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}


{/* <form onSubmit={handleSearch} className="relative md:flex md:flex-row flex-col items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-11 md:w-[15rem] w-[15rem] bg-zinc-800 bg-opacity-50 rounded-md text-center text-white text-[16px] pr-10 "
                        placeholder="RECHERCHE"
                    />
                    <IoSearch className="absolute right-3 text-white" style={{ top: '50%', transform: 'translateY(-50%)' }} />
                </form> */}