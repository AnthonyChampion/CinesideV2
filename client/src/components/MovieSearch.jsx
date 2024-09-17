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

    return (
        <section>
            <div className="flex">
                <form className="mx-auto md:w-[18.8rem] w-[18rem]" onSubmit={handleSearch}>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full p-2.5 ps-10 text-md text-white placeholder-white rounded border-zinc-500 bg-zinc-700 bg-opacity-80 focus:ring-white focus:border-white"
                            placeholder="Recherchez un film"
                            required
                        />
                    </div>
                </form>

            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {movies.length > 0 && (
                <div className="fixed inset-0 h-screen flex justify-center items-center p-2 lg:p-6">
                    <div className="absolute inset-0 bg-black opacity-80 z-20"></div>
                    <div className="relative bg-white text-black rounded-lg overflow-scroll noscroll-bar h-full w-full md:w-3/4 lg:w-3/4 z-20">
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto p-2">
                                {movies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="relative group cursor-pointer border-none overflow-hidden shadow-lg p-2 md:p-4"
                                        onClick={handleClose}
                                    >
                                        <Link to={`/film/${movie.id}`}>
                                            <img
                                                className="w-full md:h-[360px] h-[250px] object-cover transform transition duration-300 group-hover:scale-105"
                                                src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                                                alt={movie.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                            <div className="md:mt-2 mt-2">
                                                <div className="p-2 space-y-1">
                                                    <h2 className="md:text-md text-[14px] font-bold line-clamp-1 text-black uppercase">{movie.title}</h2>
                                                    <p className="md:text-sm text-[12px] text-gray-400">{movie.release_date}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center z-30"
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

