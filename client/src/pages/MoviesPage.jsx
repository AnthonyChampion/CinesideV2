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
        scrollToTop
    }

    const handleClick = () => {
        setShowTopRated(true);
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
                            <Button type="button" className=" w-full md:text-sm">
                                Aucun filtre
                            </Button>
                        </li>
                        {filters.map((filter) => (
                            <li key={filter.id}
                                className="w-full text-white"
                                onClick={() => handleClickFilter(filter.id, filter.name)}
                            >
                                <Button type='button' className="w-full h-full items-center md:text-sm">
                                    {filter.name}
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <Button className="text-white w-full flex items-center mt-2 gap-1 bg-cyan-700"
                        onClick={handleClick}>
                        <IoStar size={16} />
                        <p>Top TMDb</p>
                    </Button>
                </div>
                <div className=" w-[82%] mt-6">
                    {showTopRated ? (
                        <TopRated />
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-6">
                            <div className="flex col-span-2 md:col-span-2 items-center justify-center">
                                <div className="flex-col">
                                    <h1 className="text-3xl text-white font-bold text-center">Top TMDb</h1>
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

                            {moviesFiltered.slice(0, 10).map((movie,) => (
                                <div
                                    key={movie.id}
                                    className="group flex flex-col cursor-pointer bg-transparent pb-2"
                                >
                                    <Link to={`/film/${movie.id}`}>
                                        <div className="relative">
                                            <img
                                                className="w-full h-[300px] object-contain"
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


// {moviesFiltered.length > 0 && (
//     <div className="flex justify-center mt-8 md:mt-14">
//         <Button type="button"
//             className="bg-green-500 text-white font-bold md:text-lg p-2 md:p-3 w-40 md:w-56 rounded-lg hover:bg-green-600 transition duration-300"
//             onClick={handleLoadMoreMovies}
//         >
//             Plus de films
//         </Button>
//     </div>
// )}