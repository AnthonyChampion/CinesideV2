const AppDataSource = require('../lib/datasource');
const Login = require('../entities/login');
const argon2 = require('argon2');

const loginRepository = AppDataSource.getRepository(Login);

const authenticate = async () => {
    return await loginRepository.find();
};


module.exports = {
    authenticate,
};
