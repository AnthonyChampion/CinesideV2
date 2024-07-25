const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const userRouter = require('./router/userRouter');
const loginRouter = require('./router/loginRouter');
const favoriteRouter = require("./router/favoriteRouter");
const registerRouter = require("./router/registerRouter");
const authMiddleware = require('./middleware/authMiddleware');


require('dotenv').config();


const app = express();


app.use(bodyParser.json());

app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
}));


app.use('/login', loginRouter);
app.use('/users', authMiddleware, userRouter);
app.use("/favorites", authMiddleware, favoriteRouter);
app.use('/register', registerRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
