import axios from "axios";

const apiKey = `${import.meta.env.VITE_API_KEY}`;

const trendingMoviesEndpoint = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
const upcomingMoviesEndpoint = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`;
const topRatedMoviesEndpoint = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
const genresOfMovies = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
const popularMovies = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
const searchMoviesEndPoint = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}`

const movieDetailsEndpoint = movieId => `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
const movieCreditsEndpoint = movieId => `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;
const similarMoviesEndpoint = movieId => `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}`;
const movieTrailer = movieId => `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
const watchProviders = movieId => `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`;
const personDetails = personId => `https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}`;
const personMoviesEndpoint = personId => `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${apiKey}`

const apiCall = async (endpoint, params) => {
    const options = {
        method: "GET",
        url: endpoint,
        params: params ? params : { language: 'fr-FR', page: '' }
    }

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log("error: ", error);
        return {}
    }
}

export const fetchTrendingMovies = (page = 1) => {
    return apiCall(trendingMoviesEndpoint, { language: "fr-FR", page: `${page}` });
}
export const fetchUpcommingMovies = () => {
    return apiCall(upcomingMoviesEndpoint, { language: "fr-FR" });
}
export const fetchGenresOfMovies = () => {
    return apiCall(genresOfMovies, { language: "fr-FR" });
}
export const fetchTopRatedMovies = (page = 1) => {
    if (page <= 0) page = 1;
    return apiCall(topRatedMoviesEndpoint, { language: "fr-FR", page: `${page}` });
}
export const fetchMoviesByGenre = (page = 1) => {
    return apiCall(popularMovies, { language: "fr-FR", page: `${page}` });
}
export const fetchMovieDetails = id => {
    return apiCall(movieDetailsEndpoint(id));
}
export const fetchMovieCredits = id => {
    return apiCall(movieCreditsEndpoint(id));
}
export const fetchSimilarMovies = id => {
    return apiCall(similarMoviesEndpoint(id));
}
export const searchMovies = params => {
    const updatedParams = { ...params, language: 'fr' };
    return apiCall(searchMoviesEndPoint, updatedParams);
};
export const fetchMovieTrailer = async (movieId) => {
    return apiCall(movieTrailer(movieId));
};
export const fetchWatchProviders = async (movieId) => {
    return apiCall(watchProviders(movieId));
}
export const fetchPersonDetails = async (personId) => {
    return apiCall(personDetails(personId));
}
export const fetchPersonMovies = async (personId) => {
    return apiCall(personMoviesEndpoint(personId));
}