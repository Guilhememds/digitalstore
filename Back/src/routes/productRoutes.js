const { Router } = require("express");
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/auth");

const router = Router();

// "/search" deve ser registrado antes de "/:id" para não ser interpretado como ID.
router.get("/search", productController.search);
router.get("/:id", productController.getById);
// Operações de escrita exigem autenticação.
router.post("/", authMiddleware, productController.create);
router.put("/:id", authMiddleware, productController.update);
router.delete("/:id", authMiddleware, productController.remove);

module.exports = router;