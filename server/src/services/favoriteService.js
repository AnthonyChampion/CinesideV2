const AppDataSource = require('../lib/datasource');
const Favorite = require('../entities/favorite');


const favoriteRepository = AppDataSource.getRepository(Favorite);

const getFavoritesByUserId = async (user_id) => {
    return await favoriteRepository.find({ where: { user_id } });
};

const addFavorite = async (movie_id) => {
    const favoriteData = { movie_id };
    console.log("favorisdata", favoriteData);
    const favorite = favoriteRepository.create(favoriteData);
    return await favoriteRepository.save(favorite);
};

const deleteFavorite = async (movie_id, user_id) => {
    return await favoriteRepository.delete({ movie_id, user_id });
};

module.exports = {
    getFavoritesByUserId,
    addFavorite,
    deleteFavorite,
};
