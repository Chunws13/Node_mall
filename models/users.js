'use strict';
const {
    Sequelize,
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Products, {
                sourceKey: "userId",
                foreginKey: "userId"
            })

            this.hasMany(models.Carts, {
                sourceKey: "userId",
                foreignKey: "userId"
            })
        }
    }
    Users.init({
        userId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        userName: {
            allowNull: false,
            type: Sequelize.STRING
        },
        userType: {
            allowNull: false,
            type: Sequelize.STRING
        },
        password: {
            allowNull: false,
            type: Sequelize.STRING
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
        modelName: 'Users',
    });
    return Users;
};