import React, { useState } from 'react';
import { searchMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
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

    return (
        <section>
            <div className="flex">
                <form className="mx-auto md:w-[22rem] w-[18rem]" onSubmit={handleSearch}>
                    <label htmlFor="" className="mb-2 text-sm font-medium text-white sr-only dark:text-white">Recherche</label>
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
                            className="block w-full p-4 ps-10 text-sm text-white placeholder-white border border-zinc-300 rounded-lg dark:bg-white dark:bg-opacity-20 bg-white focus:ring-white focus:border-white"
                            placeholder="Recherchez un film"
                            required
                        />
                    </div>
                </form>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {movies.length > 0 && (
                <div className="fixed inset-0 h-screen flex justify-center items-center bg-black bg-opacity-70 p-2 md:p-8 lg:p-6">
                    <div className="bg-white text-black rounded-lg overflow-scroll noscroll-bar h-full w-full md:w-3/4 lg:w-3/4">
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto p-2">
                                {movies.map((movie) => (
                                    <Card
                                        key={movie.id}
                                        className="relative group cursor-pointer border-none overflow-hidden shadow-lg"
                                        onClick={handleClose}
                                    >
                                        <Link to={`/film/${movie.id}`}>
                                            <img
                                                className="w-full md:h-[350px] h-[180px] object-contain transform transition duration-300 group-hover:scale-105"
                                                src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                                                alt={movie.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                            <div className="md:mt-2 mt-2">
                                                <div className="p-2 space-y-1">
                                                    <p className="text-sm text-gray-400">{movie.release_date}</p>
                                                    <h2 className="text-md font-bold line-clamp-1 text-black">{movie.title}</h2>
                                                </div>
                                            </div>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                            <button
                                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
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

