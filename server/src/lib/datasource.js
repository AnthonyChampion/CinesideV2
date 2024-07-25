const { DataSource } = require('typeorm');
const User = require('../entities/user');
const Favorite = require("../entities/favorite");

//On charge les variables d'environnement
require('dotenv').config();

// On configure la connexion à la base de données en y ajoutant les entitées
const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Favorite],
    migrations: [],
    subscribers: [],
});

// On initialise la base de données en utilisant les entités précédement configurées
AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

module.exports = AppDataSource;
