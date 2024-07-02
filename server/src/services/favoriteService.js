const AppDataSource = require('../lib/datasource');
const Favorite = require('../entities/favorite');


const favoriteRepository = AppDataSource.getRepository(Favorite);

const getAllFavorites = async () => {
    return await favoriteRepository.find();
};

const getFavoriteByMovieId = async (movie_id) => {
    return await favoriteRepository.findOneBy({ movie_id });
};

const getFavoritesByUserId = async (user_id) => {
    return await favoriteRepository.findBy({ user_id });
};

const createFavorite = async (favoriteData) => {
    const favorite = favoriteRepository.create(favoriteData);
    return await favoriteRepository.save(favorite);
};

const updateFavorite = async (movie_id, favoriteData) => {
    await favoriteRepository.update({ movie_id }, favoriteData);
    return await favoriteRepository.findOneBy({ movie_id });
};

const deleteFavorite = async (movie_id) => {
    return await favoriteRepository.delete({ movie_id });
};

module.exports = {
    getAllFavorites,
    getFavoriteByMovieId,
    getFavoritesByUserId,
    createFavorite,
    updateFavorite,
    deleteFavorite,
};
