import React, { useEffect, useState, useRef } from 'react';
import { fetchGenresOfMovies, fetchMoviesByGenre } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { IoStar } from 'react-icons/io5';
import { Button } from "flowbite-react";
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

    const handleLoadLessMovies = () => {
        setPage(prevPage => prevPage - 1);
        setLoading(true);
        scrollToTop();
    };

    const handleClick = () => {
        setShowTopRated(true);
    };

    return (
        <section className="w-screen bg-[#101522] pt-4">
            <nav className="flex pl-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <Link to="/" className="inline-flex items-center">
                        <p className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                            <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            Accueil
                        </p>
                    </Link>
                    <Link to="/films">
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <p className="ms-1 text-sm font-medium text-gray-400 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Films</p>
                        </div>
                    </Link>
                </ol>
            </nav>
            <div className="md:flex md:flex-row flex-col z-10">
                <div className="md:flex-col flex-wrap md:w-[15%] w-full pt-6 pl-4">
                    <ul className="grid grid-cols-4 md:grid-cols-2 gap-2">
                        <li
                            className="w-full text-black"
                            onClick={handleResetFilter}
                        >
                            <Button type="button" className=" w-full md:text-sm">
                                Aucun filtre
                            </Button>
                        </li>
                        {filters.map((filter) => (
                            <li key={filter.id}
                                className="w-full text-white"
                                onClick={() => handleClickFilter(filter.id, filter.name)}
                            >
                                <Button type='button' className="w-full h-full items-center md:text-sm bg-transparent border-2 border-cyan-700">
                                    {filter.name}
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <Button className="text-white md:w-full w-[47%] flex items-center mt-2 p-1 md:p-0 gap-1 bg-cyan-700"
                        onClick={handleClick}>
                        <IoStar size={16} />
                        <p>Top TMDb</p>
                    </Button>
                </div>
                <div className=" md:w-[82%] w-full md:ml-6 mt-6">
                    {showTopRated ? (
                        <TopRated />
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-6">
                            <div className="flex col-span-2 md:col-span-2 items-center justify-center">
                                <div className="flex-col">
                                    <h1 className="md:text-3xl text-xl text-white font-bold text-center">{activeFilter ? activeFilter.name : 'Tous les films'}</h1>
                                    <div className="flex justify-center items-center space-x-5 mt-6 pb-4">
                                        {page > 1 && (
                                            <Button
                                                onClick={handleLoadLessMovies}
                                                className="flex items-center justify-center md:h-10 h-10 px-4 py-2 bg-cyan-700 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
                                            >
                                                Films précédents
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handleLoadMoreMovies}
                                            className="flex items-center justify-center md:h-10 h-10 px-4 py-2 bg-cyan-700 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
                                        >
                                            Films suivants
                                        </Button>
                                    </div>
                                    <div className="border-t border-gray-300 mt-4"></div>
                                </div>
                            </div>

                            {moviesFiltered.slice(0, 10).map((movie) => (
                                <div
                                    key={movie.id}
                                    className="group flex flex-col cursor-pointer bg-transparent pb-2 mt-4 md:mt-0 ml-4 md:ml-0"
                                >
                                    <Link to={`/film/${movie.id}`}>
                                        <div className="relative">
                                            <img
                                                className="md:w-[200px] md:h-[300px] h-[250px] object-cover"
                                                src={"https://image.tmdb.org/t/p/original" + movie.poster_path}
                                                alt={movie.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                        </div>
                                        <div className="p-4 space-y-1">
                                            <p className="text-sm text-gray-400">{movie.release_date}</p>
                                            <h2 className="text-md font-bold line-clamp-1 text-white">{movie.title}</h2>
                                        </div>
                                    </Link>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
