const userService = require('../services/userService');

// le router redirige la requète vers une des méthode du controller qui va lui même appeler le service pour intéragir avec la base de données.
// c'est le controller qui va envoyer la réponse au client. 
// req = requète (grace au middleware, chaque requête contien également les informations du user qui a envoyé la requète req.user)
// res = réponse

const login = async (req, res) => {
    try {
        const login = await loginService.login();
        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    login
};
