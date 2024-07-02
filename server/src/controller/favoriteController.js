const favoriteService = require('../services/favoriteService');

const getAllFavorites = async (req, res) => {
    try {
        const favorites = await favoriteService.getAllFavorites();
        res.json(favorites);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getFavoriteById = async (req, res) => {
    try {
        const favorite = await favoriteService.getFavoriteById(req.params.movie_id);
        if (favorite) {
            res.json(favorite);
        } else {
            res.status(404).json({ message: 'Favorite not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getFavoritesByUserId = async (req, res) => {
    try {
        const favorites = await favoriteService.getFavoritesByUserId(req.params.user_id);
        if (favorites.length > 0) {
            res.json(favorites);
        } else {
            res.status(404).json({ message: 'No favorites found for this user' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createFavorite = async (req, res) => {
    try {
        const newFavorite = await favoriteService.createFavorite(req.body);
        res.status(201).json(newFavorite);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateFavorite = async (req, res) => {
    try {
        const updatedFavorite = await favoriteService.updateFavorite(req.params.movie_id, req.body);
        if (updatedFavorite) {
            res.json(updatedFavorite);
        } else {
            res.status(404).json({ message: 'Favorite not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteFavorite = async (req, res) => {
    try {
        const deletedFavorite = await favoriteService.deleteFavorite(req.params.movie_id);
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
    getAllFavorites,
    getFavoriteById,
    getFavoritesByUserId,
    createFavorite,
    updateFavorite,
    deleteFavorite,
};
