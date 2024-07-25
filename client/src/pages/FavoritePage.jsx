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
        <section className="p-6 dark:text-white text-[#101522] w-screen min-h-screen dark:bg-[#18181b] bg-white">
            <nav className="flex -mt-2" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <Link to="/" className="inline-flex items-center">
                        <p className="inline-flex items-center text-sm font-medium text-black hover:text-cyan-700 dark:text-gray-400 dark:hover:text-white">
                            <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            Accueil
                        </p>
                    </Link>
                    <Link to="/favoris">
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 dark:text-gray-400 text-black mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <p className="ms-1 text-sm font-medium hover:text-cyan-700 md:ms-2 dark:text-gray-400 text-black dark:hover:text-white">Favoris</p>
                        </div>
                    </Link>
                </ol>
            </nav>
            <div className="flex flex-col justify-center items-center mt-4 md:mt-0">
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
