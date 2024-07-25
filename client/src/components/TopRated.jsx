import React, { useEffect, useState } from 'react';
import { fetchTopRatedMovies } from '../utils/moviedb';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function TopratedMovies() {
    const [toprated, setToprated] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [setIndex] = useState(0);

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
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <section className="h-fit flex flex-col items-center dark:bg-[#18181b] bg-white">
            <div className="flex flex-col p-4 space-y-4">
                <div className="flex">
                    <div className="flex w-full justify-between md:justify-end md:gap-2">
                        {currentPage > 1 && (
                            <Button
                                onClick={goToPrevPage}
                                className="dark:text-black text-black border-2 dark:border-white shadow-lg bg-white rounded-sm md:text-md dark:hover:text-white hover:bg-cyan-700 hover:text-white transition duration-300"
                            >
                                Films précédents
                            </Button>
                        )}
                        <Button
                            onClick={goToNextPage}
                            className="dark:text-black text-black border-2 dark:border-white shadow-lg bg-white rounded-sm md:text-md dark:hover:text-white hover:bg-cyan-700 hover:text-white transition duration-300"
                        >
                            Films suivants
                        </Button>
                    </div>
                </div>
                <div className="border-t border-gray-300"></div>

                <div className="flex flex-wrap -mx-3">
                    {toprated.map((movie) => (
                        <div
                            key={movie.id}
                            className="flex flex-col cursor-pointer bg-transparent p-3 mt-4 md:mt-0 shadow-lg w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/5 px-4"
                        >
                            <Link to={`/film/${movie.id}`}>
                                <div className="relative">
                                    <img
                                        className="w-full md:h-[360px] h-[250px] object-cover"
                                        src={"https://image.tmdb.org/t/p/original" + movie.poster_path}
                                        alt={movie.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "../src/assets/img_not_available.png";
                                        }}
                                    />
                                </div>
                                <div className="space-y-1 p-2">
                                    <p className="text-sm dark:text-gray-400 text-black">{movie.release_date}</p>
                                    <h2 className="text-md font-bold line-clamp-1 dark:text-white text-black">{movie.title}</h2>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
