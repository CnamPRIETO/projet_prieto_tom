const { checkJwt } = require('./jwtMiddleware.js');

module.exports = app => {
    const auth = require("../controllers/auth.controllers.js");
  
    let router = require("express").Router();
  
    // Route d'inscription
    router.post("/register", auth.register);
  
    // Route de connexion
    router.post("/login", auth.login);
  
    // Route de mise à jour des informations utilisateur
    router.put("/user", checkJwt, auth.updateUser);
  
    // Route de suppression de l'utilisateur
    router.delete("/user", checkJwt, auth.deleteUser);
  
    app.use('/api/auth', router);
};
