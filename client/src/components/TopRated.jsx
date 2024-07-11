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
        <section className="h-fit flex flex-col items-center bg-[#101522]">
            <div className="grid grid-cols-2 md:grid-cols-6">
                <div className="flex col-span-2 md:col-span-2 items-center justify-center">
                    <div className="flex-col">
                        <h1 className="text-3xl text-white font-bold text-center">Top TMDb</h1>
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

                {toprated.slice(0, 20).map((data, idx) => (
                    <div
                        key={data.id}
                        className="group flex flex-col cursor-pointer bg-transparent pb-2"
                        onClick={() => setIndex(idx)}
                    >
                        <Link to={`/film/${data.id}`}>
                            <div className="relative">
                                <img
                                    className="w-[200px] h-[300px] object-contain"
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
                        </Link>

                    </div>
                ))}
            </div>
        </section>
    );
}
