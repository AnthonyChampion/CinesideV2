import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';

export default function Favorite() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/favorites/`);
                const sortedFavorites = response.data.sort((a, b) => a.title.localeCompare(b.title));
                setFavorites(sortedFavorites);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const removeFavorite = async (movieId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/favorites/${movieId}`);
            const updatedFavorites = favorites.filter(movie => movie.movie_id !== movieId);
            setFavorites(updatedFavorites.sort((a, b) => a.title.localeCompare(b.title)));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <section className="p-6 w-screen min-h-screen bg-[#0a0a0b] ">
            <div className="relative flex flex-col justify-center items-center mt-4 md:mt-0">
                <h1 className="md:text-3xl text-xl text-white font-bold text-center">Mes films favoris</h1>
                <span className="mt-1 text-white">Total: {favorites.length} films</span>
                <div className="border-t border-gray-400 mt-4 w-[50%]"></div>
            </div>

            <div className="container mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-screen -mt-40">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-red-600" role="status">
                            <span className="visually-hidden pl-10">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {favorites.length === 0 ? (
                            <p className="text-center mt-4">Vous n'avez pas encore de films favoris</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 mt-6">
                                {favorites.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="group relative bg-zinc-900 rounded-lg shadow-lg overflow-hidden"
                                    >
                                        <Link to={`/film/${movie.movie_id}`}>
                                            <img
                                                className="w-full full object-cover transition-transform duration-200 transform group-hover:scale-105"
                                                src={`https://image.tmdb.org/t/p/original${movie.thumbnail}`}
                                                alt={movie.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                        </Link>
                                        <div
                                            className="absolute top-2 right-2 p-1 bg-red-700 rounded-full cursor-pointer"
                                            onClick={() => removeFavorite(movie.movie_id)}
                                        >
                                            <AiOutlineClose className="text-white text-lg" color='white' />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
