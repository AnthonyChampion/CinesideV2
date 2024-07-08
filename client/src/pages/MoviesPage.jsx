import React, { useEffect, useState, useRef } from 'react';
import { fetchGenresOfMovies, fetchMoviesByGenre } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { IoStar } from 'react-icons/io5';

export default function MoviesPage() {
    const [filters, setFilters] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [moviesFiltered, setMoviesFiltered] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const moviesListRef = useRef(null);
    const MOVIES_PER_PAGE = 10;

    const handleClickFilter = (filterId, filterName) => {
        setActiveFilter({ id: filterId, name: filterName });
        setPage(1);
        setLoading(true);
        setIsDropdownOpen(false);
    };

    const handleResetFilter = () => {
        setActiveFilter(null);
        setMoviesFiltered([]);
        setPage(1);
        setLoading(true);
        setIsDropdownOpen(false);
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
        getMoviesFiltered(page, activeFilter?.id || null);
    }, [page, activeFilter]);

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
            <div className="flex justify-start p-2 space-x-3 z-10 mt-5">
                <div className="relative list-none flex space-x-6">
                    <button type='button'
                        className="text-s md:text-base lg:text-lg text-white p-2 md:px-4 ml-6 md:py-2 rounded-lg hover:scale-110 bg-zinc-700 hover:bg-green-500 hover:text-white"
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                    >
                        <p>Genres</p>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full mt-2 ml-4 md:w-48 w-[21rem] bg-zinc-800 text-white rounded-lg shadow-lg z-20">
                            <button type="button"
                                className={`w-full p-2 text-center hover:bg-green-500 ${!activeFilter ? 'text-gray-400 bg-gray-600' : 'bg-transparent'}`}
                                onClick={handleResetFilter}
                            >
                                <p>Aucun filtre</p>
                            </button>
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    className={`w-full text-center text-lg p-2 hover:bg-green-500 ${activeFilter && activeFilter.id === filter.id ? 'bg-green-500 text-white' : 'bg-transparent'}`}
                                    onClick={() => handleClickFilter(filter.id, filter.name)}
                                >
                                    {filter.name}
                                </button>
                            ))}
                        </div>
                    )}
                    <Link to="/top_TMDB" className="flex space-x-1 text-s md:text-base lg:text-lg text-white p-2 md:px-4 ml-6 md:py-2 rounded-lg hover:scale-110 bg-zinc-700 hover:bg-green-500 hover:text-white">
                        <IoStar size={24} />
                        <button type="button" className="">Top TMDb</button>
                    </Link>
                </div>
            </div>

            <div ref={moviesListRef}>
                {loading && moviesFiltered.length === 0 ? (
                    <p className="text-center text-white pt-2">Chargement...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6 m-6">
                            {moviesFiltered.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-zinc-800"
                                >
                                    <Link to={`/film/${movie.id}`}>
                                        <img
                                            className="w-full md:h-[75%] object-cover transform transition duration-300 group-hover:scale-105"
                                            src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                                            alt={movie.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "../src/assets/img_not_available.png";
                                            }}
                                        />
                                        <div className="p-4">
                                            <div className="text-white">
                                                <h2 className="text-md md:text-xl font-bold truncate">{movie.title}</h2>
                                                <div className="flex flex-col mt-2 space-y-2">
                                                    <div className="flex space-x-1">
                                                        {renderStars(movie.vote_average) || "Note inconnue"}
                                                    </div>
                                                    <div className="text-[14px] md:text-[14px]">
                                                        {Math.round(movie.vote_average * 100) / 100} /10
                                                    </div>

                                                    <div className="text-sm md:text-md mt-1">
                                                        Sortie: {new Date(movie.release_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {moviesFiltered.length > 0 && (
                            <div className="flex justify-center mt-8 md:mt-14">
                                <button type="button"
                                    className="bg-green-500 text-white font-bold md:text-lg p-2 md:p-3 w-40 md:w-56 rounded-lg hover:bg-green-600 transition duration-300"
                                    onClick={handleLoadMoreMovies}
                                >
                                    Films suivants
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

        </section>
    );
}
