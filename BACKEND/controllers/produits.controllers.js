const db = require("../models");
const Produits = db.produits;
const { Op } = require("sequelize"); 

// Récupérer tous les produits avec filtres optionnels et pagination
exports.getProduits = async (req, res) => {
    try {
        const { ref, description, prix, page, limit } = req.query;

        console.log("Paramètres de recherche reçus:", { ref, description, prix, page, limit });

        // Construire un objet de filtre pour Sequelize
        const whereClause = {};

        if (ref) {
            whereClause.ref = { [Op.iLike]: `%${ref}%` }; 
        }

        if (description) {
            whereClause.description = { [Op.iLike]: `%${description}%` };
        }

        if (prix) {
            const prixNumber = parseFloat(prix);
            if (isNaN(prixNumber)) {
                console.log("Prix invalide:", prix);
                return res.status(400).json({ error: 'Le prix doit être un nombre.' });
            }
            whereClause.prix = { [Op.lte]: prixNumber }; 
        }

        console.log("Clause WHERE construite:", whereClause);

        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;

        console.log(`Page: ${pageNumber}, Limit: ${limitNumber}, Offset: ${offset}`);

        const produits = await Produits.findAndCountAll({
            where: whereClause,
            limit: limitNumber,
            offset: offset
        });

        console.log(`Produits trouvés: ${produits.rows.length} sur ${produits.count}`);

        res.json(produits.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des produits:', err);
        res.status(500).json({ error: 'Erreur Interne du Serveur' });
    }
};
