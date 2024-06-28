import React, { useEffect, useRef, useState } from 'react';
import { fetchMovieDetails, fetchTrendingMovies } from '../utils/moviedb';
import MovieDetails from '../components/MovieDetails';

import { register } from "swiper/element-bundle";

register();

export default function HomePage() {
    const [trending, setTrending] = useState([]);
    const [index, setIndex] = useState(0);
    const [movieDetails, setMovieDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [slides, setSlides] = useState(1);
    const [page] = useState(1);

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

    const setSlidesPerview = () => {
        if (window.innerWidth < 640) {
            setSlides(2);
        } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
            setSlides(3);
        } else {
            setSlides(5);
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

    useEffect(() => {
        getTrendingMovies(page);
        setSlidesPerview();
        window.addEventListener("resize", setSlidesPerview);

        return () => {
            window.removeEventListener("resize", setSlidesPerview);
        };
    }, [page]);

    useEffect(() => {
        if (trending.length > 0) {
            getMovieDetails(trending[index]?.id);
        }
    }, [index, trending]);


    return (
        <div className="flex flex-col min-h-screen text-white">
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
                            <div className="relative w-screen h-screen overflow-hidden md:-mt-[10%] mt-1">
                                <div className="relative w-full h-full">
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${trending[index].backdrop_path}`}
                                        alt={trending[index]?.title || "Image de film"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "../src/assets/img_not_available.png";
                                        }}
                                    />
                                </div>
                                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                                <div className="hidden md:block absolute space-y-2 md:top-[35vh] md:left-24 md:w-1/3 text-white p-4 md:p-6 bg-zinc-900 bg-opacity-50 rounded-lg shadow-xl">
                                    <h1 className="text-xl md:text-5xl font-extrabold text-green-400 mb-2">{trending[index]?.title || "Titre non disponible"}</h1>
                                    <p className="md:text-lg">{trending[index]?.release_date || "Date de sortie inconnue"}</p>
                                    <div className="flex flex-row space-x-4">
                                        <div className="flex space-x-1">
                                            {renderStars(trending[index]?.vote_average) || "Note inconnue"}
                                        </div>
                                        <div className="md:text-lg">
                                            {Math.round(trending[index].vote_average * 100) / 100} /10
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
                                    <p>{trending[index]?.release_date || "Date de sortie inconnue"}</p>
                                    <div className="flex space-x-1">
                                        {renderStars(trending[index]?.vote_average) || "Note inconnue"}
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

                        <div className="md:py-4 py-4 md:px-4 flex-grow -mt-52">
                            <swiper-container
                                slides-per-view={slides}
                                loop="true"
                                autoplay-delay="2500"
                                autoplay-disable-on-interaction="false"
                            >
                                {trending.map((data, idx) => (
                                    <swiper-slide key={data.id}>
                                        <div
                                            className="relative group flex flex-col md:w-[300px] md:h-[300px] w-[190px] h-[300px] cursor-pointer overflow-hidden rounded-xl bg-transparent p-2 transition-transform duration-300 transform hover:scale-105"
                                            onClick={() => setIndex(idx)}
                                        >
                                            <div className="relative rounded-xl overflow-hidden">
                                                <img
                                                    className="md:h-[200px] w-full h-full object-cover transform transition duration-300 group-hover:scale-125"
                                                    src={"https://image.tmdb.org/t/p/original" + data.backdrop_path}
                                                    alt={data.title}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "../src/assets/img_not_available.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col items-center justify-between space-x-2 py-2">
                                                <h1 className="text-center line-clamp-1 pt-2 pl-2 text-white">{data.title}</h1>
                                                <div className="flex space-x-1">
                                                    {renderStars(data.vote_average)}
                                                </div>
                                            </div>
                                        </div>
                                    </swiper-slide>

                                ))}
                            </swiper-container>
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
