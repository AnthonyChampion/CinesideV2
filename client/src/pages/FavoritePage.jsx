import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function Favorite() {

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const removeFavorite = (movieId) => {
        const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };


    return (
        <section className="p-6 text-white w-screen h-screen bg-[#101522]">
            {favorites.length === 0 ? (
                <p className="text-center mt-4">Vous n'avez pas encore de films favoris</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-6">
                    <div className="flex col-span-2 md:col-span-2 items-center justify-center">
                        <div className="flex-col">
                            <h1 className="md:text-3xl text-xl text-white font-bold text-center">Films favoris</h1>
                            <div className="border-t border-gray-300 mt-4"></div>
                        </div>
                    </div>

                    {favorites.map((data) => (
                        <div
                            key={data.id}
                            className="group w-[80%] flex flex-col cursor-pointer bg-transparent p-3 mt-4 md:mt-0"

                        >
                            <Link to={`/film/${data.id}`}>
                                <div className="relative">
                                    <img
                                        className="w-full md:h-[300px] h-[250px] object-contain"
                                        src={"https://image.tmdb.org/t/p/original" + data.poster_path}
                                        alt={data.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "../src/assets/img_not_available.png";
                                        }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-400">{data.release_date}</p>
                                    <h2 className="text-md font-bold line-clamp-1 text-white">{data.title}</h2>
                                </div>
                            </Link>
                            <Button
                                onClick={() => removeFavorite(data.id)}>
                                Supprimer
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}


