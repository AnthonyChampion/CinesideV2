import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import axios from 'axios';

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
        <section className="p-6 dark:text-white text-[#101522] w-screen min-h-screen dark:bg-[#0a0a0b] bg-white">
            <div className="relative flex flex-col  justify-center items-center mt-4 md:mt-0">
                <h1 className="md:text-3xl text-xl dark:text-white text-[#101522] font-bold text-center">Mes films favoris</h1>
                <span className="mt-1">Total: {favorites.length} films</span>
                <div className="border-t border-gray-400 mt-4 w-[50%]"></div>
            </div>

            <div className="container mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div>Chargement....</div>
                    </div>
                ) : (
                    <>
                        {favorites.length === 0 ? (
                            <p className="text-center mt-4">Vous n'avez pas encore de films favoris</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-6">
                                {favorites.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="group relative bg-zinc-800 rounded-lg shadow-lg overflow-hidden"
                                    >
                                        <Link to={`/film/${movie.movie_id}`}>
                                            <img
                                                className="w-full md:h-[350px] object-cover transition-transform duration-200 transform group-hover:scale-105"
                                                src={`https://image.tmdb.org/t/p/original${movie.thumbnail}`}
                                                alt={movie.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "../src/assets/img_not_available.png";
                                                }}
                                            />
                                        </Link>
                                        <div className="p-4">
                                            <h2 className="text-md font-bold text-white truncate">{movie.title}</h2>
                                            <Button
                                                className="mt-2 w-full bg-red-500 hover:bg-red-700 text-white"
                                                onClick={() => removeFavorite(movie.movie_id)}
                                            >
                                                Supprimer
                                            </Button>
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
