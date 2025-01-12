const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

// Middleware
const corsOptions = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Importer les routes
require('./routes/produits.routes.js')(app);
require('./routes/auth.routes.js')(app);

// Initialiser la base de données
const db = require("./models");

db.sequelize.sync()
    .then(() => {
        console.log("Base de données synchronisée.");
    })
    .catch((err) => {
        console.log("Échec de la synchronisation de la base de données: " + err.message);
    });

// Démarrer le serveur
const PORT = process.env.PORT || 443;
app.listen(PORT, () => {
    console.log(`Serveur API en cours d'exécution à http://localhost:${PORT}`);
});
