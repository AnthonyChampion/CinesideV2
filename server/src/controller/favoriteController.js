const favoriteService = require('../services/favoriteService');

const getFavoritesByUserId = async (req, res) => {
    const userId = req.user.id;
    try {
        const favorites = await favoriteService.getFavoritesByUserId(userId);
        res.json(favorites);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const addFavorite = async (req, res) => {
    const userId = req.user.id;
    const { movie_id, title, thumbnail } = req.body;
    console.log(userId);
    console.log({ movie_id });
    try {
        const newFavorite = await favoriteService.addFavorite({ user_id: userId, movie_id, title, thumbnail });
        res.status(201).json(newFavorite);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteFavorite = async (req, res) => {
    const userId = req.user.id;
    const { movie_id } = req.params;
    try {
        const deletedFavorite = await favoriteService.deleteFavorite(movie_id, userId);
        if (deletedFavorite.affected === 1) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Favorite not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getFavoritesByUserId,
    addFavorite,
    deleteFavorite,
};
