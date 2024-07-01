import React, { useEffect, useRef, useState } from 'react';
import { fetchTrendingMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { PiArrowBendRightDownBold } from "react-icons/pi";

export default function HomePage() {
    const [trending, setTrending] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const movieList = useRef(null);

    useEffect(() => {
        const getTrendingMovies = async () => {
            try {
                setLoading(true);
                const data = await fetchTrendingMovies(currentPage);
                setTrending(data.results);
                setIndex(0); // Reset index to show the first movie on page change
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trending movies:', error);
                setLoading(false);
            }
        };

        getTrendingMovies();
    }, [currentPage]);

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

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
        scrollToTop();
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const scrollToTop = () => {
        if (movieList.current) {
            movieList.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col min-h-screen text-white">
            <section className="flex-grow w-screen">
                {loading && currentPage === 1 ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {trending[index] && (
                            <div className="relative w-screen h-screen overflow-hidden">
                                {/* Background image */}
                                <img
                                    src={`https://image.tmdb.org/t/p/original${trending[index].backdrop_path}`}
                                    alt={trending[index]?.title || "Movie Image"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "../src/assets/img_not_available.png";
                                    }}
                                />
                                {/* Overlay and movie details */}
                                <div className="absolute inset-0">
                                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                </div>
                                {/* Details section */}
                                <div className="hidden md:block absolute inset-0 space-y-6 md:top-[30vh] md:left-14 md:w-2/5 text-white p-4 md:p-6">
                                    <h1 className="text-3xl">A l'affiche</h1>
                                    <h2 className="text-xl font-bold md:text-5xl uppercase">{trending[index]?.title || "Title not available"}</h2>
                                    <p className="md:text-lg">{trending[index]?.release_date || "Release date unknown"}</p>
                                    <p className="text-sm md:text-lg md:line-clamp-2 line-clamp-2 text-justify">{trending[index].overview || "Aucune description"}</p>
                                    <Link to={`/film/${trending[index].id}`}>
                                        <button className="mt-10 text-white font-bold md:text-lg py-2 md:py-3 px-4 md:px-6 border-2 border-white rounded-lg hover:bg-green-600 transition duration-300">
                                            Voir détails
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                        <div className="absolute flex text-4xl bottom-10 right-[14%] items-center space-x-2 cursor-pointer hover:scale-110" onClick={scrollToTop}>
                            <h2 className="text-4xl pb-6">Films en tendance</h2>
                            <PiArrowBendRightDownBold />
                        </div>


                        {/* Grid of movie posters */}
                        <div ref={movieList} className="md:py-4 py-4 md:px-4 flex-grow">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {trending.map((data, idx) => (
                                    <div
                                        key={data.id}
                                        className="group flex flex-col cursor-pointer overflow-hidden rounded-xl bg-transparent transition-transform duration-300 transform hover:scale-105"
                                        onClick={() => setIndex(idx)}
                                    >
                                        <div className="relative rounded-xl overflow-hidden">
                                            <img
                                                className="w-full h-[300px] object-cover transform transition duration-300 group-hover:scale-125"
                                                src={"https://image.tmdb.org/t/p/original" + data.backdrop_path}
                                                alt={data.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h1 className="text-center line-clamp-2 text-white">{data.title}</h1>
                                            <div className="flex justify-center items-center space-x-1 mt-2">{renderStars(data.vote_average)}</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center space-x-4 mt-4 items-center h-[70%]">
                                    {currentPage > 1 && (
                                        <button onClick={goToPrevPage} className="h-40 w-40 px-4 py-2 bg-green-500 text-white rounded-md">
                                            Précédent
                                        </button>
                                    )}
                                    <button onClick={goToNextPage} className="h-40 w-40 px-4 py-2 bg-green-500 text-white rounded-md">
                                        Suivant
                                    </button>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
