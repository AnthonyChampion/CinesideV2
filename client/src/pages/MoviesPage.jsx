import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchGenresOfMovies, fetchMoviesByGenre } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { Button } from "flowbite-react";
import TopRated from '../components/TopRated';

export default function MoviesPage() {
    const [filters, setFilters] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [moviesFiltered, setMoviesFiltered] = useState([]);
    const [showTopRated, setShowTopRated] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const MOVIES_PER_PAGE = 15;

    const handleClickFilter = useCallback((filterId, filterName) => {
        setActiveFilter({ id: filterId, name: filterName });
        setPage(1);
        setLoading(true);
        setShowTopRated(false);
    }, []);

    const handleResetFilter = useCallback(() => {
        setActiveFilter(null);
        setPage(1);
        setShowTopRated(false);
    }, []);

    const getGenresOfMovies = useCallback(async () => {
        try {
            const data = await fetchGenresOfMovies();
            const filteredGenres = data.genres.filter(genre => genre.name !== "Téléfilm" && genre.name !== "Documentaire");
            setFilters(filteredGenres);
        } catch (error) {
            console.error('Erreur dans la récupération des genres:', error);
        }
    }, []);

    const getMoviesFiltered = useCallback(async (page, genreId) => {
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
        } catch (error) {
            console.error('Erreur dans la récupération des films:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getGenresOfMovies();
    }, [getGenresOfMovies]);

    useEffect(() => {
        if (!showTopRated) {
            getMoviesFiltered(page, activeFilter?.id || null);
        }
    }, [page, activeFilter, showTopRated, getMoviesFiltered]);

    const handleLoadMoreMovies = useCallback(() => {
        setPage(prevPage => prevPage + 1);
        setLoading(true);
    }, []);

    const handleLoadLessMovies = useCallback(() => {
        setPage(prevPage => prevPage - 1);
        setLoading(true);
    }, []);

    const handleClick = useCallback(() => {
        setShowTopRated(true);
    }, []);

    const filteredMovies = useMemo(() => moviesFiltered.slice(0, 16), [moviesFiltered]);

    return (
        <section className="w-screen dark:bg-[#0a0a0b] bg-white">
            {loading && !showTopRated ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="md:flex md:flex-row flex-col z-10">
                        <div className="md:flex-col flex-wrap md:w-[10%] w-full pt-6 md:pt-16 md:pl-6">
                            <ul className="grid grid-cols-4 md:grid-cols-1 gap-2 md:gap-4 p-2 md:p-0">
                                <Button type='button' className="hidden md:flex text-black md:w-full items-center md:p-2 bg-white focus:bg-red-600 focus:text-white focus:border-2 transition ease-in-out transform hover:-translate-y-1"
                                    onClick={handleClick}>
                                    <p>Top TMDb</p>
                                </Button>
                                <li
                                    className="w-full text-black"
                                    onClick={handleResetFilter}
                                >
                                    <Button type="button" className="w-full h-full p-1 items-center md:text-sm transition ease-in-out transform hover:-translate-y-1 bg-white focus:bg-red-600 focus:text-white text-black border-2 shadow-lg dark:border-white">
                                        Populaires
                                    </Button>
                                </li>
                                {filters.map((filter) => (
                                    <li key={filter.id} className="w-full text-black">
                                        <Button
                                            type="button"
                                            className={`mr-2 mb-2 w-full h-full items-center transition ease-in-out transform border-2 dark:border-white shadow-lg hover:-translate-y-1 ${activeFilter?.id === filter.id ? 'bg-red-600 text-white' : 'bg-white text-black'}`}
                                            onClick={() => handleClickFilter(filter.id, filter.name)}
                                        >
                                            {filter.name}
                                        </Button>
                                    </li>
                                ))}

                                <Button className="md:hidden w-[205%] flex items-center md:p-2 bg-white text-black focus:bg-red-600 focus:text-white transition ease-in-out transform hover:-translate-y-1 shadow-lg"
                                    onClick={handleClick}>
                                    <p>Top TMDb</p>
                                </Button>
                            </ul>
                        </div>
                        <div className=" md:w-[82%] w-full md:ml-12 mt-4 md:mt-10">
                            {showTopRated ? (
                                <TopRated />
                            ) : (
                                <div className="flex flex-col p-4 space-y-1">
                                    <div className="flex">
                                        <div className="flex w-full justify-between md:justify-end md:gap-2">
                                            {page > 1 && (
                                                <Button
                                                    onClick={handleLoadLessMovies}
                                                    className="dark:text-black text-black border-2 dark:border-white shadow-lg bg-white rounded-sm md:text-md dark:hover:text-white hover:bg-red-600 hover:text-white"
                                                >
                                                    Précédents
                                                </Button>
                                            )}
                                            <Button
                                                onClick={handleLoadMoreMovies}
                                                className="dark:text-black text-black border-2 dark:border-white shadow-lg bg-white rounded-sm md:text-md dark:hover:text-white hover:bg-red-600 hover:text-white"
                                            >
                                                Suivants
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap -mx-3">
                                        {filteredMovies.map((movie) => (
                                            <div
                                                key={movie.id}
                                                className="flex flex-col z-10 cursor-pointer bg-transparent p-3 mt-4 md:mt-0 shadow-lg w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/5 px-4"
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
                                                        <p className="text-sm dark:text-gray-400 text-black">{movie.release_date}</p>
                                                        <h2 className="text-md font-bold line-clamp-1 dark:text-white text-black">{movie.title}</h2>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
