import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { fetchMovieDetails, fetchTrendingMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import TrailerMovie from "../components/TrailerMovie";
import { TbPlayerPlay } from "react-icons/tb";
import { Button } from 'flowbite-react';

export default function HomePage() {

    const [trending, setTrending] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const topPage = useRef(null);

    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    const getTrendingMovies = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchTrendingMovies();
            setTrending(data.results);
            setIndex(0);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trending movies:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getTrendingMovies();
    }, [getTrendingMovies]);

    const fetchMovieDetailsAndGenres = useCallback(async () => {
        if (trending[index]) {
            try {
                const movieId = trending[index].id;
                const movieDetails = await fetchMovieDetails(movieId);
                const updatedTrending = [...trending];
                updatedTrending[index] = {
                    ...updatedTrending[index],
                    genres: movieDetails.genres
                };
                setTrending(updatedTrending);
            } catch (error) {
                console.error('Error fetching movie details and genres:', error);
            }
        }
    }, [index, trending]);

    useEffect(() => {
        fetchMovieDetailsAndGenres();
    }, [fetchMovieDetailsAndGenres]);

    const handleShowTrailer = useCallback((movieId) => {
        setSelectedMovieId(movieId);
        setShowTrailer(true);
    }, []);

    const handleCloseTrailer = useCallback(() => {
        setShowTrailer(false);
    }, []);

    const topTenMovies = useMemo(() => trending.slice(0, 10), [trending]);

    return (
        <div ref={topPage} className="flex flex-col min-h-screen text-white bg-[#101522]">
            <section className="flex-grow w-screen">
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {trending[index] && (
                            <div className="relative w-screen md:h-[70vh] h-[80vh] overflow-hidden">
                                <img
                                    src={`https://image.tmdb.org/t/p/original${trending[index].backdrop_path}`}
                                    alt={trending[index]?.title || "Movie Image"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "../src/assets/img_not_available.png";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#101522] via-transparent to-black"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#101522] via-transparent to-[#101522]"></div>
                                <div className="absolute inset-0 space-y-2 top-[40vh] md:space-y-4 md:top-[30vh] md:left-14 md:w-2/5 w-full h-fit text-white md:p-6 p-4">
                                    <span className="bg-gray-100 text-gray-800 md:text-lg text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500">A l'affiche</span>
                                    <h1 className="font-bold text-xl md:text-5xl uppercase pt-4">{trending[index]?.title || "Title not available"}</h1>
                                    {trending[index].genres && (
                                        <div className="flex">
                                            {trending[index].genres.reduce((acc, genre, i) => {
                                                if (i === 0) {
                                                    return [...acc, <span key={genre.id} className="md:text-lg text-xs py-1 ">{genre.name}</span>];
                                                }
                                                return [
                                                    ...acc,
                                                    <span key={`dot-${i}`} className="text-md px-2 py-1">•</span>,
                                                    <span key={genre.id} className="md:text-lg text-xs px-2 py-1">{genre.name}</span>
                                                ];
                                            }, [])}
                                        </div>
                                    )}

                                    <p className="md:text-lg text-sm">
                                        {trending[index]?.release_date ? new Date(trending[index].release_date).getFullYear() : "Date de sortie inconnue"}
                                    </p>

                                    <div className="flex space-x-4 pt-2">
                                        <Button
                                            className="text-white border-2 border-white bg-transparent rounded-sm md:text-lg md:py-3 px-2 md:px-6 hover:bg-cyan-700 transition duration-300"
                                            onClick={() => handleShowTrailer(trending[index].id)}
                                        >
                                            <div className="flex space-x-1 items-center">
                                                <TbPlayerPlay />
                                                <p>Bande Annonce</p>
                                            </div>
                                        </Button>
                                        <Link to={`/film/${trending[index].id}`}>
                                            <Button className="text-white rounded-sm md:text-lg py-2 md:py-3 px-4 md:px-6 bg-cyan-700 border-2 border-cyan-700 hover:border-2 hover:border-white hover:text-white transition duration-800">
                                                Plus de détails
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col w-full items-center justify-center md:mt-14">
                            <div className="w-full md:w-[80%]">
                                <div className="grid grid-cols-2 md:grid-cols-6">
                                    <div className="flex col-span-2 md:col-span-2 items-center justify-center">
                                        <div className="flex-col">
                                            <h2 className="md:text-4xl text-xl font-bold text-center">Sorties récentes</h2>
                                            <div className="border-t border-gray-300 md:mt-4"></div>
                                        </div>
                                    </div>

                                    {trending.slice(0, 16).map((data, idx) => (
                                        <div
                                            key={data.id}
                                            className="group flex flex-col cursor-pointer bg-transparent pb-2 mt-4 md:mt-0"
                                            onClick={() => setIndex(idx)}
                                        >
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
                                                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-2 rounded-full">
                                                    {data.vote_average.toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="p-4 space-y-1">
                                                <p className="text-sm text-gray-400">{data.release_date}</p>
                                                <h2 className="text-md font-bold line-clamp-1 text-white">{data.title}</h2>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>
            {showTrailer && <TrailerMovie movieId={selectedMovieId} onClose={handleCloseTrailer} />}
        </div>
    );
}
