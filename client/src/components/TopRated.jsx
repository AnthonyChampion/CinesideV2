import React, { useEffect, useRef, useState } from 'react';
import { fetchTopRatedMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { Button, Card } from 'flowbite-react';

export default function TopratedMovies() {
    const [toprated, setToprated] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [setIndex] = useState(0);

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
        <section className="w-screen h-fit text-white flex flex-col items-center bg-[#111111]">
            <div ref={moviesList} className="flex-grow">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 m-6">
                    {toprated.map((movie) => (
                        <Card
                            key={movie.id}
                            className="relative group cursor-pointer border-none overflow-hidden rounded-lg shadow-lg bg-zinc-800"
                        >
                            <Link to={`/film/${movie.id}`}>
                                <img
                                    className="w-full md:h-[420px] object-cover rounded-lg transform transition duration-300 group-hover:scale-105"
                                    src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                                    alt={movie.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "../src/assets/img_not_available.png";
                                    }}
                                />
                                <div className="mt-4">
                                    <div className="text-white">
                                        <h2 className="text-md md:text-xl font-bold truncate">{movie.title}</h2>
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex md:flex-row flex-col md:justify-between md:items-center">
                                                {renderStars(movie.vote_average) || "N/A"}
                                                <p className="md:text-md text-sm">{Math.round(movie.vote_average * 100) / 100} /10</p>
                                            </div>
                                            <div className="text-sm md:text-md">
                                                {new Date(movie.release_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    ))}


                </div>
                <div className="flex justify-center items-center space-x-5 mt-6 h-[70%]">
                    {currentPage > 1 && (
                        <Button
                            onClick={goToPrevPage}
                            className="flex items-center justify-center md:h-20 md:w-32 h-16 w-24 px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                            Page Précédente

                        </Button>
                    )}
                    <Button
                        onClick={goToNextPage}
                        className="flex items-center justify-center md:h-20 md:w-32 h-16 w-24 px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                        Page Suivante

                    </Button>
                </div>
            </div>
        </section>
    );
}
