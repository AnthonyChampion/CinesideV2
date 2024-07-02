import { useEffect, useState, useCallback } from 'react';
import {
    fetchMovieCredits,
    fetchSimilarMovies,
    fetchMovieTrailer,
    fetchWatchProviders,
} from '../utils/moviedb';

const useMovieData = (movieId) => {
    const [credits, setCredits] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [trailer, setTrailer] = useState([]);
    const [watchProviders, setWatchProviders] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateCredits = useCallback(async (movieId) => {
        try {
            const creditsData = await fetchMovieCredits(movieId);
            setCredits(creditsData.cast);
            console.log(credits)
        } catch (error) {
            setError('Erreur dans la récupération des crédits');
        }
    }, []);

    const updateSimilarMovies = useCallback(async (movieId) => {
        try {
            const similarMoviesData = await fetchSimilarMovies(movieId);
            setSimilarMovies(similarMoviesData.results);
        } catch (error) {
            setError('Erreur dans la récupération des films similaires');
        }
    }, []);

    const updateTrailer = useCallback(async (movieId) => {
        try {
            const trailerData = await fetchMovieTrailer(movieId);
            setTrailer(trailerData.results);
        } catch (error) {
            setError('Erreur dans la récupération de la bande-annonce');
        }
    }, []);

    const updateWatchProviders = useCallback(async (movieId) => {
        try {
            const watchProvidersData = await fetchWatchProviders(movieId);
            setWatchProviders(watchProvidersData.results?.FR || {});
        } catch (error) {
            setError('Erreur dans la récupération des fournisseurs de contenu');
        }
    }, []);

    const updateAllMovieData = useCallback(async (movieId) => {
        setLoading(true);
        try {
            await Promise.all([
                updateCredits(movieId),
                updateSimilarMovies(movieId),
                updateTrailer(movieId),
                updateWatchProviders(movieId)
            ]);
            setLoading(false);
        } catch (error) {
            setError('Erreur dans la récupération des informations du film');
            setLoading(false);
        }
    }, [updateCredits, updateSimilarMovies, updateTrailer, updateWatchProviders]);

    useEffect(() => {
        if (movieId) {
            updateAllMovieData(movieId);
        }
    }, [movieId, updateAllMovieData]);

    return { credits, similarMovies, trailer, watchProviders, loading, error, updateAllMovieData };
};

export default useMovieData;
