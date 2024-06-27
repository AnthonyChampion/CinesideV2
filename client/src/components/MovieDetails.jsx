import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fetchMovieDetails, fetchMovieCredits, fetchMovieTrailer, fetchSimilarMovies, fetchWatchProviders } from '../utils/moviedb';
import PersonDetails from './PersonDetails';

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

    const getTrailers = useCallback(async (movieId) => {
        try {
            const trailerData = await fetchMovieTrailer(movieId);
            setTrailer(trailerData.results);
        } catch (error) {
            setError('Erreur dans la récupération du trailer');
        }
    }, []);

    const getWatchProviders = useCallback(async (movieId) => {
        try {
            const watchProvidersData = await fetchWatchProviders(movieId);
            const franceWatchProviders = watchProvidersData.results.FR || {};
            setWatchProviders(franceWatchProviders);
        } catch (error) {
            setError('Erreur dans la récupération des fournisseurs de visionnage');
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const creditsData = await fetchMovieCredits(movieId);
                setCredits(creditsData.cast);

                const similarMoviesData = await fetchSimilarMovies(movieId);
                setSimilarMovies(similarMoviesData.results);

                const trailerData = await fetchMovieTrailer(movieId);
                setTrailer(trailerData.results);

                const watchProvidersData = await fetchWatchProviders(movieId);
                const franceWatchProviders = watchProvidersData.results.FR || {};
                setWatchProviders(franceWatchProviders);

            } catch (error) {
                setError('Erreur dans la récupération des données');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [movieId]);

    return { credits, similarMovies, trailer, watchProviders, loading, error, updateCredits, updateSimilarMovies, getTrailers, getWatchProviders };
};

export default function MovieDetails({ movie, onClose }) {
    const [movieDetails, setMovieDetails] = useState(movie);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
    const { credits, similarMovies, trailer, watchProviders, loading, error, updateCredits, updateSimilarMovies, getTrailers, getWatchProviders } = useMovieData(movie.id);

    const [selectedPerson, setSelectedPerson] = useState(null);

    const handleMovieClick = useCallback(async (similarMovie) => {
        try {
            const data = await fetchMovieDetails(similarMovie.id);
            setMovieDetails(data);

            await updateCredits(similarMovie.id);
            await updateSimilarMovies(similarMovie.id);
            await getTrailers(similarMovie.id);
            await getWatchProviders(similarMovie.id);

        } catch (error) {
            console.error('Erreur dans la récupération des détails:', error);
        }
    }, [setMovieDetails, updateCredits, updateSimilarMovies, getTrailers, getWatchProviders]);

    const toggleFavorite = () => {
        let updatedFavorites;
        if (favorites.some(fav => fav.id === movieDetails.id)) {
            updatedFavorites = favorites.filter(fav => fav.id !== movieDetails.id);
        } else {
            updatedFavorites = [...favorites, movieDetails];
        }
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const isFavorite = favorites.some(fav => fav.id === movieDetails.id);

    const handleCastClick = (personId) => {
        setSelectedPerson(personId);
    };

    const handlePersonDetailsClose = () => {
        setSelectedPerson(null);
    };

    return (
        <div className="fixed inset-0 z-50 h-screen flex justify-center items-center bg-black bg-opacity-50 p-4 md:p-8 lg:p-12 ">
            <div className="bg-white text-black rounded-lg overflow-scroll noscrollbar max-h-full w-full md:w-3/4 lg:w-3/4 shadow-xl relative md:-mt-6">
                <div className="relative">
                    <img
                        src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                        alt={movieDetails.title}
                        className="w-full h-[300px] md:h-[400px] object-cover rounded-t-lg"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "../src/assets/img_not_available.png";
                        }}
                    />
                    <button
                        className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <button
                        className={`absolute top-4 right-16 bg-${isFavorite ? 'red' : 'green'}-500 text-white rounded-full w-10 h-10 flex items-center justify-center`}
                        onClick={toggleFavorite}
                        aria-label="Favorite"
                    >
                        {isFavorite ? '★' : '☆'}
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold">{movieDetails.title}</h2>
                    <p className="text-gray-700"><strong>Date de sortie:</strong> {movieDetails.release_date}</p>
                    <p className="text-gray-700"><strong>Note:</strong> {Math.round((movieDetails.vote_average) * 100) / 100} / 10</p>
                    <p className="text-gray-700"><strong>Genres:</strong> {movieDetails.genres?.map(genre => genre.name).join(', ')}</p>
                    <p className="text-gray-700 text-justify"><strong>Synopsis:</strong> {movieDetails.overview}</p>
                </div>
                {Object.keys(watchProviders).length > 0 && (
                    <div className="px-6 pb-6">
                        <h3 className="font-bold">Plateformes:</h3>
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
                        <p className="text-sm text-gray-600">Données fournies par JustWatch</p> {/* Attribution text */}
                    </div>
                )}
                {loading ? (
                    <div className="p-6">Chargement...</div>
                ) : error ? (
                    <div className="p-6 text-red-500">{error}</div>
                ) : (
                    <>
                        {trailer.length > 0 && (
                            <div className="px-6 pb-6">
                                <h3 className="text-xl font-bold">Bande annonce</h3>
                                <div className="flex flex-col items-center mt-4">
                                    {trailer.slice(0, 1).map(video => (
                                        <div key={video.id} className="w-full md:w-[75%] lg:w-[50%] mx-auto mb-4">
                                            <iframe
                                                width="100%"
                                                height="315"
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

                        {credits && (
                            <div className="px-6 pb-6">
                                <h3 className="text-xl font-bold">Crédits</h3>
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
                                            <p className="text-sm text-gray-600 text-center">{actor.character}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {similarMovies.length > 0 && (
                            <div className="px-6 pb-8">
                                <h3 className="text-xl font-bold">Films similaires</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                                    {similarMovies.slice(0, 12).map(similarMovie => (
                                        <div
                                            key={similarMovie.id}
                                            className="rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                                            onClick={() => handleMovieClick(similarMovie)}
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                                                alt={similarMovie.title}
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                            <div className="p-4">
                                                <h4 className="text-lg font-semibold mb-2">{similarMovie.title}</h4>
                                                <p className="text-gray-600">{similarMovie.release_date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            {selectedPerson && (
                <PersonDetails personId={selectedPerson} onClose={handlePersonDetailsClose} />
            )}
        </div>
    );
}

MovieDetails.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.number.isRequired,
        backdrop_path: PropTypes.string,
        title: PropTypes.string.isRequired,
        release_date: PropTypes.string.isRequired,
        vote_average: PropTypes.number.isRequired,
        genres: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })).isRequired,
        overview: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

