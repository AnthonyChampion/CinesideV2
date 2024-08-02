import React, { useEffect, useState } from 'react';
import { fetchTopRatedMovies } from '../utils/moviedb';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function TopratedMovies() {
    const [toprated, setToprated] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const getTopratedMovies = async (page) => {
        setLoading(true);
        try {
            const data = await fetchTopRatedMovies(page);
            setToprated(data.results);
        } catch (error) {
            console.error('Erreur dans la récupération des films:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTopratedMovies(currentPage);
    }, [currentPage]);

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <section className="h-fit flex flex-col items-center bg-[#0a0a0b]">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-red-600" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col p-4 space-y-1">
                    <div className="flex">
                        <div className="flex w-full justify-between md:justify-center md:space-x-8">
                            {currentPage > 1 && (
                                <Button
                                    onClick={goToPrevPage}
                                    className="text-gray-200 shadow-lg bg-transparent rounded md:text-md hover:bg-red-600 hover:text-white"
                                >
                                    Précédents
                                </Button>
                            )}
                            <Button
                                onClick={goToNextPage}
                                className="text-gray-200 shadow-lg bg-transparent rounded md:text-md hover:bg-red-600 hover:text-white"
                            >
                                Suivants
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3">
                        {toprated.map((movie) => (
                            <div
                                key={movie.id}
                                className="flex flex-col cursor-pointer bg-transparent p-3 mt-4 md:mt-0 shadow-lg w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/5 px-4"
                            >
                                <Link to={`/film/${movie.id}`}>
                                    <div className="relative group">
                                        <img
                                            className="w-full md:h-[360px] h-[250px] object-cover transform transition-transform duration-300 group-hover:scale-105"
                                            src={"https://image.tmdb.org/t/p/original" + movie.poster_path}
                                            alt={movie.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "../src/assets/img_not_available.png";
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1 p-2">
                                        <h2 className="text-md font-bold line-clamp-1 text-white uppercase">{movie.title}</h2>
                                        <p className="text-sm text-gray-400 ">{movie.release_date}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
