const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// CORS libera o consumo da API pelo frontend; JSON habilita req.body em formato JSON.
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Prefixos agrupam cada recurso da API pública.
app.use("/v1/user", userRoutes);
app.use("/v1/category", categoryRoutes);
app.use("/v1/product", productRoutes);

// Middleware final: normaliza exceções não tratadas pelos controllers.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Erro interno do servidor",
  });
});

module.exports = app;