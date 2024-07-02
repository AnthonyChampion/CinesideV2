const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Le router redirige la requête vers le bon controller en fonction du type de la requete (get/post/put/delete) et du format de l'URL
// la route est {baseURL}/users/

// Routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
