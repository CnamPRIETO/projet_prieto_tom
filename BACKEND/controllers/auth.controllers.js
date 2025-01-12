// ./controllers/auth.controllers.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require("../config.js");
const db = require("../models");
const Utilisateurs = db.utilisateurs;

// Fonction pour générer un token
function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Validation des entrées
    const pattern = /^[A-Za-z0-9]{1,20}$/;
    if (!pattern.test(username) || !pattern.test(password)) {
        return res.status(400).json({ message: 'Format de nom d\'utilisateur ou mot de passe invalide.' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await Utilisateurs.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà existant.' });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await Utilisateurs.create({
            username,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err);
        res.status(500).json({ message: 'Erreur Interne du Serveur.' });
    }
};

// Connexion de l'utilisateur
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Validation des entrées
    const pattern = /^[A-Za-z0-9]{1,20}$/;
    if (!pattern.test(username) || !pattern.test(password)) {
        return res.status(400).json({ message: 'Format de nom d\'utilisateur ou mot de passe invalide.' });
    }

    try {
        // Trouver l'utilisateur
        const user = await Utilisateurs.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect.' });
        }

        // Générer le token
        const token = generateAccessToken({ id: user.id, username: user.username });
        res.json({ token });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ message: 'Erreur Interne du Serveur.' });
    }
};

// Mise à jour des informations utilisateur
exports.updateUser = async (req, res) => {
    const { oldPassword, username, password } = req.body;
    const userId = req.token.payload.id;

    try {
        // Trouver l'utilisateur
        const user = await Utilisateurs.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifier l'ancien mot de passe si fourni
        if (oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
            }
        }

        // Mettre à jour le nom d'utilisateur si fourni
        if (username) {
            // Vérifier si le nouvel nom d'utilisateur est déjà pris
            const existingUser = await Utilisateurs.findOne({ where: { username } });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris.' });
            }
            user.username = username;
        }

        // Mettre à jour le mot de passe si fourni
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        // Sauvegarder les modifications
        await user.save();

        res.json({ message: 'Utilisateur mis à jour avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
        res.status(500).json({ message: 'Erreur Interne du Serveur.' });
    }
};

// Suppression de l'utilisateur
exports.deleteUser = async (req, res) => {
    const userId = req.token.payload.id;

    try {
        const user = await Utilisateurs.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        await user.destroy();

        res.json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', err);
        res.status(500).json({ message: 'Erreur Interne du Serveur.' });
    }
};
