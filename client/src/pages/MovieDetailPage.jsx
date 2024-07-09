import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails } from '../utils/moviedb';
import PersonDetails from '../components/PersonDetails';
import useMovieData from '../hooks/useMovieData';

const MovieDetailPage = () => {
    const { id } = useParams();
    const movieId = parseInt(id);

    const movieList = useRef(null);

    const { credits, crew, similarMovies, trailer, watchProviders, loading, error } = useMovieData(movieId);
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

    const scrollToTop = () => {
        if (movieList.current) {
            movieList.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const renderStars = (vote_average) => {
        const totalStars = 5;
        const filledStars = Math.round((vote_average / 10) * totalStars);
        const emptyStars = totalStars - filledStars;

        return (
            <div className="flex space-x-1">
                {Array.from({ length: filledStars }, (_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                ))}
                {Array.from({ length: emptyStars }, (_, i) => (
                    <span key={i} className="text-gray-400">★</span>
                ))}
            </div>
        );
    };

    return (
        <div ref={movieList} className="flex flex-col items-center justify-center text-white font-Roboto bg-[#111111] -mt-[10vh] pt-[10vh]">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="w-full md:max-w-7xl md:px-4 md:py-8 py-4">
                    <div className="relative w-full md:h-[500px]">
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
                            alt={movie?.title}
                            className="w-full h-full object-cover md:rounded-lg shadow-lg"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "../src/assets/img_not_available.png";
                            }}
                        />
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`}
                            alt={movie?.title}
                            className="hidden md:block absolute right-10 -bottom-[40%] w-[250px] h-[350px] object-cover"
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

                    <div className="mt-8 px-3 md:px-0">
                        <h1 className="text-3xl md:text-5xl uppercase font-bold w-[75%]">{movie?.title || "Title Not Available"}</h1>
                        <div className="md:flex md:flex-row flex-col md:space-x-10 md:space-y-0 space-y-2 mt-2">
                            <p className="md:text-lg">Release date: {movie?.release_date}</p>
                            <p className="md:text-lg">{movie?.runtime} min</p>
                            {movie?.genres && (
                                <p className="md:text-lg">
                                    {movie?.genres.map(genre => genre.name).join(' | ')}
                                </p>
                            )}
                        </div>
                    </div>
                    {crew && crew?.length > 0 && (
                        <div className="mt-2 flex space-x-4 items-end">
                            <h3 className="md:text-lg px-3 md:px-0">Director(s):</h3>
                            <ul className="md:text-lg flex space-x-2">
                                {crew.filter(cast => cast.job === "Director").map(cast => (
                                    <li key={cast?.id}>{cast?.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="md:mt-6 mt-3 px-3 space-y-2 md:px-0">
                        {renderStars(movie?.vote_average)}
                        <div className="flex items-center space-x-4">
                            <div className="flex space-x-2 items-center">
                                <p className="md:text-lg">Rating</p>
                            </div>
                            <div className="text-md">
                                {Math.round(movie?.vote_average * 100) / 100} / 10
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-8 px-3 md:px-0">
                        {Object.keys(watchProviders)?.length > 0 && (
                            <div>
                                <h3 className="md:text-2xl">Watch providers:</h3>
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    {watchProviders.flatrate && watchProviders.flatrate.length > 0 ? (
                                        watchProviders.flatrate.map(provider => (
                                            <div key={provider?.provider_id} className="flex items-center space-x-2">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${provider?.logo_path}`}
                                                    alt={provider?.provider_name}
                                                    className="w-12 h-12 object-contain"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "../src/assets/img_not_available.png";
                                                    }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="md:text-lg text-gray-600">N/A</p>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-2">Datas powered by JustWatch</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 md:mt-12  px-3 md:px-0">
                        <h2 className="md:text-2xl">Synopsis</h2>
                        <p className="md:text-lg text-justify">{movie?.overview}</p>
                    </div>

                    {credits && credits?.length > 0 && (
                        <div className="mt-8 md:mt-12 px-3 md:px-0">
                            <h3 className="md:text-2xl">Cast</h3>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                                {credits.slice(0, 8).map(actor => (
                                    <li key={actor?.id} className="flex flex-col items-center space-y-2">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${actor?.profile_path}`}
                                            alt={actor?.name}
                                            className="w-32 h-32 rounded-full object-cover cursor-pointer"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "../src/assets/img_not_available.png";
                                            }}
                                            onClick={() => handleCastClick(actor.id)}
                                        />
                                        <p className="font-semibold text-center">{actor?.name}</p>
                                        <p className="text-sm text-gray-500 text-center">{actor?.character}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {trailer && trailer.length > 0 && (
                        <div className="mt-8 md:mt-12 px-3 md:px-0 flex-col w-full justify-center">
                            <h3 className="md:text-2xl">Videos</h3>
                            <div className="mt-4 flex-col md:pr-[15vw] md:pl-[15vw]">
                                <iframe
                                    width="100%"
                                    height="400"
                                    src={`https://www.youtube.com/embed/${trailer[1]?.key}`}
                                    title={trailer[0].name}
                                    frameBorder="0"
                                    allowFullScreen
                                    className='justify-center'
                                ></iframe>
                                <p className="md:text-lg mt-2 text-center">{trailer[1]?.name}</p>
                            </div>
                        </div>
                    )}

                    {similarMovies && similarMovies.length > 0 && (
                        <div className="mt-8 md:mt-12  px-3 md:px-0">
                            <h3 className="md:text-2xl">Recommended</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                                {similarMovies.slice(0, 16).map(similarMovie => (
                                    <div
                                        key={similarMovie?.id}
                                        className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg"
                                    >
                                        <img
                                            className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105"
                                            src={`https://image.tmdb.org/t/p/w500${similarMovie?.poster_path}`}
                                            alt={similarMovie?.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "../src/assets/img_not_available.png";
                                            }}
                                        />
                                        <Link to={`/movie/${similarMovie?.id}`} onClick={scrollToTop}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                                <h2 className="text-lg md:text-xl line-clamp-2">{similarMovie?.title}</h2>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedPerson && (
                        <PersonDetails
                            personId={selectedPerson}
                            onClose={handlePersonDetailsClose}
                            renderStars={renderStars}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default MovieDetailPage;
