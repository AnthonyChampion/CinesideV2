import React, { useEffect, useState, useCallback } from 'react';
import { MoviesByDate } from '../utils/moviedb';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function DiscoverMovies() {
    const { annee } = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedDecade, setSelectedDecade] = useState('2024');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const fetchMovies = useCallback(async (year, page) => {
        setLoading(true);
        try {
            const data = await MoviesByDate({ 'primary_release_year': year, page });
            if (data && data.results) {
                setMovies(data.results);
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const year = annee || '2024';
        if (!annee) {
            navigate(`/film_par_annee/2024`);
        } else {
            fetchMovies(year, page);
            setSelectedDecade(Math.floor(year / 10) * 10);
        }
    }, [fetchMovies, annee, page, navigate]);

    const handleLoadMoreMovies = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handleLoadLessMovies = () => {
        setPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
    };

    const handleYearChange = (year) => {
        navigate(`/film_par_annee/${year}`);
        setPage(1);
        setDropdownOpen(false);
    };

    const toggleDropdown = (decade) => {
        setDropdownOpen(prevState => (selectedDecade === decade ? !prevState : true));
        setSelectedDecade(decade);
    };

    const decades = [];
    for (let year = 1950; year <= 2020; year += 10) {
        decades.push(year);
    }

    const yearsInDecade = Array.from({ length: 10 }, (_, i) => selectedDecade + i);

    return (
        <section className="w-screen bg-[#0a0a0b]">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-red-600" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="md:flex md:flex-row flex-col z-10">
                        <div className="md:flex-col flex-wrap md:w-[12%] w-full pt-6 md:pt-16 md:pl-10">
                            <ul className="grid grid-cols-4 md:grid-cols-1 md:gap-4 gap-2 p-2 md:p-0">
                                {decades.map((decade) => (
                                    <div key={decade} className="relative">
                                        <Button
                                            onClick={() => toggleDropdown(decade)}
                                            className={`md:mr-2 w-full md:p-2 ${selectedDecade === decade ? 'bg-red-600 text-white border-none' : 'bg-white text-black shadow-lg'} transition ease-in-out transform hover:-translate-y-1`}
                                        >
                                            {decade}'s
                                        </Button>
                                        {dropdownOpen && selectedDecade === decade && (
                                            <div className="absolute left-0 mt-2 w-full bg-[#18181b] rounded-md shadow-lg z-20">
                                                {yearsInDecade.map((year) => (
                                                    <button
                                                        key={year}
                                                        onClick={() => handleYearChange(year)}
                                                        className="block w-full text-center px-4 py-2 text-sm text-white hover:bg-gray-600"
                                                    >
                                                        {year}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col p-4 space-y-1 md:w-[82%] w-[full] md:ml-12 mt-4 md:mt-10">
                            <div className="flex">
                                <div className="flex w-full justify-between md:justify-center md:space-x-8">
                                    {page > 1 && (
                                        <Button
                                            onClick={handleLoadLessMovies}
                                            className="text-gray-200 shadow-lg bg-transparent rounded md:text-md hover:bg-red-600 hover:text-white"
                                        >
                                            Précédents
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleLoadMoreMovies}
                                        className="text-gray-200 shadow-lg bg-transparent rounded md:text-md hover:bg-red-600 hover:text-white"
                                    >
                                        Suivants
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                {movies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="flex flex-col cursor-pointer bg-transparent p-3 mt-4 md:mt-0 shadow-lg w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/5 px-4 group"
                                    >
                                        <Link to={`/film/${movie.id}`}>
                                            <div className="relative">
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
                    </div>
                </>
            )}
        </section>
    );
}
