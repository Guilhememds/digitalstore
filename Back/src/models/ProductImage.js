const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductImage = sequelize.define(
    "ProductImage",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            // Remove as imagens automaticamente ao excluir o produto.
            references: {
                model: "products",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "product_images",
        timestamps: false,
    }
);

module.exports = ProductImage;