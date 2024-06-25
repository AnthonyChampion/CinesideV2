import React, { useEffect, useRef, useState } from 'react';
import { fetchMovieDetails, fetchTrendingMovies } from '../utils/moviedb';
import MovieDetails from '../components/MovieDetails';

export default function HomePage() {
    const [trending, setTrending] = useState([]);
    const [index, setIndex] = useState(0);
    const [movieDetails, setMovieDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [page, setPage] = useState(1);

    const moviesListRef = useRef(null);

    const getTrendingMovies = async (page) => {
        try {
            const data = await fetchTrendingMovies(page);
            setTrending(data.results);
            setIndex(0);
            setLoading(false);
        } catch (error) {
            console.error('Erreur dans la récupération des films:', error);
            setLoading(false);
        }
    };

    const getMovieDetails = async (id) => {
        try {
            const data = await fetchMovieDetails(id);
            if (data) {
                setMovieDetails(data);
            }
        } catch (error) {
            console.error('Erreur dans la récupération des détails:', error);
        }
    };

    useEffect(() => {
        getTrendingMovies(page);
    }, [page]);

    useEffect(() => {
        if (trending.length > 0) {
            getMovieDetails(trending[index]?.id);
        }
    }, [index, trending]);

    const scrollToTop = () => {
        if (moviesListRef.current) {
            moviesListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
            <section className="flex-grow w-screen">
                {loading && page === 1 ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {trending[index] && (
                            <div className="relative w-full h-full overflow-hidden md:-mt-24 -mt-4">
                                <img
                                    src={`https://image.tmdb.org/t/p/original${trending[index].backdrop_path}`}
                                    alt={trending[index]?.title || "Image de film"}
                                    className="w-full md:h-[600px] object-cover brightness-70"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "../src/assets/img_not_available.png";
                                    }}
                                />
                                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                                <div className="hidden md:block absolute md:top-[20vh] md:left-24 md:w-1/3 text-white p-4 md:p-6 bg-zinc-900 bg-opacity-50 rounded-lg shadow-xl">
                                    <h1 className="text-xl md:text-5xl font-extrabold text-green-400 mb-2">{trending[index]?.title || "Titre non disponible"}</h1>
                                    <div className="flex items-center justify-between text-sm md:text-lg mb-4">
                                        <p>{trending[index]?.release_date || "Date de sortie inconnue"}</p>
                                        <div className="flex items-center space-x-2">
                                            <div className="rounded-full bg-green-500 text-white text-xs md:text-sm flex items-center justify-center w-10 h-10">
                                                {Math.round(trending[index]?.vote_average * 10) / 10 || "Note à venir"}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm md:text-lg md:line-clamp-4 line-clamp-2 text-justify mb-4">{trending[index].overview}</p>
                                    <button
                                        className="bg-green-500 text-white font-bold md:text-lg py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-green-600 transition duration-300"
                                        onClick={() => setShowDetails(true)}
                                    >
                                        Voir détails
                                    </button>
                                </div>
                                <div className="md:hidden text-white p-4 bg-zinc-800 bg-opacity-50 rounded-lg shadow-xl">
                                    <h1 className="text-xl font-extrabold text-green-400 mb-2">{trending[index]?.title || "Titre non disponible"}</h1>
                                    <div className="flex items-center justify-between text-sm mb-4">
                                        <p>{trending[index]?.release_date || "Date de sortie inconnue"}</p>
                                        <div className="flex items-center space-x-2">
                                            <div className="rounded-full bg-green-500 text-white text-xs flex items-center justify-center w-10 h-10">
                                                {Math.round(trending[index]?.vote_average * 10) / 10 || "Note à venir"}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm line-clamp-2 text-justify mb-4">{trending[index].overview}</p>
                                    <button
                                        className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                                        onClick={() => setShowDetails(true)}
                                    >
                                        Voir détails
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="container mx-auto md:py-14 py-4 px-4 flex-grow" ref={moviesListRef}>
                            <h1 className="md:w-[30%] w-full p-3 md:p-3 z-10 md:text-3xl text-xl text-center text-white border-2 border-white px-4 rounded-lg">Films en tendances</h1>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-4 md:mt-6">
                                {trending.map((data, idx) => (
                                    <div
                                        key={data.id}
                                        className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-zinc-800 p-2"
                                        onClick={() => setIndex(idx)}
                                    >
                                        <img
                                            className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105"
                                            src={"https://image.tmdb.org/t/p/w500" + data.poster_path}
                                            alt={data.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "../src/assets/img_not_available.png";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <h2 className="text-lg md:text-xl font-bold text-white">{data.title}</h2>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <div className="rounded-full bg-green-500 text-white text-xs md:text-sm flex items-center justify-center w-10 h-10">
                                                    {Math.round(data.vote_average * 10) / 10}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-8 md:mt-14">
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
                        </div>
                    </>
                )}
                {showDetails && (
                    <MovieDetails
                        movie={movieDetails}
                        onClose={() => setShowDetails(false)}
                    />
                )}
            </section>
        </div>
    );
}
