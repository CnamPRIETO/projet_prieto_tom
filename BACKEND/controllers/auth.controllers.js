const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { ACCESS_TOKEN_SECRET } = require("../config.js");

// Stockage des utilisateurs en mémoire (à remplacer par une base de données en production)
const users = [];

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

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Utilisateur déjà existant.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { id: uuidv4(), username, password: hashedPassword };
        users.push(user);
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

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect.' });
        }

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
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    try {
        if (oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
            }
        }

        if (username) {
            // Vérifier si le nouveau nom d'utilisateur est déjà pris
            const existingUser = users.find(u => u.username === username);
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris.' });
            }
            user.username = username;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        res.json({ message: 'Utilisateur mis à jour avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
        res.status(500).json({ message: 'Erreur Interne du Serveur.' });
    }
};

// Suppression de l'utilisateur
exports.deleteUser = (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    users.splice(userIndex, 1);

    return res.json({ message: 'Utilisateur supprimé avec succès.' });
};
