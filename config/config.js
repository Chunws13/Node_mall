require('dotenv').config();
const env = process.env;

const development = {
    "username": env.USERNAME,
    "password": env.PASSOWRD,
    "database": env.DATABASE,
    "host": env.HOST,
    "dialect": "mysql"
}

const test = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE1,
    host: env.MYSQL_HOST,
    dialect: "mysql",
}

const production = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE2,
    host: env.MYSQL_HOST,
    dialect: "mysql",
}

module.exports = { development, production, test }