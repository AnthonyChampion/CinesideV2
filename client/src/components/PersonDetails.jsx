import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchPersonDetails, fetchPersonMovies } from "../utils/moviedb";
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function PersonDetails({ personId, onClose }) {
    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [moviesToShow, setMoviesToShow] = useState(18);

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
        setMoviesToShow(prev => prev + 12);
    };

    return (
        <div className="fixed inset-0 z-50 h-screen w-screen flex items-center justify-center bg-black bg-opacity-10 ">
            <div className="relative w-full h-full md:w-3/4 lg:w-3/4 bg-white text-black md:rounded-lg overflow-scroll noscrollbar">
                <button
                    className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                {loading ? (
                    <div className="p-6 text-center text-lg">Chargement...</div>
                ) : error ? (
                    <div className="p-6 text-center text-red-600 text-lg">{error}</div>
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
                            <h1 className="text-2xl font-bold">{person.name}</h1>
                            <p><strong>Date de naissance:</strong> {person.birthday}</p>
                            <p className="text-justify"><strong>Biographie:</strong> {person.biography}</p>
                            {person.deathday && <p><strong>Date de décès:</strong> {person.deathday}</p>}
                        </div>

                        {movies.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-6 mt-20">
                                <div className="col-span-2 md:col-span-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-3xl text-black font-bold">Filmographie</h2>
                                        {movies.length > moviesToShow && (
                                            <Button
                                                onClick={handleSeeMore}
                                                className="flex items-center justify-center md:h-10 h-10 px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-white hover:text-red-600"
                                            >
                                                Afficher plus de films
                                            </Button>
                                        )}
                                    </div>
                                    <div className="border-t border-gray-300 mt-4"></div>
                                </div>
                                {movies.slice(0, moviesToShow).map((data) => (
                                    <div
                                        key={data.id}
                                        className="group flex flex-col cursor-pointer bg-transparent pb-2 shadow-lg p-3"
                                    >
                                        <Link to={`/film/${data.id}`}>
                                            <div className="relative">
                                                <img
                                                    className="w-[200px] h-[300px] object-contain"
                                                    src={"https://image.tmdb.org/t/p/original" + data.poster_path}
                                                    alt={data.title}
                                                    onClick={onClose}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "../src/assets/img_not_available.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4 space-y-1">
                                                <p className="text-sm text-gray-400">{data?.release_date ? new Date(data.release_date).getFullYear() : "N/A"}</p>
                                                <h2 className="text-md font-bold line-clamp-1 text-black">{data.title}</h2>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

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
    renderStars: PropTypes.func.isRequired
};
