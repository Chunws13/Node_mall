'use strict';
const {
    Sequelize,
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Products extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Users, {
                targetKey: "userId",
                foreignKey: "userId"
            })

            this.hasMany(models.Carts, {
                sourceKey: "productsId",
                targetKey: "productsId"
            })
        }
    }
    Products.init({
        productsId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        userId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: "Users",
                key: "userId"
            }
        },
        productAmount: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        productLink: {
            allowNull: false,
            type: Sequelize.STRING
        },
        productName: {
            allowNull: false,
            type: Sequelize.STRING
        },
        hits: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        createdAt: {
            allowNull: false,
            allowNull: false,
            type: Sequelize.fn("now")
        },
        updatedAt: {
            allowNull: false,
            allowNull: false,
            type: Sequelize.fn("now")
        }
    }, {
        sequelize,
        modelName: 'Products',
    });
    return Products;
};