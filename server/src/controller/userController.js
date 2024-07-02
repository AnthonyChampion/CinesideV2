const userService = require('../services/userService');

// le router redirige la requète vers une des méthode du controller qui va lui même appeler le service pour intéragir avec la base de données.
// c'est le controller qui va envoyer la réponse au client. 
// req = requète (grace au middleware, chaque requête contien également les informations du user qui a envoyé la requète req.user)
// res = réponse

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateUser = async (req, res) => {
    try {
        if (req.user.id == parseInt(req.params.id) || req.user.isAdmin == true) {
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            return res.json(updatedUser);
        }
        return res.status(403).json({ message: 'Unauthorized' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (req.user.id == parseInt(req.params.id) || req.user.isAdmin == true) {
            await userService.deleteUser(req.params.id);
            return res.status(204).send();
        }
        return res.status(403).json({ message: 'Unauthorized' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
