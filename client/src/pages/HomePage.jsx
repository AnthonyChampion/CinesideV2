import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fetchMovieDetails, fetchTrendingMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import TrailerMovie from "../components/TrailerMovie";
import { TbPlayerPlay } from "react-icons/tb";
import { Button } from 'flowbite-react';

export default function HomePage() {
    const [trending, setTrending] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const topPage = useRef(null);

    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    const getTrendingMovies = useCallback(async (pageNumber) => {
        try {
            setLoading(true);
            const data = await fetchTrendingMovies(pageNumber);
            setTrending(data.results);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trending movies:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getTrendingMovies(page);
    }, [getTrendingMovies, page]);

    const fetchMovieDetailsAndGenres = useCallback(async () => {
        if (trending[index]) {
            try {
                const movieId = trending[index].id;
                const movieDetails = await fetchMovieDetails(movieId);
                setTrending(prevTrending =>
                    prevTrending.map((movie, i) =>
                        i === index ? { ...movie, genres: movieDetails.genres } : movie
                    )
                );
            } catch (error) {
                console.error('Erreur dans la récupération des données:', error);
            }
        }
    }, [index, trending]);

    useEffect(() => {
        fetchMovieDetailsAndGenres();
    }, [fetchMovieDetailsAndGenres]);

    const handleShowTrailer = useCallback((movieId) => {
        setSelectedMovieId(movieId);
        setShowTrailer(true);
    }, []);

    const handleCloseTrailer = useCallback(() => {
        setShowTrailer(false);
    }, []);

    const scrollToTop = () => {
        if (topPage.current) {
            topPage.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handlePageChange = (direction) => {
        if (direction === 'prev' && page > 1) {
            setPage(prevPage => prevPage - 1);
            setIndex(0);
        } else if (direction === 'next') {
            setPage(prevPage => prevPage + 1);
            setIndex(0);
        }
    };

    return (
        <div ref={topPage} className="flex flex-col min-h-screen dark:text-white bg-white dark:bg-transparent md:-mt-28">
            <section className="flex-grow w-screen">
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <header className="dark:bg-[#18181b] md:h-[75vh] h-[62vh]">
                            {trending[index] && (
                                <div className="relative w-screen md:h-[75vh] h-[65vh] overflow-hidden bg-[#18181b]">
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${trending[index].backdrop_path}`}
                                        alt={trending[index]?.title || "Image du film"}
                                        className="w-full flex object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "../src/assets/img_not_available.png";
                                        }}
                                    />
                                    <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#18181b] via-transparent"></div>
                                    <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent"></div>
                                    <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-[#18181b] via-transparent"></div>
                                    <div className="absolute inset-0 space-y-1 top-[32vh] md:space-y-4 md:top-[30vh] md:left-36 md:w-2/5 w-full h-fit text-white md:p-6 p-4 animate-showContent">
                                        <span className="bg-gray-100 text-gray-800 md:text-lg text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-gray-500">En tendance</span>
                                        <h1 className="font-bold text-xl md:text-5xl uppercase pt-4">{trending[index]?.title || "Title not available"}</h1>
                                        {trending[index].genres && (
                                            <div className="flex items-center">
                                                {trending[index].genres.reduce((acc, genre, i) => {
                                                    if (i === 0) {
                                                        return [...acc, <span key={genre.id} className="md:text-lg text-xs py-1 ">{genre.name}</span>];
                                                    }
                                                    return [
                                                        ...acc,
                                                        <span key={`dot-${i}`} className="text-md md:px-2 px-1 py-1">•</span>,
                                                        <span key={genre.id} className="md:text-lg text-xs md:px-2 px-1 py-1">{genre.name}</span>
                                                    ];
                                                }, [])}
                                            </div>
                                        )}

                                        <p className="md:text-lg text-sm">
                                            {trending[index]?.release_date ? new Date(trending[index].release_date).getFullYear() : "Date de sortie inconnue"}
                                        </p>

                                        <div className="flex space-x-4 pt-2">
                                            <Button
                                                className="text-white border-2 border-white bg-transparent rounded-sm md:text-lg md:py-1 px-2 md:px-2 hover:bg-cyan-700 transition duration-300 items-center"
                                                onClick={() => handleShowTrailer(trending[index].id)}
                                            >
                                                <div className="flex md:space-x-1 items-center">
                                                    <TbPlayerPlay />
                                                    <p>Bande Annonce</p>
                                                </div>
                                            </Button>
                                            <Link to={`/film/${trending[index].id}`}>
                                                <Button className="text-white rounded-sm md:text-lg md:py-2 px-2 md:px-4 bg-cyan-700 border-2 border-cyan-700 hover:border-2 hover:border-white hover:text-white transition duration-800">
                                                    Plus de détails
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </header>
                        <div className="flex w-full items-center justify-center dark:bg-[#18181b] pt-4">
                            <div className="w-full md:w-[80%]">
                                <div className="flex p-4 md:p-0">
                                    <div className="flex justify-between md:justify-end w-full md:gap-2">
                                        {page > 1 && (
                                            <Button
                                                className="dark:text-black border-2 dark:border-white bg-white text-black border-black rounded-sm md:text-md hover:bg-cyan-700 hover:text-white dark:hover:text-white transition duration-300 shadow-lg"
                                                onClick={() => handlePageChange('prev')}
                                                disabled={page <= 1}
                                            >
                                                Films précédents
                                            </Button>
                                        )}
                                        <Button
                                            className="dark:text-black border-2 dark:border-white bg-white text-black border-black rounded-sm md:text-md hover:bg-cyan-700 hover:text-white dark:hover:text-white transition duration-300 shadow-lg"
                                            onClick={() => handlePageChange('next')}
                                            disabled={trending.length === 0}
                                        >
                                            Films suivants
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <div className="border-t border-gray-300 md:mt-4"></div>
                                </div>
                                <div className="flex flex-wrap md:mt-4 mt-2">
                                    {trending.map((data, idx) => (
                                        <div
                                            key={data.id}
                                            className="group flex flex-col cursor-pointer bg-transparent p-2 mb-2 md:mt-0 shadow-lg w-full md:w-1/5"
                                            onClick={() => {
                                                setIndex(idx);
                                                scrollToTop();
                                            }}
                                        >
                                            <div className="relative">
                                                <img
                                                    className="w-full md:h-[220px] h-[200px] object-cover transition-transform duration-200 transform group-hover:scale-105"
                                                    src={"https://image.tmdb.org/t/p/original" + data.backdrop_path}
                                                    alt={data.title}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "../src/assets/img_not_available.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4 space-y-1 text-center">
                                                <p className="text-sm text-gray-700 dark:text-gray-400">{data.release_date}</p>
                                                <h2 className="text-md font-bold line-clamp-1 dark:text-white text-black">{data.title}</h2>
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
