const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductCategory = sequelize.define(
    "ProductCategory",
    {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // Relação intermediária removida quando o produto ou categoria deixa de existir.
            references: {
                model: "products",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "categories",
                key: "id",
            },
            onDelete: "CASCADE",
        },
    },
    {
        tableName: "product_categories",
        timestamps: false,
    }
);

module.exports = ProductCategory;