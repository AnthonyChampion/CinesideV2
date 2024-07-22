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
        <section className="p-6 dark:text-white text-[#101522] w-screen min-h-screen dark:bg-[#101522] bg-white">
            <div className="flex flex-col justify-center items-center">
                <h1 className="md:text-3xl text-xl dark:text-white text-[#101522] font-bold text-center">Films favoris</h1>
                <div className="border-t border-gray-300 mt-4 w-[50%]"></div>
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
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2 mt-6">
                                {favorites.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="group flex flex-col items-center bg-transparent mt-4 mb-6 shadow-lg"
                                    >
                                        <Link to={`/film/${movie.movie_id}`}>
                                            <div className="relative">
                                                <img
                                                    className="w-full md:h-[270px] h-[250px] object-cover"
                                                    src={`https://image.tmdb.org/t/p/original${movie.thumbnail}`}
                                                    alt={movie.title}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "../src/assets/img_not_available.png";
                                                    }}
                                                />
                                            </div>
                                        </Link>
                                        <div className="mt-2 text-center">
                                            <h2 className="text-sm font-bold line-clamp-1 dark:text-white text-[#101522]">{movie.title}</h2>
                                        </div>
                                        <Button className="mt-2 bg-gray-700 hover:bg-red-500 mb-2"
                                            onClick={() => removeFavorite(movie.movie_id)}>
                                            Supprimer
                                        </Button>
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
