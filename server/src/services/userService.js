const AppDataSource = require('../lib/datasource');
const User = require('../entities/user');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();


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

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return null;
        }

        const validPassword = await argon2.verify(user.password, password);

        if (!validPassword) {
            return null;
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { user, token };
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
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
