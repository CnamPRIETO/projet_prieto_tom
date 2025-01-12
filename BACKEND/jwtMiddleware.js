// ./routes/jwtMiddleware.js
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require("../config.js");

module.exports = {
    checkJwt: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Missing or invalid token' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Missing or invalid token' });
        }

        try {
            const jwtPayload = jwt.verify(token, ACCESS_TOKEN_SECRET, {
                algorithms: ['HS256'],
                clockTolerance: 0,
                ignoreExpiration: false,
                ignoreNotBefore: false
            });

            // Ajout des informations de l'utilisateur à la requête
            req.token = { payload: jwtPayload };
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Missing or invalid token' });
        }

        next();
    }
};
