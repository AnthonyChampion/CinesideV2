import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails } from '../utils/moviedb';
import PersonDetails from '../components/PersonDetails';
import useMovieData from '../hooks/useMovieData';

const MovieDetailPage = () => {
    const { id } = useParams();
    const movieId = parseInt(id);

    const navigate = useNavigate();
    const { credits, similarMovies, trailer, watchProviders, loading, error } = useMovieData(movieId);
    const [movie, setMovie] = useState(null);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
    const [selectedPerson, setSelectedPerson] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await fetchMovieDetails(movieId);
                setMovie(data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        fetchMovie();
    }, [movieId]);

    const toggleFavorite = () => {
        let updatedFavorites;
        if (favorites.some(fav => fav.id === movie.id)) {
            updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
        } else {
            updatedFavorites = [...favorites, movie];
        }
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const isFavorite = movie && favorites.some(fav => fav.id === movie.id);

    const handleCastClick = (personId) => {
        setSelectedPerson(personId);
    };

    const handlePersonDetailsClose = () => {
        setSelectedPerson(null);
    };

    const handleMovieClick = (similarMovie) => {
        navigate(`/movie/${similarMovie.id}`);
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
        <div className="flex flex-col items-center justify-center text-white font-Roboto">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="w-full max-w-7xl px-4 py-8">
                    <div className="relative w-full md:h-[500px]">
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "../src/assets/img_not_available.png";
                            }}
                        />
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                            alt={movie.title}
                            className="absolute right-10 -bottom-[40%] w-[250px] h-[350px] object-cover rounded-lg"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "../src/assets/img_not_available.png";
                            }}
                        />
                        <button
                            className={`absolute top-4 right-4 bg-${isFavorite ? 'red' : 'green'}-500 text-white rounded-full w-10 h-10 flex items-center justify-center`}
                            onClick={toggleFavorite}
                            aria-label="Favorite"
                        >
                            {isFavorite ? '★' : '☆'}
                        </button>
                    </div>

                    <div className="mt-8">
                        <h1 className="text-3xl md:text-5xl uppercase font-bold w-[80%]">{movie.title || "Title Not Available"}</h1>
                        <div className="flex space-x-10 mt-2">
                            <p className="text-lg">Sortie: {movie.release_date}</p>
                            <p className="text-lg">{movie.runtime} min</p>
                            {movie.genres && (
                                <p className="text-lg">
                                    {movie.genres.map(genre => genre.name).join(' | ')}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center space-x-4">
                            <div className="flex space-x-1">
                                {renderStars(movie.vote_average)}
                            </div>
                            <div className="text-lg">
                                {Math.round(movie.vote_average * 100) / 100} / 10
                            </div>
                        </div>
                        <p className="text-lg">Popularity: {Math.round(movie.popularity * 100) / 100}%</p>
                    </div>
                    <div className="mt-8">
                        {Object.keys(watchProviders).length > 0 && (
                            <div>
                                <h3 className="text-2xl">Plateformes:</h3>
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    {watchProviders.flatrate && watchProviders.flatrate.length > 0 ? (
                                        watchProviders.flatrate.map(provider => (
                                            <div key={provider.provider_id} className="flex items-center space-x-2">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                                                    alt={provider.provider_name}
                                                    className="w-12 h-12 object-contain"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "../src/assets/img_not_available.png";
                                                    }}
                                                />
                                                <p className="text-lg">{provider.provider_name}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-lg text-gray-600">Aucune plateformes connues</p>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-2">Données fournies par JustWatch</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl">Synopsis</h2>
                        <p className="text-lg text-justify">{movie.overview}</p>
                    </div>

                    {credits && credits.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-2xl">Distribution</h3>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                                {credits.slice(0, 8).map(actor => (
                                    <li key={actor.id} className="flex flex-col items-center space-y-2">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                            alt={actor.name}
                                            className="w-32 h-32 rounded-full object-cover cursor-pointer"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "../src/assets/img_not_available.png";
                                            }}
                                            onClick={() => handleCastClick(actor.id)}
                                        />
                                        <p className="font-semibold text-center">{actor.name}</p>
                                        <p className="text-sm text-gray-500 text-center">{actor.character}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {trailer.length > 0 && (
                        <div className="mt-8 flex-col w-2/4 justify-center">
                            <h3 className="text-2xl">Bande annonce</h3>
                            <div className="mt-4">
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${trailer[0].key}`}
                                    title={trailer[0].name}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                                <p className="text-lg mt-2">{trailer[0].name}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8">
                        <h3 className="text-2xl">Recommandations</h3>
                        <div className="grid grid-cols-2 md:grid-cols-8 gap-6 mt-4">
                            {similarMovies.slice(0, 16).map(similarMovie => (
                                <div
                                    key={similarMovie.id}
                                    className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg"
                                    onClick={() => handleMovieClick(similarMovie)}
                                >
                                    <img
                                        className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105"
                                        src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                                        alt={similarMovie.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "../src/assets/img_not_available.png";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <h2 className="text-lg md:text-xl line-clamp-2">{similarMovie.title}</h2>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedPerson && (
                        <PersonDetails
                            personId={selectedPerson}
                            onClose={handlePersonDetailsClose}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default MovieDetailPage;
