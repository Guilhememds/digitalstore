const { Category } = require("../models");

// Apenas estes campos podem ser consultados ou selecionados pela API.
const ALLOWED_FIELDS = ["id", "name", "slug", "use_in_menu"];

function isValidId(id) {
    const num = Number(id);
    return Number.isInteger(num) && num > 0;
}

const categoryController = {

    async search(req, res) {
        try {
            // -1 preserva a consulta sem paginação.
            const rawLimit = req.query.limit !== undefined ? Number(req.query.limit) : 12;
            const rawPage = req.query.page !== undefined ? Number(req.query.page) : 1;

            if (
                Number.isNaN(rawLimit) ||
                (rawLimit !== -1 && (!Number.isInteger(rawLimit) || rawLimit < 1))
            ) {
                return res.status(400).json({ message: "Parâmetro 'limit' inválido." });
            }

            if (!Number.isInteger(rawPage) || rawPage < 1) {
                return res.status(400).json({ message: "Parâmetro 'page' inválido." });
            }

            const where = {};
            if (req.query.use_in_menu !== undefined) {
                // Aceita somente "true" ou "false" como filtro booleano.
                if (req.query.use_in_menu === "true") {
                    where.use_in_menu = true;
                } else if (req.query.use_in_menu === "false") {
                    where.use_in_menu = false;
                } else {
                    return res.status(400).json({ message: "Parâmetro 'use_in_menu' inválido." });
                }
            }

            let attributes = ["id", "name", "slug", "use_in_menu"];
            if (req.query.fields) {
                // Restringe fields aos campos públicos definidos acima.
                const requested = req.query.fields
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean);

                const invalid = requested.some((f) => !attributes.includes(f));
                if (invalid || requested.length === 0) {
                    return res.status(400).json({ message: "Parâmetro 'fields' inválido." });
                }

                attributes = requested;
            }

            const total = await Category.count({ where });

            const options = {
                where,
                attributes,
                order: [["id", "ASC"]],
            };

            if (rawLimit !== -1) {
                options.limit = rawLimit;
                options.offset = (rawPage - 1) * rawLimit;
            }

            const rows = await Category.findAll(options);
            const data = rows.map((row) => {
                const plain = row.get({ plain: true });
                if (Object.prototype.hasOwnProperty.call(plain, "use_in_menu")) {
                    plain.use_in_menu = Boolean(plain.use_in_menu);
                }
                return plain;
            });

            return res.status(200).json({
                data,
                total,
                limit: rawLimit,
                page: rawPage,
            });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar categorias." });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "ID de categoria inválido." });
            }

            const category = await Category.findByPk(id, {
                attributes: ALLOWED_FIELDS,
            });

            if (!category) {
                return res.status(404).json({ message: "Categoria não encontrada." });
            }

            const plain = category.get({ plain: true });
            plain.use_in_menu = Boolean(plain.use_in_menu);

            return res.status(200).json(plain);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar categoria." });
        }
    },


    async create(req, res) {
        try {
            const { name, slug, use_in_menu } = req.body;

            if (!name || !slug) {
                return res.status(400).json({ message: "name e slug são obrigatórios." });
            }

            const created = await Category.create({
                name,
                slug,
                use_in_menu: Boolean(use_in_menu),
            });

            return res.status(201).json({
                id: created.id,
                name: created.name,
                slug: created.slug,
                use_in_menu: created.use_in_menu,
            });
        } catch (error) {
            if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: "Dados inválidos ou slug já existente." });
            }
            return res.status(500).json({ message: "Erro ao cadastrar categoria." });
        }
    },


    async update(req, res) {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "ID de categoria inválido." });
            }

            const { name, slug, use_in_menu } = req.body;
            if (!name || !slug) {
                return res.status(400).json({ message: "name e slug são obrigatórios." });
            }

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Categoria não encontrada." });
            }

            await category.update({
                name,
                slug,
                use_in_menu: use_in_menu !== undefined ? Boolean(use_in_menu) : category.use_in_menu,
            });

            return res.status(204).send();
        } catch (error) {
            if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: "Dados inválidos para atualização de categoria." });
            }
            return res.status(500).json({ message: "Erro ao atualizar categoria." });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "ID de categoria inválido." });
            }

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Categoria não encontrada." });
            }

            await category.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar categoria." });
        }
    },
};

module.exports = categoryController;