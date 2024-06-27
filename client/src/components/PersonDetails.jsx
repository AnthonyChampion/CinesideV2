import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchPersonDetails, fetchPersonMovies } from "../utils/moviedb";
import MovieDetails from './MovieDetails';

export default function PersonDetails({ personId, onClose }) {
    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [moviesToShow, setMoviesToShow] = useState(20);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const fetchPersonData = useCallback(async () => {
        try {
            setLoading(true);
            const personData = await fetchPersonDetails(personId);
            setPerson(personData);

            const moviesData = await fetchPersonMovies(personId);
            setMovies(moviesData.cast);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching person details:', error);
            setError('Erreur dans la récupération des détails de la personne');
            setLoading(false);
        }
    }, [personId]);

    useEffect(() => {
        fetchPersonData();
    }, [fetchPersonData, personId]);

    const handleSeeMore = () => {
        setMoviesToShow(prev => prev + 20);
    };

    const openMovieDetails = (movie) => {
        setSelectedMovie(movie);
    };

    const closeMovieDetails = () => {
        setSelectedMovie(null);
    };

    return (
        <div className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black bg-opacity-10 p-4 md:p-8 lg:p-6">
            <div className="relative w-full h-full md:w-3/4 lg:w-3/4 bg-white text-black rounded-lg overflow-scroll noscrollbar">
                <button
                    className="absolute top-4 right-4 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                {loading ? (
                    <div className="p-6 text-center text-lg">Chargement...</div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500 text-lg">{error}</div>
                ) : person ? (
                    <div className="p-6 flex flex-col items-center">
                        <img
                            src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
                            alt={person.name}
                            className="w-44 h-44 md:w-96 md:h-96 object-cover rounded-full shadow-md"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "../src/assets/img_not_available.png";
                                e.target.alt = "Image not available";
                            }}
                        />
                        <div className="mt-6 flex flex-col items-center space-y-4">
                            <h2 className="text-2xl font-bold">{person.name}</h2>
                            <p className="text-justify"><strong>Biographie:</strong> {person.biography}</p>
                            <p><strong>Date de naissance:</strong> {person.birthday}</p>
                            {person.deathday && <p><strong>Date de décès:</strong> {person.deathday}</p>}
                        </div>

                        {movies.length > 0 && (
                            <div className="mt-8 w-full">
                                <h3 className="text-xl font-bold pb-4 text-center">Filmographie</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {movies.slice(0, moviesToShow).map(movie => (
                                        <div
                                            key={movie.id}
                                            className="bg-gray-100 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                            onClick={() => openMovieDetails(movie)}
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-full h-[250px] object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                            <div className="p-4">
                                                <h4 className="text-lg font-semibold mb-2">{movie.title}</h4>
                                                <p className="text-gray-600">{movie.release_date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {movies.length > moviesToShow && (
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={handleSeeMore}
                                            className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition duration-300"
                                        >
                                            Afficher plus de films
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedMovie && (
                            <MovieDetails
                                movie={selectedMovie}
                                onClose={closeMovieDetails}
                            />
                        )}
                    </div>
                ) : (
                    <div className="p-6 text-center text-lg">Pas de données disponibles</div>
                )}
            </div>
        </div>
    );
}

PersonDetails.propTypes = {
    personId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
};
