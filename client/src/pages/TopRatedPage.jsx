import React, { useEffect, useRef, useState } from 'react';
import { fetchTopRatedMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { IoArrowRedoOutline, IoArrowUndoOutline } from 'react-icons/io5';

export default function TopratedMovies() {
    const [toprated, setToprated] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [index, setIndex] = useState(0);

    const moviesList = useRef(null);
    const topPage = useRef(null);

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

    const scrollTopPage = () => {
        if (topPage.current) {
            topPage.current.scrollIntoView({ behavior: 'smooth' });
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
        <section className="w-screen h-fit text-white flex flex-col items-center bg-[#111111] -mt-[10vh] pt-[10vh] md:pt-0">

            {toprated[index] && (
                <div ref={topPage} className="relative w-screen h-screen overflow-hidden">
                    {/* Background image */}
                    <img
                        src={`https://image.tmdb.org/t/p/original${toprated[index]?.backdrop_path}`}
                        alt={toprated[index]?.title || "Movie Image"}
                        className="hidden md:block w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "../src/assets/img_not_available.png";
                        }}
                    />
                    <img
                        src={`https://image.tmdb.org/t/p/original${toprated[index]?.backdrop_path}`}
                        alt={toprated[index]?.title || "Movie Image"}
                        className="md:hidden w-full object-contain"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "../src/assets/img_not_available.png";
                        }}
                    />
                    {/* Overlay and movie details */}
                    <div className="absolute inset-0">
                        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
                        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>
                        <div className="md:hidden block h-[38%] absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent -mt-8"></div>
                    </div>
                    {/* Details section */}
                    <div className="absolute inset-0 md:space-y-6 space-y-3 md:top-[30vh] top-[35vh] md:left-14 md:w-2/5 text-white p-4 md:p-6">
                        <h1 className="md:text-3xl text-md">Top TMDb</h1>
                        <h2 className="text-xl font-bold md:text-5xl uppercase">{toprated[index]?.title || "Title not available"}</h2>
                        <p className="md:text-lg">{toprated[index]?.release_date || "Release date unknown"}</p>
                        <div className="flex mt-2 space-x-2 items-center">
                            <div className="flex space-x-1">
                                {renderStars(toprated[index]?.vote_average) || "Note inconnue"}
                            </div>
                            <div className="text-[14px] md:text-[16px]">
                                {Math.round(toprated[index]?.vote_average * 100) / 100} /10
                            </div>
                        </div>
                        <p className="text-sm md:text-lg line-clamp-2 text-justify">{toprated[index].overview || "Aucune description"}</p>
                        <Link to={`/film/${toprated[index].id}`}>
                            <button className="md:mt-10 mt-8 text-white rounded-sm md:text-lg py-2 md:py-3 px-4 md:px-6 bg-green-500 border-2 border-green-500 hover:bg-white hover:border-2 hover:border-white hover:text-black transition duration-300">
                                Voir détails
                            </button>
                        </Link>
                    </div>
                </div>
            )}
            <div className="absolute flex items-center space-x-2 pb-6 md:pb-2 cursor-pointer transition-transform transform hover:scale-110 bottom-0 right-4 md:bottom-6 md:right-14" onClick={scrollToTop}>
                <h2 className="text-lg md:text-4xl font-semibold text-white">Films les mieux notés</h2>
                <IoMdArrowDropdownCircle size={30} />
            </div>

            <div ref={moviesList} className="md:py-4 py-4 md:px-4 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {toprated.map((data, idx) => (
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
                                <h1 className="text-center line-clamp-2 text-white text-xl font-bold">{data.title}</h1>
                                <div className="flex justify-center mt-2 space-x-2 items-center">
                                    <div className="flex space-x-1">
                                        {renderStars(toprated[index]?.vote_average) || "Note inconnue"}
                                    </div>
                                    <div className="text-[14px] md:text-[16px]">
                                        {Math.round(toprated[index]?.vote_average * 100) / 100} /10
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                    <div className="flex justify-center items-center space-x-5 mt-6 h-[70%]">
                        {currentPage > 1 && (
                            <button
                                onClick={goToPrevPage}
                                className="flex items-center justify-center md:h-20 md:w-30 h-16 w-24 px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
                            >
                                <IoArrowUndoOutline size={50} className="mr-2" />

                            </button>
                        )}
                        <button
                            onClick={goToNextPage}
                            className="flex items-center justify-center md:h-20 md:w-30 h-16 w-24 px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                            <IoArrowRedoOutline size={50} className="mr-2" />

                        </button>
                    </div>

                </div>

            </div>
        </section>
    );
}
