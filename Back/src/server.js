const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const app = require("./app");
const {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
  ProductOption,
  ProductCategory,
} = require("./models");

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com MySQL estabelecida com sucesso.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
}

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // O servidor só começa a aceitar requisições após o banco estar pronto.
    console.log("Conexão com MySQL/MariaDB estabelecida e tabelas sincronizadas.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
}
startServer();