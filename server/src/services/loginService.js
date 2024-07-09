const AppDataSource = require('../lib/datasource');
const Login = require('../entities/login');
const argon2 = require('argon2');

// On récupère le
const loginRepository = AppDataSource.getRepository(Login);

const login = async () => {
    return await loginRepository.find();
};


module.exports = {
    login,
};
