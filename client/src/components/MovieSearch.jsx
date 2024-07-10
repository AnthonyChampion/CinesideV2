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
                <form onSubmit={handleSearch} className="relative md:flex md:flex-row flex-col items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-11 md:w-[15rem] w-[10rem] bg-zinc-800 bg-opacity-50 rounded-md text-center text-white text-[16px] pr-10 "
                        placeholder="RECHERCHE"
                    />
                    <IoSearch className="absolute right-3 text-white" style={{ top: '50%', transform: 'translateY(-50%)' }} />
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
                                                className="w-full md:h-[350px] object-cover rounded-lg transform transition duration-300 group-hover:scale-105"
                                                src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                                                alt={movie.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                            <div className="mt-4">
                                                <div className="text-white">
                                                    <h2 className="text-md md:text-xl font-bold normal-case truncate">{movie.title}</h2>
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
