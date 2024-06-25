import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../utils/moviedb';
import MovieDetails from '../components/MovieDetails';

export default function Favorite() {

    const [favorites, setFavorites] = useState([]);
    const [movieDetails, setMovieDetails] = useState({});
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const removeFavorite = (movieId) => {
        const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
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
        <div className="p-6 text-white w-screen">
            <h1 className="text-3xl text-center mt-10">Mes films favoris</h1>
            {favorites.length === 0 ? (
                <p className="text-center mt-4">Vous n'avez pas encore de films favoris.</p>
            ) : (
                <div className="flex flex-wrap justify-center mt-10">
                    {favorites.map(movie => (
                        <div key={movie.id} className="relative flex flex-col md:h-[420px] md:w-[280px] h-[280px] w-[170px] justify-center items-center">
                            <div className="relative">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="md:w-[260px] md:h-[350px] w-[160px] h-[220px] object-cover rounded-xl"

                                />
                                <div className="absolute top-0 left-0 md:w-[260px] w-[160px] md:h-[350px] h-[220px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-xl">
                                    <h2 className="text-white text-lg md:text-xl text-center w-[80%] cursor-pointer"
                                        onClick={() => handleMovieClick(movie)}>{movie.title}</h2>
                                </div>
                                <button
                                    onClick={() => removeFavorite(movie.id)}
                                    className="bg-red-500 text-white px-2 w-full py-1 mt-2 rounded"
                                >
                                    Supprimer
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
            {showDetails && (
                <MovieDetails
                    movie={movieDetails}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </div>
    );
}


