import React, { useEffect, useRef, useState } from 'react';
import { fetchTopRatedMovies, fetchMovieDetails } from '../utils/moviedb';
import MovieDetails from '../components/MovieDetails';

export default function TopratedMovies() {
    const [toprated, setToprated] = useState([]);
    const [page, setPage] = useState(1);
    const [index, setIndex] = useState(0);
    const [selectMovie, setSelectedMovie] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const moviesListRef = useRef(null);

    const getTopratedMovies = async (page) => {
        try {
            const data = await fetchTopRatedMovies(page);
            setToprated(data.results);
            setIndex(0);
        } catch (error) {
            console.error('Erreur dans la récupération des films:', error);
        }
    };

    useEffect(() => {
        getTopratedMovies(page);
    }, [page]);

    const handleMovieClick = async (movie) => {
        try {
            const data = await fetchMovieDetails(movie.id);
            setSelectedMovie(data);
            setShowDetails(true);
        } catch (error) {
            console.error('Erreur dans la récupération des détails:', error);
        }
    };

    const scrollToTop = () => {
        if (moviesListRef.current) {
            moviesListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
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
        <section className="w-screen h-fit text-white flex flex-col items-center md:mt-16 mt-10 bg-zinc-900">

            {toprated[index] && (
                <div className="relative w-full overflow-hidden md:-mt-[8%] -mt-8">
                    <img
                        src={`https://image.tmdb.org/t/p/original${toprated[index]?.backdrop_path}`}
                        alt={toprated[index]?.title || "Image de film"}
                        className="w-full md:h-[650px] object-cover brightness-70"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "../src/assets/img_not_available.png";
                        }}
                    />
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                    <div className="hidden md:block absolute  md:bottom-20 md:left-14 text-white md:w-[35%] bg-zinc-900 bg-opacity-50 p-6 rounded-lg shadow-lg">
                        <h2 className="font-bold text-green-500 text-xl md:text-4xl text-left mb-2 truncate">
                            {toprated[index]?.title || "Titre non disponible"}
                        </h2>

                        <div className="flex flex-col text-sm md:text-lg mb-4">
                            <p>{toprated[index]?.release_date || "Date de sortie inconnue"}</p>
                            <div className="flex space-x-1">
                                {renderStars(toprated[index]?.vote_average) || "Note inconnue"}
                            </div>
                        </div>
                        <p className="text-sm md:text-base mb-4 md:line-clamp-3 line-clamp-2 text-justify">
                            {toprated[index]?.overview || "Aucune description disponible"}
                        </p>
                        <button
                            className="bg-green-500 text-white font-bold text-sm md:text-base px-3 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                            onClick={() => handleMovieClick(toprated[index])}
                        >
                            Voir détails
                        </button>
                    </div>
                    <div className="md:hidden text-white  bg-zinc-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
                        <h2 className="font-bold text-green-500 text-xl md:text-4xl text-left mb-2 truncate">
                            {toprated[index]?.title || "Titre non disponible"}
                        </h2>

                        <div className="flex flex-col text-sm md:text-lg mb-4">

                            <p>{toprated[index]?.release_date || "Date de sortie inconnue"}</p>
                            <div className="flex space-x-1">
                                {renderStars(toprated[index]?.vote_average) || "Note inconnue"}
                            </div>
                        </div>
                        <p className="text-sm mb-4 line-clamp-2 text-justify">
                            {toprated[index]?.overview || "Aucune description disponible"}
                        </p>
                        <button
                            className="bg-green-500 text-white font-bold text-sm px-3 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                            onClick={() => handleMovieClick(toprated[index])}
                        >
                            Voir détails
                        </button>
                    </div>
                </div>
            )}
            <div className="container mx-auto md:py-16 py-8 px-4" ref={moviesListRef}>
                <div className="flex justify-center w-full">
                    <h1 className="md:w-[25%] w-[60%] p-2 z-10 md:text-2xl text-lg text-center text-white border border-white px-4 rounded-lg bg-gradient-to-r from-green-500 to-indigo-500 shadow-lg">
                        Films les mieux notés
                    </h1>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-8">
                    {toprated.map((movie, idx) => (
                        <div
                            key={movie.id}
                            className="relative p-2 group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-zinc-800"
                            onClick={() => setIndex(idx)}
                        >
                            <img
                                className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105"
                                src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                                alt={movie.title}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "../src/assets/img_not_available.png";
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <h2 className="text-lg md:text-xl font-bold text-white">{movie.title}</h2>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="flex space-x-1">
                                        {renderStars(toprated[index]?.vote_average) || "Note inconnue"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center space-x-8 mt-8 md:mt-2 mb-10">
                {page > 1 && (
                    <button
                        className="bg-green-500 text-white font-bold md:text-lg p-2 md:p-3 w-40 md:w-56 rounded-lg hover:bg-green-600 transition duration-300"
                        onClick={() => {
                            setPage(page - 1);
                            scrollToTop();
                        }}
                    >
                        Films précédents
                    </button>
                )}
                <button
                    className="bg-green-500 text-white font-bold md:text-lg p-2 md:p-3 w-40 md:w-56 rounded-lg hover:bg-green-600 transition duration-300"
                    onClick={() => {
                        setPage(page + 1);
                        scrollToTop();
                    }}
                >
                    Films suivants
                </button>
            </div>
            {showDetails && (
                <MovieDetails
                    movie={selectMovie}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </section>
    );
}
