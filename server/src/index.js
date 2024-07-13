const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const userRouter = require('./router/userRouter');
const loginRouter = require('./router/loginRouter');
const favoriteRouter = require("./router/favoriteRouter");
const authMiddleware = require('./middleware/authMiddleware');

// On charge les variables d'environnements
require('dotenv').config();

// On Instancie le serveur express
const app = express();

// On le configure pour qu'il utilise le format json
app.use(bodyParser.json());

app.use(cors({ origin: [process.env.PORT], credentials: true }));

// On redirige la requête vers le router (en passant avant par le middleware)
app.use('/login', loginRouter);
app.use('/users', authMiddleware, userRouter);
app.use("/favorites", authMiddleware, favoriteRouter);

// On ecoute que le serveur est bien lancé sur lon bon port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
