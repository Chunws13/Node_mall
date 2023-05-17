'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Carts', {
            cartsId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userID: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "Users",
                    key: "userId"
                },
                onDelete: "CASCADE"
            },
            productsId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "Products",
                    key: "productsId"
                },
                onDelete: "CASCADE"
            },
            productAmount: {
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
        await queryInterface.dropTable('Carts');
    }
};