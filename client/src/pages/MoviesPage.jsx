// MoviesPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { fetchGenresOfMovies, fetchMoviesByGenre } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { IoStar } from 'react-icons/io5';
import { Button, Card } from "flowbite-react";
import TopRated from '../components/TopRated';

export default function MoviesPage() {
    const [filters, setFilters] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [moviesFiltered, setMoviesFiltered] = useState([]);
    const [showTopRated, setShowTopRated] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const moviesListRef = useRef(null);
    const MOVIES_PER_PAGE = 10;

    const handleClickFilter = (filterId, filterName) => {
        setActiveFilter({ id: filterId, name: filterName });
        setPage(1);
        setLoading(true);
        setShowTopRated(false);
    };

    const handleResetFilter = () => {
        setActiveFilter(null);
        setMoviesFiltered([]);
        setPage(1);
        setLoading(true);
        setShowTopRated(false);
    };

    const getGenresOfMovies = async () => {
        try {
            const data = await fetchGenresOfMovies();
            const filteredGenres = data.genres.filter(genre => genre.name !== "Téléfilm" && genre.name !== "Documentaire");
            setFilters(filteredGenres);
        } catch (error) {
            console.error('Erreur dans la récupération des genres:', error);
        }
    };

    const getMoviesFiltered = async (page, genreId) => {
        try {
            let allMovies = [];
            let currentPage = page;

            while (allMovies.length < MOVIES_PER_PAGE) {
                const data = await fetchMoviesByGenre(currentPage, genreId);
                const filteredMovies = genreId
                    ? data.results.filter(movie => movie.genre_ids.includes(genreId))
                    : data.results;

                filteredMovies.forEach(movie => {
                    if (!allMovies.find(m => m.id === movie.id)) {
                        allMovies.push(movie);
                    }
                });

                currentPage++;

                if (currentPage > data.total_pages) {
                    break;
                }
            }

            const slicedMovies = allMovies.slice(0, MOVIES_PER_PAGE);
            setMoviesFiltered(slicedMovies);
            setLoading(false);
        } catch (error) {
            console.error('Erreur dans la récupération des films:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getGenresOfMovies();
    }, []);

    useEffect(() => {
        if (!showTopRated) {
            getMoviesFiltered(page, activeFilter?.id || null);
        }
    }, [page, activeFilter, showTopRated]);

    const scrollToTop = () => {
        if (moviesListRef.current) {
            moviesListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLoadMoreMovies = () => {
        setPage(prevPage => prevPage + 1);
        setLoading(true);
        scrollToTop();
    };

    const handleClick = () => {
        setShowTopRated(true);
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
        <section className="w-screen bg-[#101522] pt-4">
            <div className="flex z-10">
                <div className="flex-col w-[15%] pt-6 pl-4">
                    <ul className="grid grid-cols-2 gap-2">
                        <li
                            className="w-full text-black"
                            onClick={handleResetFilter}
                        >
                            <Button type="button" className=" w-full md:text-sm rounded-md">
                                Aucun filtre
                            </Button>
                        </li>
                        {filters.map((filter) => (
                            <li key={filter.id}
                                className="w-fulltext-white"
                                onClick={() => handleClickFilter(filter.id, filter.name)}
                            >
                                <Button type='button' className="w-full h-full items-center md:text-sm rounded-md">
                                    {filter.name}
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <Button className="text-white w-full rounded-md flex items-center mt-2 gap-1 bg-cyan-700"
                        onClick={handleClick}>
                        <IoStar size={16} />
                        <p>Top TMDb</p>
                    </Button>
                </div>
                <div ref={moviesListRef} className=" w-[85%] mt-6">
                    {showTopRated ? (
                        <TopRated />
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
                            {moviesFiltered.map((movie) => (
                                <Card
                                    key={movie.id}
                                    className="relative group cursor-pointer border-none overflow-hidden rounded-lg shadow-lg bg-[#101522]"
                                >
                                    <Link to={`/film/${movie.id}`}>
                                        <img
                                            className="w-[280px] md:h-[350px] object-cover rounded-lg transform transition duration-300 group-hover:scale-105"
                                            src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                                            alt={movie.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "../src/assets/img_not_available.png";
                                            }}
                                        />
                                        <div className="mt-4">
                                            <div className="text-white">
                                                <h2 className="text-md md:text-lg font-bold truncate">{movie.title}</h2>
                                                <div className="flex flex-col space-y-1">
                                                    <div className="flex md:flex-row flex-col md:justify-between md:items-center">
                                                        {renderStars(movie.vote_average) || "Note inconnue"}
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
                            {moviesFiltered.length > 0 && (
                                <div className="flex justify-center mt-8 md:mt-14">
                                    <Button type="button"
                                        className="bg-green-500 text-white font-bold md:text-lg p-2 md:p-3 w-40 md:w-56 rounded-lg hover:bg-green-600 transition duration-300"
                                        onClick={handleLoadMoreMovies}
                                    >
                                        Plus de films
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
