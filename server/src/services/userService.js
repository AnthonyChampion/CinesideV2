const AppDataSource = require('../lib/datasource');
const User = require('../entities/user');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// On récupère le
const userRepository = AppDataSource.getRepository(User);

const getAllUsers = async () => {
    return await userRepository.find();
};

const getUserById = async (id) => {
    return await userRepository.findOneBy({ id });
};

const getUserByEmail = async (email) => {
    return await userRepository.findOneBy({ email });
};

const createUser = async (userData) => {
    const hashedPassword = await argon2.hash(userData.password);
    const user = userRepository.create({ ...userData, password: hashedPassword });
    return await userRepository.save(user);
};

const updateUser = async (id, userData) => {
    if (userData.password) {
        userData.password = await argon2.hash(userData.password);
    }
    await userRepository.update(id, userData);
    return await userRepository.findOneBy({ id });
};

const deleteUser = async (id) => {
    return await userRepository.delete(id);
};

const authenticate = async (credentials) => {
    const { email, password } = credentials;

    // Rechercher si l'utilisateur existe dans la base de données
    const user = getUserByEmail(email);
    if (!user) {
        return null;
    }

    // vérifier que le mot de passe est valide

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
        return null;
    }
    else {
        // Creer un token
        const token = jwt.sign(
            {
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '24h' // faire correspondre à la durée de validité de la session
            }
        )
        console.log("token : ", token)
    }
    return { user, token };
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    authenticate
};
