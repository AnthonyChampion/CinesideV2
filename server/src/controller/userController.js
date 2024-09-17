const userService = require('../services/userService');


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
        const response = await userService.createUser(req.body);
        if (!response || !response.user || !response.token) {
            return res.json({ message: "un problème est survenu, contactez l'administrateur", user: null, token: null });
        }
        return res.json({ message: "votre compte à bien été créé", user: response.user, token: response.token });

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

const login = async (req, res) => {
    try {
        const login = await userService.authenticate(req.body);

        if (!login || !login.user || !login.token) {
            return res.json({ message: "La combinaison email/mot de passe n'est pas valide.", user: null, token: null });
        }

        res.json({ message: "Vous êtes connecté " + login.user.name, user: login.user, token: login.token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login
};
