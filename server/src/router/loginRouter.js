const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Le router redirige la requête vers le bon controller en fonction du type de la requete (get/post/put/delete) et du format de l'URL

// Routes
router.post('/', userController.login);

module.exports = router;