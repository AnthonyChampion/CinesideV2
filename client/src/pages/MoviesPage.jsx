import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchGenresOfMovies, fetchMoviesByGenre, fetchMovieDetails } from '../utils/moviedb';
import MovieDetails from '../components/MovieDetails';

export default function MoviesPage() {
    const [filters, setFilters] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [moviesFiltered, setMoviesFiltered] = useState([]);
    const [page, setPage] = useState(1);
    const [movieDetails, setMovieDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    const moviesListRef = useRef(null);
    const MOVIES_PER_PAGE = 10;

    const handleClickFilter = (filterId, filterName) => {
        setActiveFilter({ id: filterId, name: filterName });
        setPage(1);
        setLoading(true);
    };

    const handleResetFilter = () => {
        setActiveFilter(null);
        setPage(1);
        setLoading(true);
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

                // Add unique movies to the allMovies array
                filteredMovies.forEach(movie => {
                    if (!allMovies.find(m => m.id === movie.id)) {
                        allMovies.push(movie);
                    }
                });

                currentPage++;

                // Stop fetching if we've reached the end of available pages
                if (currentPage > data.total_pages) {
                    break;
                }
            }

            // Slice to get exactly MOVIES_PER_PAGE movies
            const slicedMovies = allMovies.slice(0, MOVIES_PER_PAGE);
            setMoviesFiltered(slicedMovies);
            setLoading(false);
        } catch (error) {
            console.error('Erreur dans la récupération des films:', error);
            setLoading(false);
        }
    };

    const getMovieDetails = async (id) => {
        try {
            const data = await fetchMovieDetails(id);
            if (data) {
                setMovieDetails(data);
                setShowDetails(true);
            }
        } catch (error) {
            console.error('Erreur dans la récupération des détails:', error);
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

    const handleMovieClick = (id) => {
        getMovieDetails(id);
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
        <section className="w-screen">
            <div className="w-full flex flex-wrap justify-center p-2 md:space-x-3 bg-zinc-800 md:bg-opacity-60 z-10">
                <div className="list-none">
                    <button
                        className={`text-[17px] text-white p-2 hover:scale-125 ${!activeFilter ? 'text-red-400' : ''} active:bg-red-400 focus:outline-none focus:ring focus:ring-red-400`}
                        onClick={handleResetFilter}
                    >
                        Aucun filtre
                    </button>
                </div>

                {filters.map((filter) => (
                    <div key={filter.id} className="list-none" onClick={() => handleClickFilter(filter.id, filter.name)}>
                        <button className={`text-[17px] text-white p-2 hover:scale-125 ${activeFilter && activeFilter.id === filter.id ? 'text-green-500' : ''} active:green-500 focus:outline-none focus:ring focus:ring-green-500`}>
                            {filter.name}
                        </button>
                    </div>
                ))}
            </div>

            <div ref={moviesListRef}>
                {loading ? <p>Chargement...</p> : (
                    <>
                        {activeFilter?.name && (
                            <div className="text-white w-full text-center flex justify-center md:text-2xl text-lg mt-4 cursor-pointer">
                                Catégorie:<p className="text-green-500 pl-2">{activeFilter.name}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-4 md:mt-6 m-8">
                            {moviesFiltered.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="relative p-2 group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-zinc-800"
                                    onClick={() => handleMovieClick(movie.id)}
                                >
                                    <img
                                        className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105"
                                        src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                                        alt={movie.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "../src/assets/img_not_available.png";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <h2 className="text-lg md:text-xl font-bold text-white">{movie.title}</h2>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <div className="flex space-x-1">
                                                {renderStars(movie.vote_average) || "Note inconnue"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-8 md:mt-14">
                            <button
                                className="bg-green-500 text-white font-bold md:text-lg p-2 md:p-3 w-40 md:w-56 rounded-lg hover:bg-green-600 transition duration-300"
                                onClick={handleLoadMoreMovies}
                            >
                                Films suivants
                            </button>
                        </div>
                    </>
                )}
                {showDetails && (
                    <MovieDetails
                        movie={movieDetails}
                        onClose={() => setShowDetails(false)}
                    />
                )}
            </div>
        </section>
    );
}

MoviesPage.propTypes = {
    activeFilter: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }),
    page: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
};
