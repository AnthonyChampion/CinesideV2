import React, { useEffect, useRef, useState } from 'react';
import { fetchTrendingMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import TrailerMovie from "../components/TrailerMovie";
import { TbPlayerPlay } from "react-icons/tb";
import { Button } from 'flowbite-react';
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";

export default function HomePage() {

    const [trending, setTrending] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const movieList = useRef(null);
    const topPage = useRef(null);

    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    useEffect(() => {
        const getTrendingMovies = async () => {
            try {
                setLoading(true);
                const data = await fetchTrendingMovies(currentPage);
                setTrending(data.results);
                setIndex(0);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trending movies:', error);
                setLoading(false);
            }
        };

        getTrendingMovies();
    }, [currentPage]);

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
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
        <div ref={topPage} className="flex flex-col min-h-screen text-white bg-[#101522]">
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
                            <div className="relative w-screen h-[70vh] overflow-hidden">
                                <img
                                    src={`https://image.tmdb.org/t/p/original${trending[index].backdrop_path}`}
                                    alt={trending[index]?.title || "Movie Image"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "../src/assets/img_not_available.png";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#101522] via-transparent to-black"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#101522] via-transparent to-[#101522]"></div>
                                <div className="absolute inset-0 space-y-2 top-[30vh] md:space-y-6 md:top-[35vh] md:left-14 md:w-2/5 w-full h-fit text-white md:p-6 p-4">
                                    <h2 className="font-bold text-xl md:text-5xl uppercase">{trending[index]?.title || "Title not available"}</h2>
                                    <p className="md:text-lg">
                                        {trending[index]?.release_date ? new Date(trending[index].release_date).getFullYear() : "Date de sortie inconnue"}
                                    </p>

                                    <div className="flex space-x-4">
                                        <Button
                                            className="text-white border-2 border-white bg-transparent rounded-sm md:text-lg py-2 md:py-3 px-4 md:px-6 hover:bg-cyan-700 transition duration-300"
                                            onClick={() => handleShowTrailer(trending[index].id)}
                                        >
                                            <div className="flex space-x-1 items-center">
                                                <TbPlayerPlay />
                                                <p>Bande Annonce</p>
                                            </div>
                                        </Button>
                                        <Link to={`/film/${trending[index].id}`}>
                                            <Button className="text-white rounded-sm md:text-lg py-2 md:py-3 px-4 md:px-6 bg-cyan-700 border-2 border-cyan-700 hover:border-2 hover:border-white hover:text-white transition duration-800">
                                                Plus de détails
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={movieList} className="flex flex-col w-full items-center justify-center mt-8 pb-10">
                            <div className="w-full md:w-[80%]">
                                <div className="grid grid-cols-2 md:grid-cols-6">
                                    <div className="flex col-span-2 md:col-span-2 items-center justify-center">
                                        <div className="flex-col">
                                            <h1 className="text-3xl font-bold text-center">Sorties récentes</h1>
                                            <div className="flex justify-center items-center space-x-5 mt-6 pb-4">
                                                {currentPage > 1 && (
                                                    <Button
                                                        onClick={goToPrevPage}
                                                        className="flex items-center justify-center md:h-10 h-10 px-4 py-2 bg-cyan-700 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
                                                    >
                                                        Films précédents
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={goToNextPage}
                                                    className="flex items-center justify-center md:h-10 h-10 px-4 py-2 bg-cyan-700 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
                                                >
                                                    Films suivants
                                                </Button>
                                            </div>
                                            <div className="border-t border-gray-300 mt-4"></div>
                                        </div>
                                    </div>

                                    {trending.slice(0, 10).map((data, idx) => (
                                        <div
                                            key={data.id}
                                            className="group flex flex-col cursor-pointer bg-transparent pb-2"
                                            onClick={() => setIndex(idx)}
                                        >
                                            <div className="relative">
                                                <img
                                                    className="w-full h-[300px] object-contain"
                                                    src={"https://image.tmdb.org/t/p/original" + data.poster_path}
                                                    alt={data.title}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "../src/assets/img_not_available.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4 space-y-1">
                                                <p className="text-sm text-gray-400">{data.release_date}</p>
                                                <h2 className="text-md font-bold line-clamp-1 text-white">{data.title}</h2>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>
            {showTrailer && <TrailerMovie movieId={selectedMovieId} onClose={handleCloseTrailer} />}
        </div>
    );
}
