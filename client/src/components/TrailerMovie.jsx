// Trailer.jsx

import React, { useEffect, useState } from 'react';
import { fetchMovieTrailer } from '../utils/moviedb';

const Trailer = ({ movieId, onClose }) => {
    const [trailerKey, setTrailerKey] = useState('');

    useEffect(() => {
        const fetchTrailer = async () => {
            try {
                const trailer = await fetchMovieTrailer(movieId);
                if (trailer.results.length > 0) {
                    setTrailerKey(trailer.results[0].key);
                }
            } catch (error) {
                console.error('Error fetching trailer:', error);
            }
        };

        fetchTrailer();
    }, [movieId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="max-w-screen-lg w-full">
                {trailerKey ? (
                    <iframe
                        title="movie-trailer"
                        width="100%"
                        height="500"
                        src={`https://www.youtube.com/embed/${trailerKey}`}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <p className="text-white text-center">Bande annonce indisponible</p>
                )}
                <button
                    className="absolute md:top-[19%] top-[20%] md:right-[20%] right-3 text-white bg-red-800 px-2 py-1 rounded-md hover:bg-gray-600"
                    onClick={onClose}
                >
                    Fermer
                </button>
            </div>
        </div>
    );
};

export default Trailer;
