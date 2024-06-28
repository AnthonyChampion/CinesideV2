import React, { useCallback, useEffect, useState } from 'react';
import { fetchMovieCredits, fetchSimilarMovies, fetchMovieTrailer, fetchWatchProviders, fetchMovieDetails } from '../utils/moviedb';
import { useParams } from 'react-router-dom';
import PersonDetails from '../components/PersonDetails';

const useMovieData = (movieId) => {
    const [credits, setCredits] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [trailer, setTrailer] = useState([]);
    const [watchProviders, setWatchProviders] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateCredits = useCallback(async (movieId) => {
        try {
            const creditsData = await fetchMovieCredits(movieId);
            setCredits(creditsData.cast);
        } catch (error) {
            setError('Erreur dans la récupération des crédits');
        }
    }, []);

    const updateSimilarMovies = useCallback(async (movieId) => {
        try {
            const similarMoviesData = await fetchSimilarMovies(movieId);
            setSimilarMovies(similarMoviesData.results);
        } catch (error) {
            setError('Erreur dans la récupération des films similaires');
        }
    }, []);

    const updateTrailer = useCallback(async (movieId) => {
        try {
            const trailerData = await fetchMovieTrailer(movieId);
            setTrailer(trailerData.results);
        } catch (error) {
            setError('Erreur dans la récupération de la bande-annonce');
        }
    }, []);

    const updateWatchProviders = useCallback(async (movieId) => {
        try {
            const watchProvidersData = await fetchWatchProviders(movieId);
            setWatchProviders(watchProvidersData.results);
        } catch (error) {
            setError('Erreur dans la récupération des fournisseurs de contenu');
        }
    }, []);

    const updateAllMovieData = useCallback(async (movieId) => {
        setLoading(true);
        try {
            await Promise.all([
                updateCredits(movieId),
                updateSimilarMovies(movieId),
                updateTrailer(movieId),
                updateWatchProviders(movieId)
            ]);
            setLoading(false);
        } catch (error) {
            setError('Erreur dans la récupération des informations du film');
            setLoading(false);
        }
    }, [updateCredits, updateSimilarMovies, updateTrailer, updateWatchProviders]);

    useEffect(() => {
        if (movieId) {
            updateAllMovieData(movieId);
        }
    }, [movieId, updateAllMovieData]);

    return { credits, similarMovies, trailer, watchProviders, loading, error, updateAllMovieData };
};

export default function MovieDetailPage() {
    const { id } = useParams();
    const movieId = parseInt(id);
    const { credits, similarMovies, trailer, watchProviders, loading, error, updateAllMovieData } = useMovieData(movieId);
    const [movie, setMovie] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);

    const handleMovieClick = useCallback(async (similarMovie) => {
        try {
            const data = await fetchMovieDetails(similarMovie.id);
            setMovie(data);
            updateAllMovieData(similarMovie.id);
        } catch (error) {
            console.error('Erreur dans la récupération des détails:', error);
        }
    }, [updateAllMovieData]);

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


    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await fetchMovieDetails(movieId);
                setMovie(data);
            } catch (error) {
                console.error('Erreur dans la récupération des détails du film:', error);
            }
        };

        fetchMovie();
    }, [movieId]);

    return (
        <div className="flex flex-col items-center justify-center text-white">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex flex-col items-center text-white w-full">
                    {movie && (
                        <div className="relative w-full">
                            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                            <img
                                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                alt={movie.title}
                                className="w-full h-[300px] md:h-[600px] object-cover rounded-t-lg"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "../src/assets/img_not_available.png";
                                }}
                            />
                            <button
                                className={`absolute top-4 right-16 bg-${isFavorite ? 'red' : 'green'}-500 text-white rounded-full w-10 h-10 flex items-center justify-center`}
                                onClick={toggleFavorite}
                                aria-label="Favorite"
                            >
                                {isFavorite ? '★' : '☆'}
                            </button>
                        </div>
                    )}

                    <div className="hidden md:block absolute space-y-8 md:top-[25vh] md:left-24 md:w-1/3 text-white p-4 md:p-6 bg-zinc-900 bg-opacity-50 rounded-lg shadow-xl">
                        <h1 className="text-xl md:text-[4rem] uppercase font-semibold mb-2">{movie.title || "Titre non disponible"}</h1>
                        <p className="md:text-lg">{movie.release_date || "Date de sortie inconnue"}</p>
                        <div className="flex flex-row space-x-4">
                            <div className="flex space-x-1">
                                {/* {renderStars(movie.vote_average) || "Note inconnue"} */}
                            </div>
                            <div className="md:text-lg">
                                {Math.round(movie.vote_average * 100) / 100} /10
                            </div>
                        </div>

                        <p className="text-sm md:text-lg md:line-clamp-4 line-clamp-2 text-justify mb-4">{movie.overview}</p>

                    </div>
                    {credits && credits.length > 0 && (
                        <div className="p-6  w-full">
                            <h3 className="text-2xl font-bold">Crédits</h3>
                            <ul className="flex flex-wrap justify-center mt-4">
                                {credits.slice(0, 10).map(actor => (
                                    <li key={actor.id} className="flex flex-col items-center w-24 h-30 mx-4 mb-4">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                            alt={actor.name}
                                            className="w-24 h-24 rounded-full object-cover cursor-pointer"
                                            aria-label={actor.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "../src/assets/img_not_available.png";
                                            }}
                                            onClick={() => handleCastClick(actor.id)}
                                        />
                                        <p className="font-semibold mt-2">{actor.name}</p>
                                        <p className="text-sm text-gray-500 text-center">{actor.character}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {similarMovies.length > 0 && (
                        <div className="p-6  w-full">
                            <h3 className="text-2xl font-bold">Films similaires</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-4">
                                {similarMovies.slice(0, 12).map(similarMovie => (
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
                                            <div className="text-white">
                                                <h2 className="text-lg md:text-xl font-bold">{similarMovie.title}</h2>
                                                <div className="flex flex-col mt-2">
                                                    <div className="text-[14px] md:text-[16px]">
                                                        {Math.round(similarMovie.vote_average * 100) / 100} /10
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {Object.keys(watchProviders).length > 0 && (
                        <div className="p-6  w-full">
                            <h3 className="text-2xl font-bold">Plateformes</h3>
                            <div className="flex flex-wrap mt-2">
                                {Array.isArray(watchProviders.flatrate) ? (
                                    watchProviders.flatrate.map(provider => (
                                        <div key={provider.provider_id} className="flex flex-col items-center mr-4 mb-4">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                className="w-16 h-16 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                            <p className="text-gray-600 text-center mt-1">{provider.provider_name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600">Pas de fournisseur disponible</p>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">Données fournies par JustWatch</p>
                        </div>
                    )}
                    {trailer.length > 0 && (
                        <div className="p-6  w-full">
                            <h3 className="text-2xl font-bold">Bande annonce</h3>
                            <div className="flex flex-col items-center mt-4">
                                {trailer.slice(0, 1).map(video => (
                                    <div key={video.id} className="w-full md:w-[75%] lg:w-[50%] mx-auto mb-4">
                                        <iframe
                                            width="100%"
                                            height="600"
                                            src={`https://www.youtube.com/embed/${video.key}`}
                                            title={video.name}
                                            frameBorder="0"
                                            allowFullScreen
                                        ></iframe>
                                        <p className="text-center mt-2 p-2 text-gray-700">{video.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedPerson && (
                        <PersonDetails personId={selectedPerson} onClose={handlePersonDetailsClose} />
                    )}
                </div>
            )}
        </div>
    );
}
