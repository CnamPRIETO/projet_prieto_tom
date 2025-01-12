const fs = require('fs');
const path = require('path');

exports.getProduits = (req, res) => {
    const filePath = path.join(__dirname, '..', 'data', 'produits.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture de produits.json:', err);
            return res.status(500).json({ error: 'Erreur Interne du Serveur' });
        }
        try {
            const produits = JSON.parse(data);
            res.json(produits);
        } catch (parseErr) {
            console.error('Erreur lors du parsing de produits.json:', parseErr);
            res.status(500).json({ error: 'Erreur Interne du Serveur' });
        }
    });
};
