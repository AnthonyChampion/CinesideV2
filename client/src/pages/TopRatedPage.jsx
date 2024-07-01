import React, { useEffect, useRef, useState } from 'react';
import { fetchTopRatedMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { PiArrowBendRightDownBold } from 'react-icons/pi';

export default function TopratedMovies() {
    const [toprated, setToprated] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [index, setIndex] = useState(0);

    const moviesList = useRef(null);

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
        getTopratedMovies(currentPage);
    }, [currentPage]);

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
        if (moviesList.current) {
            moviesList.current.scrollIntoView({ behavior: 'smooth' });
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
        <section className="w-screen h-fit text-white flex flex-col items-center">

            {toprated[index] && (
                <div className="relative w-screen h-screen overflow-hidden">
                    {/* Background image */}
                    <img
                        src={`https://image.tmdb.org/t/p/original${toprated[index].backdrop_path}`}
                        alt={toprated[index]?.title || "Movie Image"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "../src/assets/img_not_available.png";
                        }}
                    />
                    {/* Overlay and movie details */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>
                    </div>
                    {/* Details section */}
                    <div className="hidden md:block absolute inset-0 space-y-6 md:top-[30vh] md:left-14 md:w-2/5 text-white p-4 md:p-6">
                        <h1 className="text-3xl">Top TMDb</h1>
                        <h2 className="text-xl font-bold md:text-5xl uppercase">{toprated[index]?.title || "Title not available"}</h2>
                        <p className="md:text-lg">{toprated[index]?.release_date || "Release date unknown"}</p>
                        <p className="text-sm md:text-lg md:line-clamp-2 line-clamp-2 text-justify">{toprated[index].overview || "Aucune description"}</p>
                        <Link to={`/film/${toprated[index].id}`}>
                            <button className="mt-10 text-white font-bold md:text-lg py-2 md:py-3 px-4 md:px-6 border-2 border-white rounded-lg hover:bg-green-600 transition duration-300">
                                Voir détails
                            </button>
                        </Link>
                    </div>
                </div>
            )}
            <div className="absolute flex text-4xl bottom-10 right-[14%] items-center space-x-2 cursor-pointer hover:scale-110" onClick={scrollToTop}>
                <h2 className="text-4xl pb-6">Films les mieux notés</h2>
                <PiArrowBendRightDownBold />
            </div>
            <div ref={moviesList} className="md:py-4 py-4 md:px-4 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {toprated.map((data, idx) => (
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
        </section>
    );
}


{/* <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <h2 className="text-lg md:text-xl font-bold text-white">{movie.title}</h2>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="flex flex-col">
                                        <div className="flex space-x-1">
                                            {renderStars(movie.vote_average) || "Note inconnue"}
                                        </div>
                                        <div className="text-[14px] md:text-[16px]">
                                            {Math.round(movie.vote_average * 100) / 100} /10
                                        </div>
                                    </div>
                                </div>
                            </div> */}