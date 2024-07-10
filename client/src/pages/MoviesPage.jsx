import React, { useEffect, useState, useRef } from 'react';
import { fetchGenresOfMovies, fetchMoviesByGenre } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { IoStar } from 'react-icons/io5';
import { FiFilter } from "react-icons/fi";
import { Button, Card, MegaMenu } from "flowbite-react";
import Toprated from '../components/TopRated';

export default function MoviesPage() {
    const [filters, setFilters] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [moviesFiltered, setMoviesFiltered] = useState([]);
    const [showTopRated, setShowTopRated] = useState(false); // Updated to control top-rated movies display
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const moviesListRef = useRef(null);
    const MOVIES_PER_PAGE = 10;

    const handleClickFilter = (filterId, filterName) => {
        setActiveFilter({ id: filterId, name: filterName });
        setPage(1);
        setLoading(true);
        setShowTopRated(false); // Ensure top-rated movies are hidden when filtering
    };

    const handleResetFilter = () => {
        setActiveFilter(null);
        setMoviesFiltered([]);
        setPage(1);
        setLoading(true);
        setShowTopRated(false); // Ensure top-rated movies are hidden when resetting filter
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
        <section className="w-screen bg-[#111111] -mt-[10vh] pt-[10vh] ">
            <div className="flex justify-center p-2 space-x-3 z-10 mt-5 pl-5 ">
                <MegaMenu className="rounded-lg text-white bg-cyan-700">
                    <MegaMenu.Dropdown toggle={
                        <>
                            <button className="p-2 font-semibold flex items-center gap-1">
                                <FiFilter />
                                Genre
                            </button>
                        </>}
                        className="text-white text-center flex justify-center bg-zinc-700 mt-4 md:ml-10 md:w-[40%] w-[95%]">
                        <ul className="grid grid-cols-3 md:grid-cols-4 bg-zinc-700">
                            <li
                                className="w-full p-2 text-center text-black"
                                onClick={handleResetFilter}
                            >
                                <button type="button" className="md:text-xl hover:bg-green-500 p-3 rounded-lg">
                                    Aucun filtre
                                </button>
                            </li>
                            {filters.map((filter) => (
                                <li key={filter.id}
                                    className={`w-full text-center p-2 text-white ${activeFilter && activeFilter.id === filter.id ? ' text-black' : 'bg-transparent'}`}
                                    onClick={() => handleClickFilter(filter.id, filter.name)}
                                >
                                    <button type='button' className="md:text-xl hover:bg-green-500 p-3 rounded-lg">
                                        {filter.name}
                                    </button>

                                </li>
                            ))}
                        </ul>
                    </MegaMenu.Dropdown >
                </MegaMenu>
                <button className="p-2 pl-4 pr-4 font-semibold text-white rounded-lg flex items-center gap-1 bg-cyan-700"
                    onClick={handleClick}>
                    <IoStar size={16} />
                    <p>Top TMDb</p>
                </button>

            </div>

            <div ref={moviesListRef}>
                {loading && moviesFiltered.length === 0 && !showTopRated ? (
                    <p className="text-center text-white pt-2">Chargement...</p>
                ) : showTopRated ? (
                    <Toprated />
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 m-6">
                            {moviesFiltered.map((movie) => (
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
                        </div>

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
                    </>
                )}
            </div>

        </section>
    );
}
