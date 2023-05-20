'use strict';
const {
    Sequelize,
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Carts extends Model {
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

            this.belongsTo(models.Products, {
                targetKey: "productsId",
                foreignKey: "productsId"
            })
        }
    }
    Carts.init({
        cartsId: {
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
        productsId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: "Products",
                key: "productsId"
            }
        },
        productAmount: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.fn("now")
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.fn("now")
        }
    }, {
        sequelize,
        modelName: 'Carts',
    });
    return Carts;
};