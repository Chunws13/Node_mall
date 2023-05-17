'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
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
                },
                onDelete: "CASCADE"
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
                unique: true,
                allowNull: false,
                type: Sequelize.STRING
            },
            productPrice: {
                allowNull: false,
                type: Sequelize.INTEGER,
                defaultValue: 1000
            },
            hits: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn("now")
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn("now")
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Productes');
    }
};