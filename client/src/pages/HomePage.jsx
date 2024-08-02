import React, { useCallback, useEffect, useState } from 'react';
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies } from '../utils/moviedb';
import { Link } from 'react-router-dom';
import MovieSearch from '../components/MovieSearch';
import { Button } from 'flowbite-react';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules';
import "../styles/swiper.css";
import 'swiper/css';
import 'swiper/css/pagination';


export default function HomePage() {
    const [trending, setTrending] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [toprated, setToprated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [slides, setSlides] = useState(1);

    const setSlidesPerview = useCallback(() => {
        if (window.innerWidth < 640) {
            setSlides(1);
        } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
            setSlides(3);
        } else {
            setSlides(5);
        }
    }, []);

    const getPopularMovies = useCallback(async (page) => {
        setLoading(true);
        try {
            const data = await fetchPopularMovies(page);
            setTrending(data.results);
        } catch (error) {
            console.error('Erreur dans la récupération des films:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTrendingMovies = useCallback(async (page) => {
        setLoading(true);
        try {
            const data = await fetchTrendingMovies(page);
            setUpcoming(data.results);
        } catch (error) {
            console.error('Erreur dans la récupération des films:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTopratedMovies = useCallback(async (page) => {
        setLoading(true);
        try {
            const data = await fetchTopRatedMovies(page);
            setToprated(data.results);
        } catch (error) {
            console.error('Erreur dans la récupération des films:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getPopularMovies(1);
        getTrendingMovies(1);
        getTopratedMovies(1);
        setSlidesPerview();
        const handleResize = () => {
            setSlidesPerview();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [getPopularMovies, getTrendingMovies, getTopratedMovies, setSlidesPerview]);

    return (
        <div className="flex flex-col dark:text-white bg-white dark:bg-transparent z-50">
            <section>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <header className="w-full md:h-[72vh] h-full flex flex-col items-center mt-4 md:mt-8">
                            <div className="relative w-[89.7vw] md:h-13 z-20 md:rounded flex justify-between items-center">
                                <div className="space-x-4 w-full z-20 relative">
                                    <span className="bg-red-600 text-white md:text-lg text-sm font-medium me-2 px-2.5 py-1 rounded">Populaires</span>
                                    <Link to="/film_par_genre">
                                        <span className="md:text-white md:bg-transparent bg-gray-400 text-black  md:text-lg text-sm font-medium me-2 px-2.5 py-1 rounded border border-gray-500">Tous les films</span>
                                    </Link>
                                </div>
                                <div className="hidden md:block z-20 relative">
                                    <MovieSearch />
                                </div>
                            </div>

                            {trending.length > 0 && (
                                <Swiper
                                    modules={[Pagination]}
                                    slidesPerView={slides}
                                    spaceBetween={10}
                                    pagination={{ clickable: true }}
                                    loop={true}
                                    style={{ width: '90%', height: "100%" }}
                                    className="custom-swiper"
                                >
                                    {trending.map((movie) => (
                                        <SwiperSlide key={movie.id}>
                                            <div className="md:w-full p-6 md:p-0 flex-col justify-center h-full md:mt-2 -mt-2">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                                                    alt={movie?.title || "Image du film"}
                                                    className="w-full md:h-[450px]"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/assets/img_not_available.png";
                                                    }}
                                                />
                                                <div className="flex-col p-4 md:space-y-2 dark:text-white text-black">
                                                    <h1 className="text-md uppercase line-clamp-1">{movie?.title || "Title not available"}</h1>
                                                    <p className="text-sm dark:text-gray-400 text-black">{movie?.release_date}</p>
                                                    <div className="absolute top-8 right-8 md:relative md:top-0 md:right-0 md:flex md:justify-end">
                                                        <Link to={`/film/${movie.id}`}>
                                                            <Button className='bg-red-700 border-none transform transition-transform duration-200 hover:scale-110'>Voir détails</Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                            )}
                        </header>
                        <div className="hidden md:flex w-full items-center justify-center dark:bg-[#0a0a0b]">
                            <div className="w-full md:w-[89.5%]">
                                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-400 lg:my-8" />
                                <div className="flex justify-between">
                                    <span className="bg-red-600 text-white md:text-lg text-xs font-medium me-2 px-2.5 py-1 rounded">Sorties récentes</span>
                                    <Link to="/film_par_genre">
                                        <span className="text-white md:text-lg text-xs font-medium me-2 px-2.5 py-1 rounded border border-gray-500">Tous les films</span>
                                    </Link>
                                </div>
                                <div className="flex flex-wrap md:mt-4 mt-2">
                                    {upcoming.slice(0, 5).map((data) => (
                                        <div
                                            key={data.id}
                                            className="group flex flex-col cursor-pointer bg-transparent p-2 mb-2 md:mt-0 shadow-lg w-full md:w-1/5"
                                        >
                                            <div className="relative">
                                                <Link to={`/film/${data.id}`}>
                                                    <img
                                                        className="w-full md:h-[220px] h-[200px] object-cover transition-transform duration-200 transform group-hover:scale-105"
                                                        src={"https://image.tmdb.org/t/p/original" + data.backdrop_path}
                                                        alt={data.title}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/assets/img_not_available.png";
                                                        }}
                                                    />
                                                </Link>
                                            </div>
                                            <div className="p-4 space-y-1 text-center">
                                                <h2 className="text-md line-clamp-1 dark:text-white text-black uppercase">{data.title}</h2>
                                                <p className="text-sm dark:text-gray-400 text-black">{data.release_date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-400 lg:my-8" />
                                <div className="flex justify-between">
                                    <span className="bg-red-600 text-white md:text-lg text-xs font-medium me-2 px-2.5 py-1 rounded">Top TMDB</span>
                                    <Link to="/film_par_genre/top_tmdb">
                                        <span className="text-gray-400 md:text-lg text-xs font-medium me-2 px-2.5 py-1 rounded border border-gray-500">Tous les films</span>
                                    </Link>
                                </div>
                                <div className="flex flex-wrap md:mt-4 mt-2">
                                    {toprated.slice(0, 5).map((data) => (
                                        <div
                                            key={data.id}
                                            className="group flex flex-col cursor-pointer bg-transparent p-2 mb-2 md:mt-0 shadow-lg w-full md:w-1/5"
                                        >
                                            <div className="relative">
                                                <Link to={`/film/${data.id}`}>
                                                    <img
                                                        className="w-full md:h-[220px] h-[200px] object-cover transition-transform duration-200 transform group-hover:scale-105"
                                                        src={"https://image.tmdb.org/t/p/original" + data.backdrop_path}
                                                        alt={data.title}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/assets/img_not_available.png";
                                                        }}
                                                    />
                                                </Link>
                                            </div>
                                            <div className="p-4 space-y-1 text-center">
                                                <h2 className="text-md line-clamp-1 dark:text-white text-black uppercase">{data.title}</h2>
                                                <p className="text-sm dark:text-gray-400 text-black">{data.release_date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
