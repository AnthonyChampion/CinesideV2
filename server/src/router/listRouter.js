const express = require('express');
const router = express.Router();
const listController = require('../controller/listController');

router.get('/', listController.getListsByUserId);
router.post('/', listController.addList);
router.delete('/:id', listController.deleteList);

module.exports = router;