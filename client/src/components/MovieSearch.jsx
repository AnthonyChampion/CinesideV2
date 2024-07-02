import React, { useState } from 'react';
import { searchMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';

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
            <form onSubmit={handleSearch} className="md:flex md:flex-row flex-col items-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 md:w-[21.5rem] w-[18rem] bg-zinc-800 rounded-sm text-center text-white text-[16px] border border-neutral-400 "
                    placeholder="Tapez votre film"
                />
                <button type="submit" className="h-11 ml-2 mt-2 md:mt-0 rounded-sm bg-green-500 p-2 text-black text-[16px]">Rechercher</button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {movies.length > 0 && (
                <div className="fixed inset-0 z-50 h-screen flex justify-center items-center bg-black bg-opacity-70 p-4 md:p-8 lg:p-6">
                    <div className="bg-white text-black rounded-lg overflow-scroll noscroll-bar h-full w-full md:w-3/4 lg:w-3/4">
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto p-4">
                                {movies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="relative flex flex-col justify-center items-center h-[260px] md:h-[370px]"
                                    >
                                        <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-zinc-800 w-full h-full">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                alt={movie.title}
                                                className="object-cover rounded-lg w-full h-full"
                                            />
                                            <Link to={`/film/${movie.id}`} onClick={handleClose}>
                                                <div className="absolute inset-0 p-4 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                                                    <h2 className="normal-case font-bold text-lg md:text-xl text-white text-center">{movie.title}</h2>
                                                    <div className="flex mt-2 space-x-2 items-center">
                                                        <div className="flex space-x-2">
                                                            {renderStars(movie.vote_average) || "Note inconnue"}
                                                        </div>
                                                        <div className="text-[14px] text-white">
                                                            {Math.round(movie.vote_average * 100) / 100} /10
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
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
