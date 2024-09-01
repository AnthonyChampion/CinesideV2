import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails } from '../utils/moviedb';
import PersonDetails from '../components/PersonDetails';
import useMovieData from '../hooks/useMovieData';
import axios from 'axios';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function MovieDetailPage() {
    const { id } = useParams();
    const movieId = parseInt(id);

    const movieList = useRef(null);

    const { credits, crew, similarMovies, trailer, watchProviders, loading, error } = useMovieData(movieId);
    const [movie, setMovie] = useState(null);
    const [favorites, setFavorites] = useState([]);
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

    const isFavorite = movie && favorites.some(fav => fav.id === movie.id);

    const toggleFavorite = async () => {
        // On vérifie si le film est déja en favoris
        const isFavorite = favorites.some(fav => fav.id === movie.id);

        try {
            if (isFavorite) {
                // On retire des favoris
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/favorites/${movie.id}`, {
                    data: { movie_id: movie.id }
                });
                if (response.status === 200) {
                    // On met à jour le state favoris
                    const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
                    setFavorites(updatedFavorites);
                } else {
                    console.error('Impossible de supprimer des favoris');
                }
            } else {
                // On ajoute aux favoris
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/favorites`, {
                    movie_id: movie.id,
                    title: movie.title,
                    thumbnail: movie.poster_path
                });

                if (response.status === 201) {
                    // On met à jour le state favoris
                    const updatedFavorites = [...favorites, movie];
                    setFavorites(updatedFavorites);
                } else {
                    console.error('Impossible de mettre en favoris');
                }
            }
        } catch (error) {
            console.error('Une erreur est survenue:', error);
        }
    };

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
        <div ref={movieList} className="flex flex-col items-center justify-center text-white font-Roboto bg-[#0a0a0b]">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-red-600" role="status">
                        <span className="visually-hidden">Chargement...</span>
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
                            className={`absolute top-4 right-4 flex items-center p-3 bg-white rounded-full shadow-lg cursor-pointer font-bold text-red-600 transition-transform duration-300 ease-in-out hover:scale-110`}
                            onClick={toggleFavorite}
                            aria-label="Favorite"
                        >
                            {isFavorite ? (
                                <AiFillHeart
                                    className="transition-opacity duration-200 ease-in-out opacity-100"
                                    size={24}
                                />
                            ) : (
                                <AiOutlineHeart
                                    className="transition-opacity duration-200 ease-in-out opacity-100"
                                    size={24}
                                />
                            )}
                        </button>

                    </div>
                    <div className="mt-8 px-3 md:px-0">
                        <h1 className="text-2xl md:text-5xl uppercase font-bold w-[75%]">{movie?.title || "Aucun titre disponible"}</h1>
                        <div className="md:flex md:flex-row flex-col items-center md:space-x-10 md:space-y-0 space-y-2 mt-4">
                            <p className="md:text-lg text-sm">Date de sortie: {movie?.release_date}</p>
                            <p className="md:text-lg text-sm">{movie?.runtime} min</p>
                            {movie?.genres && (
                                <div className="flex items-center">
                                    {movie?.genres.reduce((acc, genre, i) => {
                                        if (i === 0) {
                                            return [...acc, <span key={genre.id} className="md:text-lg text-xs md:px-2 py-1 rounded-md">{genre.name}</span>];
                                        }
                                        return [
                                            ...acc,
                                            <span key={`dot-${i}`} className="text-lg md:px-2 px-1 py-1">•</span>,
                                            <span key={genre.id} className="md:text-lg text-xs md:px-2 px-1 py-1 rounded-md">{genre.name}</span>
                                        ];
                                    }, [])}
                                </div>
                            )}
                        </div>
                    </div>

                    {crew && crew?.length > 0 && (
                        <div className="mt-2 flex md:space-x-4 items-center">
                            <h2 className="md:text-lg text-sm px-3 md:px-0">Réalisateur(s):</h2>
                            <ul className="md:text-lg text-sm flex space-x-2">
                                {crew.filter(cast => cast.job === "Director").map(cast => (
                                    <li key={cast?.id}>{cast?.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="md:mt-2 mt-3 px-3 space-y-2 md:px-0">
                        {renderStars(movie?.vote_average)}
                        <div className="flex items-center space-x-4">
                            <div className="flex space-x-2 items-center">
                                <p className="md:text-lg text-sm">Note: </p>
                            </div>
                            <div className="md:text-lg text-sm">
                                {Math.round(movie?.vote_average * 100) / 100} / 10
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 md:mt-8 px-3 md:px-0">
                        {Object.keys(watchProviders)?.length > 0 && (
                            <div>
                                <h2 className="md:text-3xl text-xl text-white  font-bold">Plateformes:</h2>
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    {watchProviders.flatrate && watchProviders.flatrate.length > 0 ? (
                                        watchProviders.flatrate.map(provider => (
                                            <div key={provider?.provider_id} className="flex items-center space-x-2">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w500${provider?.logo_path}`}
                                                    alt={provider?.provider_name}
                                                    className="w-16 h-16 object-contain"
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
                                <p className="text-sm text-gray-600 mt-2">Données fournies par JustWatch</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 md:mt-12 px-3 md:px-0">
                        <h2 className="md:text-3xl text-xl text-white font-bold pb-4">Synopsis</h2>
                        <p className="md:text-lg text-justify">{movie?.overview}</p>
                    </div>

                    {credits && credits?.length > 0 && (
                        <div className="mt-8 md:mt-12 px-3 md:px-0">
                            <h2 className="md:text-3xl text-xl text-white font-bold">Casting</h2>
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
                            <h2 className="md:text-3xl text-xl text-white font-bold">Videos</h2>
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
                        <div className="grid grid-cols-2 md:grid-cols-6 mt-20">
                            <div className="col-span-2 md:col-span-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="md:text-3xl text-xl pl-3 md:pl-0 text-white font-bold">Recommendations</h2>
                                </div>
                                <div className="border-t border-gray-300 mt-4"></div>
                            </div>
                            {similarMovies.slice(0, 18).map((data) => (
                                <div
                                    key={data.id}
                                    className="group flex flex-col cursor-pointer bg-transparent p-4 md:p-3 shadow-lg"
                                >
                                    <Link to={`/film/${data.id}`}>
                                        <div className="relative">
                                            <img
                                                className="w-full md:h-[300px] h-[250px] object-contain"
                                                src={"https://image.tmdb.org/t/p/original" + data.poster_path}
                                                alt={data.title}
                                                onClick={scrollToTop}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                        </div>
                                        <div className="p-4 space-y-1">
                                            <h3 className="text-md font-bold line-clamp-1 text-white uppercase">{data.title}</h3>
                                            <p className="text-sm text-gray-400 ">{data?.release_date ? new Date(data.release_date).getFullYear() : "N/A"}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
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

