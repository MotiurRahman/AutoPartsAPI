const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Part extends Model {}

Part.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING(150), allowNull: false },
        brand: { type: DataTypes.STRING(100), allowNull: false },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        stock: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        category: { type: DataTypes.STRING(80), allowNull: false },
    },
    {
        sequelize,
        tableName: "parts",
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    }
);

module.exports = { Part };
