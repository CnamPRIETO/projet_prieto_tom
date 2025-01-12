// ./models/utilisateurs.model.js
module.exports = (sequelize, Sequelize) => {
    const Utilisateurs = sequelize.define("utilisateurs", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Utilisateurs;
};
