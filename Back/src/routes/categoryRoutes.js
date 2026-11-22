const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/auth");

const router = Router();

// "/search" deve ser registrado antes de "/:id" para não ser interpretado como ID.
router.get("/search", categoryController.search);
router.get("/:id", categoryController.getById);
// Operações de escrita exigem autenticação.
router.post("/", authMiddleware, categoryController.create);
router.put("/:id", authMiddleware, categoryController.update);
router.delete("/:id", authMiddleware, categoryController.remove);
module.exports = router;