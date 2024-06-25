import React, { useState } from 'react';
import { fetchMovieDetails, searchMovies } from '../utils/moviedb';
import MovieDetails from './MovieDetails';

export default function MovieSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [movieDetails, setMovieDetails] = useState({});
    const [showDetails, setShowDetails] = useState(false);

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

    const handleMovieClick = async (movie) => {
        try {
            const data = await fetchMovieDetails(movie.id);
            setMovieDetails(data);
            setShowDetails(true);
        } catch (error) {
            console.error('Erreur dans la récupération des détails:', error);
        }
    };

    return (
        <section>
            <form onSubmit={handleSearch} className="md:flex md:flex-row flex-col items-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-xl h-11 md:w-[21.5rem] w-[18rem] bg-zinc-800 text-center text-white text-[16px] border border-neutral-400 "
                    placeholder="Tapez votre film"
                />
                <button type="submit" className="ml-2 mt-2 md:mt-0 bg-green-400 p-2 rounded-xl text-black text-[16px]">Rechercher</button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {movies.length > 0 && (
                <div className="fixed inset-0 z-50 h-screen flex justify-center items-center bg-black bg-opacity-70">
                    <div className="bg-white text-black rounded-lg overflow-scroll noscroll-bar h-[98%] w-11/12 md:w-3/4 lg:w-2/3">
                        <div className="relative">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto ">
                                {movies.map((movie) => (
                                    <div key={movie.id} className="relative flex flex-col md:h-[370px] h-[240px] justify-center items-center">
                                        <div className="relative">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                alt={movie.title}
                                                className="md:w-[260px] md:h-[350px] w-[160px] h-[220px] object-cover rounded-xl"

                                            />

                                            <div className="absolute top-0 left-0 md:w-[260px] w-[160px] h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-xl">
                                                <h2 className="text-white text-lg md:text-xl text-center w-[80%] cursor-pointer"
                                                    onClick={() => handleMovieClick(movie)}>{movie.title}</h2>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                            <button
                                className="absolute top-4 right-4 bg-green-400 text-white rounded-full w-10 h-10 flex items-center justify-center"
                                onClick={handleClose}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showDetails && (
                <MovieDetails
                    movie={movieDetails}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </section>
    );
}
