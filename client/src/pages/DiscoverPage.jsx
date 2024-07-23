import React, { useEffect, useState, useCallback } from 'react';
import { MoviesByDate } from '../utils/moviedb'; // Adjust the import based on your file structure
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function DiscoverMovies() {
    const [movies, setMovies] = useState([]);
    const [year, setYear] = useState(2020); // Default year is 2024
    const [page, setPage] = useState(1); // Pagination state
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [selectedYearRange, setSelectedYearRange] = useState('2020-2024'); // Default year range is 2020-2024

    const fetchMovies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await MoviesByDate({ 'primary_release_year': year, page });
            if (data && data.results) {
                setMovies(data.results);
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
            setError('Failed to fetch movies.');
        } finally {
            setLoading(false);
        }
    }, [year, page]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    useEffect(() => {
        // Update selectedYearRange when year changes
        const startYear = Math.floor(year / 5) * 5;
        const endYear = startYear + 4;
        setSelectedYearRange(`${startYear}-${endYear}`);
    }, [year]);

    const handleLoadMoreMovies = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handleLoadLessMovies = () => {
        setPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
    };

    const handleYearRangeChange = (startYear, endYear) => {
        setSelectedYearRange(`${startYear}-${endYear}`);
        setYear(startYear); // Set the starting year for the selected range
        setPage(1); // Reset to page 1 when year changes
    };

    // Generate an array of year ranges from 1970 to 2025
    const yearRanges = [];
    for (let year = 1970; year <= 2025; year += 5) {
        yearRanges.push({ start: year, end: year + 4 });
    }

    return (
        <section className="w-screen dark:bg-[#18181b] bg-white pt-4">
            <nav className="flex pl-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <Link to="/" className="inline-flex items-center">
                        <p className="inline-flex items-center text-sm font-medium text-black hover:text-cyan-700 dark:text-gray-400 dark:hover:text-white">
                            <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            Accueil
                        </p>
                    </Link>
                    <Link to="/films">
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 dark:text-gray-400 text-black mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <p className="ms-1 text-sm font-medium dark:text-gray-400 hover:text-cyan-700 md:ms-2 text-black dark:hover:text-white">Années</p>
                        </div>
                    </Link>
                </ol>
            </nav>
            <div className="md:flex md:flex-row flex-col z-10">
                <div className="md:flex-col flex-wrap md:w-[10%] w-full pt-6 md:pt-10 md:pl-6">
                    <ul className="grid grid-cols-4 md:grid-cols-1 md:gap-4 gap-2 p-2 md:p-0">
                        {yearRanges.map(({ start, end }) => (
                            <Button
                                key={start}
                                onClick={() => handleYearRangeChange(start, end)}
                                className={`md:mr-2 w-full p-1 ${selectedYearRange === `${start}-${end}` ? 'bg-cyan-700 text-white' : 'bg-white text-black border-2 dark:border-white shadow-lg'} transition ease-in-out transform hover:-translate-y-1`}
                            >
                                {start}-{end}
                            </Button>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col p-4 space-y-4 md:w-[82%] w-[full] md:ml-12 mt-4">
                    <div className="flex items-center justify-between">
                        <h1 className="md:text-3xl text-xl dark:text-white text-black font-bold">
                            {selectedYearRange}
                        </h1>
                        <div className="flex space-x-5">
                            {page > 1 && (
                                <Button
                                    onClick={handleLoadLessMovies}
                                    className="dark:text-white text-black border-2 dark:border-white shadow-lg bg-transparent rounded-sm md:text-md hover:bg-cyan-700 hover:text-white transition duration-300"
                                >
                                    Films précédents
                                </Button>
                            )}
                            <Button
                                onClick={handleLoadMoreMovies}
                                className="dark:text-white text-black border-2 dark:border-white shadow-lg bg-transparent rounded-sm md:text-md hover:bg-cyan-700 hover:text-white transition duration-300"
                            >
                                Films suivants
                            </Button>
                        </div>
                    </div>
                    <div className="border-t border-gray-300"></div>

                    <div className="flex flex-wrap -mx-3">
                        {movies.map((movie) => (
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
            </div>

        </section>
    );
}
