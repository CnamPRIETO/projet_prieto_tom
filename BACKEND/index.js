const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
const corsOptions = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  headers: 'Content-Type, Authorization',
  exposedHeaders:'Authorization'
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


require('./routes/produits.routes.js')(app);
require('./routes/auth.routes.js')(app);

// Démarrer le serveur
const PORT = process.env.PORT || 443;
app.listen(PORT, () => {
    console.log(`Serveur API en cours d'exécution à http://localhost:${PORT}`);
});
