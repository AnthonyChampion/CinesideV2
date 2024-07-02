const AppDataSource = require('../lib/datasource');
const User = require('../entities/user');
const argon2 = require('argon2');

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

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
};
