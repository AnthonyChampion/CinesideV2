// HomePage.jsx

import React, { useEffect, useRef, useState } from 'react';
import { fetchTrendingMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { PiArrowBendRightDownBold } from 'react-icons/pi';
import TrailerMovie from "../components/TrailerMovie"

export default function HomePage() {
    const [trending, setTrending] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const movieList = useRef(null);
    const topPage = useRef(null);

    const [showTrailer, setShowTrailer] = useState(false); // State to manage showing Trailer component
    const [selectedMovieId, setSelectedMovieId] = useState(null); // State to store selected movie ID

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
            scrollToTop();
        }
    };

    const scrollToTop = () => {
        if (movieList.current) {
            movieList.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollTopPage = () => {
        if (topPage.current) {
            topPage.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleShowTrailer = (movieId) => {
        setSelectedMovieId(movieId);
        setShowTrailer(true);
    };

    const handleCloseTrailer = () => {
        setShowTrailer(false);
    };

    return (
        <div ref={topPage} className="flex flex-col min-h-screen text-white">
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
                                    className="hidden md:block w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "../src/assets/img_not_available.png";
                                    }}
                                />
                                <img
                                    src={`https://image.tmdb.org/t/p/original${trending[index].poster_path}`}
                                    alt={trending[index]?.title || "Movie Image"}
                                    className="md:hidden w-full h-[85%] object-cover -mt-20"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "../src/assets/img_not_available.png";
                                    }}
                                />
                                {/* Overlay and movie details */}
                                <div className="absolute inset-0">
                                    <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
                                    <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#111111] via-[transparent] to-transparent"></div>
                                    <div className="md:hidden block h-[86%] absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent -mt-20"></div>
                                </div>
                                {/* Details section */}
                                <div className="hidden md:block absolute inset-0 space-y-6 md:top-[25vh] md:left-14 md:w-2/5 text-white md:p-6">
                                    <h1 className="text-3xl">A l'affiche</h1>
                                    <h2 className="font-bold md:text-5xl uppercase">{trending[index]?.title || "Title not available"}</h2>
                                    <p className="md:text-lg">{trending[index]?.release_date || "Date de sortie inconnue"}</p>
                                    <div className="flex mt-2 space-x-2 items-center">
                                        <div className="flex space-x-1">
                                            {renderStars(trending[index]?.vote_average) || "Note inconnue"}
                                        </div>
                                        <div className="text-[14px] md:text-[16px]">
                                            {Math.round(trending[index]?.vote_average * 100) / 100} /10
                                        </div>
                                    </div>
                                    <p className="text-sm md:text-lg md:line-clamp-2 line-clamp-2 text-justify">{trending[index].overview || "Aucune description"}</p>
                                    <div className="flex space-x-4">
                                        <Link to={`/film/${trending[index].id}`}>
                                            <button className="mt-10 text-white rounded-sm md:text-lg py-2 md:py-3 px-4 md:px-6 border-2 border-white hover:bg-green-600 transition duration-300">
                                                Voir détails
                                            </button>
                                        </Link>
                                        {/* Button to open Trailer */}
                                        <button
                                            className="mt-10 text-black bg-green-500 rounded-sm md:text-lg py-2 md:py-3 px-4 md:px-6 hover:bg-green-800 transition duration-300"
                                            onClick={() => handleShowTrailer(trending[index].id)}
                                        >
                                            Bande annonce
                                        </button>
                                    </div>
                                </div>
                                <div className="md:hidden absolute space-y-2 top-[48vh] w-full text-white p-4 ">
                                    <h1 className="text-md">A l'affiche</h1>
                                    <h2 className="text-xl font-bold  uppercase">{trending[index]?.title || "Title not available"}</h2>
                                    <p className="">{trending[index]?.release_date || "Date de sortie inconnue"}</p>
                                    <div className="flex mt-2 space-x-2 items-center">
                                        <div className="flex space-x-1">
                                            {renderStars(trending[index]?.vote_average) || "Note inconnue"}
                                        </div>
                                        <div className="text-[14px]">
                                            {Math.round(trending[index]?.vote_average * 100) / 100} /10
                                        </div>
                                    </div>

                                    <div className="flex space-x-4 justify-center">
                                        <Link to={`/film/${trending[index].id}`}>
                                            <button className="mt-4 text-white rounded-sm md:text-lg py-2 md:py-3 px-4 md:px-6 border-2 border-white hover:bg-green-600 transition duration-300">
                                                Voir détails
                                            </button>
                                        </Link>
                                        {/* Button to open Trailer */}
                                        <button
                                            className="mt-4 text-black bg-green-400 rounded-sm md:text-lg py-2 md:py-3 px-4 md:px-6  hover:bg-green-800 transition duration-300"
                                            onClick={() => handleShowTrailer(trending[index].id)}
                                        >
                                            Bande annonce
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="absolute flex items-center space-x-2 cursor-pointer transition-transform transform hover:scale-110 bottom-0 right-4 md:bottom-6 md:right-14" onClick={scrollToTop}>
                            <h2 className="text-lg md:text-4xl font-semibold pb-6 md:pb-0 text-white">Films en tendance</h2>
                            <PiArrowBendRightDownBold className="text-lg md:text-4xl text-white" />
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
                                        <div className="relative rounded-xl overflow-hidden"
                                            onClick={scrollTopPage}>
                                            <img
                                                className="w-full md:h-[300px] h-full object-contain transform transition duration-300 group-hover:scale-125"
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
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center space-x-4 mt-4 items-center h-[70%]">
                                    {currentPage > 1 && (
                                        <button onClick={goToPrevPage} className="md:h-40 md:w-40 h-20 w-28 px-4 py-2 bg-green-500 text-white rounded-md">
                                            Précédent
                                        </button>
                                    )}
                                    <button onClick={goToNextPage} className="md:h-40 md:w-40 h-20 w-28 px-4 py-2 bg-green-500 text-white rounded-md">
                                        Suivant
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {/* Conditional rendering of Trailer component */}
            {showTrailer && <TrailerMovie movieId={selectedMovieId} onClose={handleCloseTrailer} />}
        </div>
    );
}
