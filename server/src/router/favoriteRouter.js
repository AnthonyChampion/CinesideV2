const express = require('express');
const router = express.Router();
const favoriteController = require('../controller/favoriteController');

router.get('/', favoriteController.getAllFavorites);
router.get('/:movie_id', favoriteController.getFavoriteById);
router.get('/user/:user_id', favoriteController.getFavoritesByUserId);
router.post('/', favoriteController.createFavorite);
router.put('/:movie_id', favoriteController.updateFavorite);
router.delete('/:movie_id', favoriteController.deleteFavorite);

module.exports = router;
