const favoriteService = require('../services/favoriteService');

const getFavoritesByUserId = async (req, res) => {
    try {
        const favorites = await favoriteService.getFavoritesByUserId(req.user.id);
        res.json(favorites);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const addFavorite = async (req, res) => {

    const favorite = {
        user_id: req.user.id,
        movie_id: req.body.movie_id,
        title: req.body.title,
        thumbnail: req.body.thumbnail
    }

    try {
        const newFavorite = await favoriteService.addFavorite(favorite);
        res.status(201).json(newFavorite);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteFavorite = async (req, res) => {
    //req.body = ce qu'on envoie en paramètre ex: dans un post
    // req.params = passage d'un paramètre dans l'url (localhost://favorites/1234)
    //içi le req.params = movie_id
    try {
        const deletedFavorite = await favoriteService.deleteFavorite(req.params, req.user.id);
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
