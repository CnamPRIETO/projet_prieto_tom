const { checkJwt}  = require('./jwtMiddleware.js');

module.exports = app => {
    const catalogue = require("../controllers/produits.controllers.js");
  
    let router = require("express").Router();
  

   
    router.get("/",checkJwt,catalogue.getProduits);
  
    app.use('/api/produits', router);
  };