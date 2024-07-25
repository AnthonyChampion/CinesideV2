const AppDataSource = require('../lib/datasource');
const Favorite = require('../entities/favorite');


const favoriteRepository = AppDataSource.getRepository(Favorite);

const getFavoritesByUserId = async (user_id) => {
    return await favoriteRepository.find({ where: { user_id } });
};

const addFavorite = async (favoriteData) => {

    const favorite = favoriteRepository.create(favoriteData);
    return await favoriteRepository.save(favorite);
};

const deleteFavorite = async (favoriteData) => {
    return await favoriteRepository.delete(favoriteData);
};

module.exports = {
    getFavoritesByUserId,
    addFavorite,
    deleteFavorite,
};
