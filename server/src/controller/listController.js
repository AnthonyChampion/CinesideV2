const listService = require('../services/listService');

const getListsByUserId = async (req, res) => {
    try {
        const lists = await listService.getListsByUserId(req.user.id);
        res.json(lists);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const addList = async (req, res) => {
    // on creer un objet list a envoyer au service
    const list = {
        user_id: req.user.id,
        movie_id: req.body.movie_id,
        name: req.body.name,
        description: req.body.description
    }

    try {
        const newList = await listService.addList(list);
        res.status(201).json(newList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteList = async (req, res) => {

    try {
        const deletedList = await listService.deleteList(req.params, req.user.id);
        if (deletedList.affected === 1) {
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
    getListsByUserId,
    addList,
    deleteList,
};
