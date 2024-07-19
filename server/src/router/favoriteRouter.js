const express = require('express');
const router = express.Router();
const favoriteController = require('../controller/favoriteController');

router.get('/', favoriteController.getFavoritesByUserId);
router.post('/', favoriteController.addFavorite);
router.delete('/:movie_id', favoriteController.deleteFavorite);

module.exports = router;
