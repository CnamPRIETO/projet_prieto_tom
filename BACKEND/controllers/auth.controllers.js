const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require("../config.js");
const db = require("../models");
const Utilisateurs = db.utilisateurs;

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
    const { 
      username, 
      password,
      firstname,
      lastname,
      email,
      address,
      phone 
    } = req.body;

    // Exemple simple de vérification
    const pattern = /^[A-Za-z0-9]{1,20}$/;
    if (!pattern.test(username) || !pattern.test(password)) {
        return res.status(400).json({ message: 'Format de nom d\'utilisateur ou mot de passe invalide.' });
    }

    try {
        const existingUser = await Utilisateurs.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà existant.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Utilisateurs.create({
            username,
            password: hashedPassword,
            firstname,
            lastname,
            email,
            address,
            phone
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err);
        res.status(500).json({ message: 'Erreur Interne du Serveur.' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const pattern = /^[A-Za-z0-9]{1,20}$/;
    if (!pattern.test(username) || !pattern.test(password)) {
        return res.status(400).json({ message: 'Format de nom d\'utilisateur ou mot de passe invalide.' });
    }

    try {
        const user = await Utilisateurs.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect.' });
        }

        const token = generateAccessToken({ id: user.id, username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email, address: user.address, phone: user.phone });
        res.json({ token });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ message: 'Erreur Interne du Serveur.' });
    }
};

exports.updateUser = async (req, res) => {
    const {
      oldPassword,
      password,    // nouveau mot de passe
      username,
      firstname,
      lastname,
      email,
      address,
      phone
    } = req.body;
  
    const userId = req.token.payload.id;  // ID depuis le token
    try {
      const user = await Utilisateurs.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }
  
      // S’il y a un oldPassword, on vérifie qu’il match le password actuel
      if (oldPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
        }
      }
  
      // Mise à jour du nouveau password
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      // Mise à jour des autres champs
      if (username)  user.username  = username;
      if (firstname) user.firstname = firstname;
      if (lastname)  user.lastname  = lastname;
      if (email)     user.email     = email;
      if (address)   user.address   = address;
      if (phone)     user.phone     = phone;
      
      await user.save();
  
      return res.json({ message: 'Utilisateur mis à jour avec succès.' });
    } catch (err) {
      console.error('Erreur lors de la mise à jour :', err);
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

exports.getProfile = async (req, res) => {
    const userId = req.token.payload.id; // id récupéré depuis le token
    try {
        // Récupération de l'utilisateur
        const user = await Utilisateurs.findByPk(userId, {
            attributes: [
                'id',
                'username',
                'firstname',
                'lastname',
                'email',
                'address',
                'phone'
            ]
        });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        // On renvoie les infos de l'utilisateur
        res.json(user);
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', err);
        res.status(500).json({ message: 'Erreur Interne du Serveur.' });
    }
};
