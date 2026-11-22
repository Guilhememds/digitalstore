const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

function isValidId(id) {
    const num = Number(id);
    return Number.isInteger(num) && num > 0;
}


const userController = {
    async generateToken(req, res) {
        try {
            const { email, password } = req.body;

            // Validação básica antes de consultar o usuário e comparar a senha.
            if (!email || !password || typeof email !== "string" || typeof password !== "string") {
                return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
            }

            const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
            if (!user) {
                return res.status(400).json({ message: "Credenciais inválidas." });
            }

            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                return res.status(400).json({ message: "Credenciais inválidas." });
            }

            const secret = process.env.JWT_SECRET || "digital_store_secret";
            // Token curto de 24 horas usado pelas rotas protegidas.
            const token = jwt.sign(
                { id: user.id, email: user.email },
                secret,
                { expiresIn: "24h" }
            );

            return res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao gerar token." });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "ID de usuário inválido." });
            }

            const user = await User.findByPk(id, {
                attributes: ["id", "firstname", "surname", "email"],
            });

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar usuário." });
        }
    },


    async create(req, res) {
        try {
            const { firstname, surname, email, password, confirmPassword } = req.body;

            if (!firstname || !surname || !email || !password || !confirmPassword) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios." });
            }

            if (password !== confirmPassword) {
                // Impede cadastro quando a confirmação não corresponde à senha.
                return res
                    .status(400)
                    .json({ message: "A senha e a confirmação de senha devem ser iguais." });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                // O e-mail é único no modelo e não pode ser cadastrado novamente.
                return res.status(400).json({ message: "E-mail já cadastrado." });
            }

            const created = await User.create({
                firstname,
                surname,
                email,
                password,
            });

            return res.status(201).json({
                id: created.id,
                firstname: created.firstname,
                surname: created.surname,
                email: created.email,
            });
        } catch (error) {
            if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: "Dados inválidos para cadastro de usuário." });
            }
            return res.status(500).json({ message: "Erro ao cadastrar usuário." });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "ID de usuário inválido." });
            }

            const { firstname, surname, email } = req.body;
            if (!firstname || !surname || !email) {
                return res
                    .status(400)
                    .json({ message: "firstname, surname e email são obrigatórios." });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            await user.update({ firstname, surname, email });
            return res.status(204).send();
        } catch (error) {
            if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: "Dados inválidos para atualização." });
            }
            return res.status(500).json({ message: "Erro ao atualizar usuário." });
        }
    },


    async remove(req, res) {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "ID de usuário inválido." });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            await user.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar usuário." });
        }
    },
};

module.exports = userController;