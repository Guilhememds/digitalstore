const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // Exige o formato Authorization: Bearer <token>.
    if (!authHeader || typeof authHeader !== "string") {
        return res.status(400).json({ message: "Cabeçalho Authorization é obrigatório." });
    }
    const parts = authHeader.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer" || !parts[1]) {
        return res
            .status(400)
            .json({ message: "Formato inválido. Use: Authorization: Bearer <jwt>." });
    }

    const token = parts[1];

    try {
        const secret = process.env.JWT_SECRET || "digital_store_secret";
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        return next();
    } catch (error) {
        return res
            .status(400)
            .json({ message: "Token JWT inválido ou expirado." });
    }
}

module.exports = authMiddleware;