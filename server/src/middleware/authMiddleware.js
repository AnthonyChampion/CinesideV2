const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

// Le middleware intercepte la requête pour vérifier la validité du token et grace au payload récupère les information du user ayant envoyé la requête.

const authMiddleware = async (req, res, next) => {
    // on récupère le heager de la requête
    const authHeader = req.headers['authorization'];
    console.log("authHeader : ", authHeader)
    // On récupère le token contenu dans le header
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Token Required' });
    }

    try {

        // On vérifie la validité du token grace a la clé secrète
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // si le token est valide, on récupère le mail contenu dans le payload
        const email = decoded.email;
        // grace au mail récupéré, on récupère les information du user
        user = await userService.getUserByEmail(email);
        console.log("autheur de la requête: ", user)
        if (user) {
            req.user = user;
        }
        // on ajoute dans la requête l'information du user
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid Access Token' });
    }
};

module.exports = authMiddleware;
