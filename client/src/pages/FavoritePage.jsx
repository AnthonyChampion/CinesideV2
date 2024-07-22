import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import axios from 'axios';

export default function Favorite() {
    const [favorites, setFavorites] = useState([]);
    const [movieList, setMovieList] = useState([]);
    const [newListName, setNewListName] = useState('');
    const [newListDescription, setNewListDescription] = useState('');
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);

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

    useEffect(() => {
        const fetchMovieLists = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/movie_lists/`);
                setMovieList(response.data);
                console.log("list : ", response.data);
            } catch (error) {
                console.error('Error fetching movie lists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieLists();
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

    const createNewMovieList = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/movie_list/`, {
                name: newListName,
                description: newListDescription,
            });
            setMovieList([...movieList, response.data]);
            setNewListName('');
            setNewListDescription('');
            setSelectedMovies([]);
            setModalIsOpen(false);
        } catch (error) {
            console.error('Error creating new movie list:', error);
        }
    };

    const toggleMovieSelection = (movieId) => {
        if (selectedMovies.includes(movieId)) {
            setSelectedMovies(selectedMovies.filter(id => id !== movieId));
        } else {
            setSelectedMovies([...selectedMovies, movieId]);
        }
    };

    return (
        <section className="p-6 text-white w-screen min-h-screen bg-[#101522]">
            <div className="flex col-span-full justify-center">
                <h1 className="md:text-3xl text-xl text-white font-bold text-center">Films favoris</h1>
            </div>
            <div className="container mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <>

                        <div className="flex justify-center mt-4">
                            <Button className="bg-gray-700 hover:bg-green-500" onClick={() => setModalIsOpen(true)}>
                                Créer une nouvelle liste
                            </Button>
                        </div>
                        <div className="mt-6">
                            <h2 className="text-2xl text-white font-bold mb-4">Listes enregistrées</h2>
                            {movieList.length === 0 ? (
                                <p className="text-center">Vous n'avez pas encore de liste créees</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {movieList.map(list => (
                                        <div key={list.id} className="bg-gray-800 p-4 rounded-lg">
                                            <h3 className="text-xl font-bold text-white">{list.name}</h3>
                                            <p className="text-gray-400">{list.description}</p>
                                            <ul className="mt-2">
                                                {list.movies.map(movieId => {
                                                    const movie = favorites.find(m => m.movie_id === movieId);
                                                    return movie ? (
                                                        <li key={movieId} className="text-gray-300">{movie.title}</li>
                                                    ) : null;
                                                })}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {modalIsOpen && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-lg w-1/2 h-[90%] overflow-auto">
                                    <h2 className="text-2xl mb-4 text-black">Créer une nouvelle liste</h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        createNewMovieList();
                                    }}>
                                        <div className="mb-4">
                                            <label className="block text-black mb-2">Nom</label>
                                            <input
                                                type="text"
                                                value={newListName}
                                                onChange={(e) => setNewListName(e.target.value)}
                                                className="p-2 rounded-md text-black w-full"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-black mb-2">Description</label>
                                            <textarea
                                                value={newListDescription}
                                                onChange={(e) => setNewListDescription(e.target.value)}
                                                className="p-2 rounded-md text-black w-full"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-black mb-2">Ajouter des films</label>
                                            {favorites.map((movie) => (
                                                <div key={movie.id} className="flex items-center mb-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`movie-${movie.id}`}
                                                        checked={selectedMovies.includes(movie.movie_id)}
                                                        onChange={() => toggleMovieSelection(movie.movie_id)}
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor={`movie-${movie.id}`} className="text-black">{movie.title}</label>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="button" className="mr-2 bg-gray-700 hover:bg-red-500" onClick={() => setModalIsOpen(false)}>
                                                Annuler
                                            </Button>
                                            <Button type="submit" className="bg-gray-700 hover:bg-green-500">
                                                Create
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {favorites.length === 0 ? (
                            <p className="text-center mt-4">Vous n'avez pas encore de films favoris</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 mt-6">

                                {favorites.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="group flex flex-col items-center bg-transparent mt-4 mb-6"
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
                                            <h2 className="text-sm font-bold line-clamp-1 text-white">{movie.title}</h2>
                                        </div>
                                        <Button className="mt-2 bg-gray-700 hover:bg-red-500"
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
