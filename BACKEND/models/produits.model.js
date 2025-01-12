module.exports = (sequelize, Sequelize) => {
    const Produits = sequelize.define("produits", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        ref: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        prix: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        description: { 
            type: Sequelize.TEXT,
            allowNull: false
        },
        stock: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: false
    });

    return Produits;
};
