// config/db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME, // "autoparts"
    process.env.DB_USER, // "root"
    process.env.DB_PASS || "", // ""
    {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 3306),
        dialect: "mysql",
        logging: false, // set true to see SQL
        define: {
            underscored: true,
        },
    }
);

module.exports = { sequelize };
