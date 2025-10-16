// sequelize.migrate.js
require("dotenv").config();
const { Sequelize } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: "mysql",
        logging: false,
    }
);

const migrator = new Umzug({
    migrations: { glob: "migrations/*.js" },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

async function runMigrations() {
    await sequelize.authenticate();
    await migrator.up();
}

module.exports = runMigrations;
