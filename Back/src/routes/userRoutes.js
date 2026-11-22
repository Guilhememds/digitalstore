const { Router } = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

const router = Router();

// Consulta pública por ID.
router.get("/:id", userController.getById);
// Cadastro público de usuário.
router.post("/", userController.create);
// Alteração e exclusão exigem JWT.
router.put("/:id", authMiddleware, userController.update);
router.delete("/:id", authMiddleware, userController.remove);
// Gera o JWT usado pelas rotas protegidas.
router.post("/token", userController.generateToken);

module.exports = router;