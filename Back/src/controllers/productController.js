function parseRadius(radius) {
    if (radius === undefined || radius === null) return 0;
    if (typeof radius === "number") return Number.isInteger(radius) ? radius : NaN;
    // Aceita valores de interface como "10px", mas sempre converte para inteiro.
    const cleaned = String(radius).replace(/px$/i, "").trim();
    const num = Number(cleaned);
    return Number.isInteger(num) ? num : NaN;
}

const { Op } = require("sequelize");
const {
    sequelize,
    Product,
    ProductImage,
    ProductOption,
    Category,
} = require("../models");

const ALLOWED_PRODUCT_FIELDS = [
    "id",
    "enabled",
    "name",
    "slug",
    "use_in_menu",
    "stock",
    "description",
    "price",
    "price_with_discount",
    "category_ids",
    "images",
    "options",
];

function isValidId(id) {
    const num = Number(id);
    return Number.isInteger(num) && num > 0;
}

function formatProduct(productInstance, selectedFields = null) {
    const plain = productInstance.get({ plain: true });

    // Normaliza relacionamentos para o formato usado pela API.
    const categoryIds = Array.isArray(plain.categories)
        ? plain.categories.map((cat) => cat.id)
        : [];

    const formattedImages = Array.isArray(plain.images)
        ? plain.images.map((img) => ({
            id: img.id,
            content: img.path,
        }))
        : [];

    const formattedOptions = Array.isArray(plain.options)
        ? plain.options.map((opt) => ({
            id: opt.id,
            title: opt.title,
            shape: opt.shape,
            radius: Number(opt.radius ?? 0),
            type: opt.type,
            values: Array.isArray(opt.values)
                ? opt.values
                : String(opt.values ?? "")
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean),
        }))
        : [];

    const formatted = {
        id: plain.id,
        enabled: Boolean(plain.enabled),
        name: plain.name,
        slug: plain.slug,
        ...(plain.use_in_menu !== undefined
            ? { use_in_menu: Boolean(plain.use_in_menu) }
            : {}),
        stock: Number(plain.stock ?? 0),
        description: plain.description ?? "",
        price: Number(plain.price),
        price_with_discount: Number(plain.price_with_discount),
        category_ids: categoryIds,
        images: Array.isArray(plain.images) ? plain.images : [],
        options: Array.isArray(plain.options) ? plain.options : [],
    };

    if (!selectedFields || selectedFields.length === 0) {
        return formatted;
    }

    const filtered = {};
    for (const field of selectedFields) {
        if (Object.prototype.hasOwnProperty.call(formatted, field)) {
            filtered[field] = formatted[field];
        }
    }
    return filtered;
}

function extractOptionFilters(query) {
    const optionFilters = [];
    for (const [key, val] of Object.entries(query)) {
        // Filtros no formato option[ID]=valor1,valor2.
        const match = key.match(/^option\[(\d+)\]$/);
        if (match) {
            const optionId = Number(match[1]);
            const values = String(val)
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);

            if (!Number.isInteger(optionId) || optionId < 1 || values.length === 0) {
                return { error: "Filtro de opção inválido." };
            }

            optionFilters.push({ optionId, values });
        }
    }
    return { optionFilters };
}

const productController = {

    async search(req, res) {
        try {
            // -1 preserva a consulta completa; casos comuns são paginados em memória.
            const rawLimit =
                req.query.limit !== undefined ? Number(req.query.limit) : 12;
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

            let selectedFields = null;
            if (req.query.fields !== undefined) {
                // Limita fields para impedir a exposição de propriedades não previstas pela API.
                const requested = String(req.query.fields)
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean);

                if (
                    requested.length === 0 ||
                    requested.some((f) => !ALLOWED_PRODUCT_FIELDS.includes(f))
                ) {
                    return res.status(400).json({ message: "Parâmetro 'fields' inválido." });
                }
                selectedFields = requested;
            }

            const where = {};

            if (req.query.match !== undefined && String(req.query.match).trim() !== "") {
                const term = `%${String(req.query.match).trim()}%`;
                where[Op.or] = [
                    { name: { [Op.like]: term } },
                    { description: { [Op.like]: term } },
                ];
            }

            if (req.query["price-range"] !== undefined) {
                const parts = String(req.query["price-range"])
                    .split("-")
                    .map((p) => Number(p.trim()));

                if (
                    parts.length !== 2 ||
                    parts.some((n) => Number.isNaN(n) || n < 0) ||
                    parts[0] > parts[1]
                ) {
                    return res
                        .status(400)
                        .json({ message: "Parâmetro 'price-range' inválido." });
                }

                where.price = { [Op.between]: [parts[0], parts[1]] };
            }

            let categoryFilterIds = null;
            if (req.query.category_ids !== undefined) {
                const parsedIds = String(req.query.category_ids)
                    .split(",")
                    .map((id) => Number(id.trim()));

                if (
                    parsedIds.length === 0 ||
                    parsedIds.some((id) => !Number.isInteger(id) || id < 1)
                ) {
                    return res
                        .status(400)
                        .json({ message: "Parâmetro 'category_ids' inválido." });
                }
                categoryFilterIds = parsedIds;
            }

            const { optionFilters, error: optionError } = extractOptionFilters(
                req.query
            );
            if (optionError) {
                return res.status(400).json({ message: optionError });
            }

            const include = [
                { model: ProductImage, as: "images" },
                { model: ProductOption, as: "options" },
                {
                    model: Category,
                    as: "categories",
                    through: { attributes: [] },
                    ...(categoryFilterIds
                        ? { where: { id: { [Op.in]: categoryFilterIds } }, required: true }
                        : {}),
                },
            ];

            const allMatching = await Product.findAll({
                where,
                include,
                order: [["id", "ASC"]],
                distinct: true,
            });

            const filteredByOptions =
                optionFilters.length === 0
                    ? allMatching
                    : allMatching.filter((prod) => {
                        // Todos os filtros de opções devem ser atendidos pelo mesmo produto.
                        const plain = prod.get({ plain: true });
                        const prodOptions = Array.isArray(plain.options)
                            ? plain.options
                            : [];

                        return optionFilters.every(({ optionId, values }) =>
                            prodOptions.some((opt) => {
                                if (Number(opt.id) !== optionId) return false;
                                const optValues = Array.isArray(opt.values)
                                    ? opt.values.map(String)
                                    : String(opt.values ?? "")
                                        .split(",")
                                        .map((v) => v.trim());
                                return values.some((v) => optValues.includes(v));
                            })
                        );
                    });

            const total = filteredByOptions.length;

            const paginated =
                rawLimit === -1
                    ? filteredByOptions
                    : filteredByOptions.slice(
                        (rawPage - 1) * rawLimit,
                        (rawPage - 1) * rawLimit + rawLimit
                    );

            const data = paginated.map((item) =>
                formatProduct(item, selectedFields)
            );

            return res.status(200).json({
                data,
                total,
                limit: rawLimit,
                page: rawPage,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar produtos." });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "ID de produto inválido." });
            }

            const product = await Product.findByPk(id, {
                include: [
                    { model: ProductImage, as: "images" },
                    { model: ProductOption, as: "options" },
                    { model: Category, as: "categories", through: { attributes: [] } },
                ],
            });

            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado." });
            }

            return res.status(200).json(formatProduct(product));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar produto." });
        }
    },

    async create(req, res) {
        // Produto, categorias, imagens e opções são persistidos como uma única operação.
        const transaction = await sequelize.transaction();
        try {
            const {
                enabled,
                name,
                slug,
                use_in_menu,
                stock,
                description,
                price,
                price_with_discount,
                category_ids,
                images,
                options,
            } = req.body;

            if (
                !name ||
                typeof name !== "string" ||
                !slug ||
                typeof slug !== "string" ||
                price === undefined ||
                price === null ||
                Number.isNaN(Number(price)) ||
                price_with_discount === undefined ||
                price_with_discount === null ||
                Number.isNaN(Number(price_with_discount))
            ) {
                await transaction.rollback();
                return res.status(400).json({
                    message: "name, slug, price e price_with_discount são obrigatórios e válidos.",
                });
            }

            let validCategoryIds = [];
            if (category_ids !== undefined) {
                if (!Array.isArray(category_ids)) {
                    await transaction.rollback();
                    return res.status(400).json({ message: "category_ids deve ser um array." });
                }
                const parsedIds = category_ids.map((id) => Number(id));
                if (parsedIds.some((id) => !Number.isInteger(id) || id < 1)) {
                    await transaction.rollback();
                    return res.status(400).json({ message: "category_ids contém ID inválido." });
                }
                if (parsedIds.length > 0) {
                    // Não cria vínculos com categorias inexistentes.
                    const foundCategories = await Category.findAll({
                        where: { id: parsedIds },
                        attributes: ["id"],
                        transaction,
                    });
                    if (foundCategories.length !== parsedIds.length) {
                        await transaction.rollback();
                        return res.status(400).json({
                            message: "Uma ou mais categorias informadas não existem.",
                        });
                    }
                    validCategoryIds = parsedIds;
                }
            }

            const created = await Product.create(
                {
                    enabled: enabled !== undefined ? Boolean(enabled) : false,
                    name: name.trim(),
                    slug: slug.trim(),
                    ...(use_in_menu !== undefined
                        ? { use_in_menu: Boolean(use_in_menu) }
                        : {}),
                    stock: stock !== undefined ? Number(stock) : 0,
                    description: description ?? "",
                    price: Number(price),
                    price_with_discount: Number(price_with_discount),
                },
                { transaction }
            );

            if (validCategoryIds.length > 0) {
                await created.setCategories(validCategoryIds, { transaction });
            }

            if (images !== undefined) {
                if (!Array.isArray(images)) {
                    await transaction.rollback();
                    return res.status(400).json({ message: "images deve ser um array." });
                }
                if (images.length > 0) {
                    const imagePayload = [];
                    for (const img of images) {
                        const imgPath = img?.path ?? img?.content;
                        if (!imgPath || typeof imgPath !== "string") {
                            await transaction.rollback();
                            return res.status(400).json({
                                message: "Cada item de images deve conter content ou path válido.",
                            });
                        }
                        imagePayload.push({
                            product_id: created.id,
                            enabled: img.enabled !== undefined ? Boolean(img.enabled) : false,
                            path: imgPath,
                        });
                    }
                    await ProductImage.bulkCreate(imagePayload, { transaction });
                }
            }

            if (options !== undefined) {
                if (!Array.isArray(options)) {
                    await transaction.rollback();
                    return res.status(400).json({ message: "options deve ser um array." });
                }
                if (options.length > 0) {
                    // Normaliza diferentes formatos de valores antes da persistência.
                    const optionPayload = [];
                    for (const opt of options) {
                        const rawValues = opt?.values ?? opt?.value;
                        const valuesStr = Array.isArray(rawValues)
                            ? rawValues.map((v) => String(v).trim()).filter(Boolean).join(",")
                            : String(rawValues ?? "").trim();

                        const parsedRadius = parseRadius(opt?.radius);
                        if (!opt?.title || !valuesStr || Number.isNaN(parsedRadius)) {
                            await transaction.rollback();
                            return res.status(400).json({
                                message: "Dados inválidos em options.",
                            });
                        }

                        optionPayload.push({
                            product_id: created.id,
                            title: String(opt.title).trim(),
                            shape: opt.shape || "square",
                            radius: parsedRadius,
                            type: opt.type || "text",
                            values: valuesStr,
                        });
                    }
                    await ProductOption.bulkCreate(optionPayload, { transaction });
                }
            }

            await transaction.commit();

            const fullProduct = await Product.findByPk(created.id, {
                include: [
                    { model: ProductImage, as: "images" },
                    { model: ProductOption, as: "options" },
                    { model: Category, as: "categories", through: { attributes: [] } },
                ],
            });

            return res.status(201).json(formatProduct(fullProduct));
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            if (
                error.name === "SequelizeValidationError" ||
                error.name === "SequelizeUniqueConstraintError" ||
                error.name === "SequelizeForeignKeyConstraintError"
            ) {
                return res
                    .status(400)
                    .json({ message: "Dados inválidos para cadastro de produto." });
            }
            return res.status(500).json({ message: "Erro ao cadastrar produto." });
        }
    },
    // PUT /v1/product/:id
    async update(req, res) {
        // Todas as alterações relacionadas ao produto são feitas dentro da transação.
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                await transaction.rollback();
                return res.status(400).json({ message: "ID de produto inválido." });
            }

            const product = await Product.findByPk(id, { transaction });
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({ message: "Produto não encontrado." });
            }

            const {
                enabled,
                name,
                slug,
                use_in_menu,
                stock,
                description,
                price,
                price_with_discount,
                category_ids,
                images,
                options,
            } = req.body;

            if (
                (name !== undefined && (typeof name !== "string" || !name.trim())) ||
                (slug !== undefined && (typeof slug !== "string" || !slug.trim())) ||
                (price !== undefined && Number.isNaN(Number(price))) ||
                (price_with_discount !== undefined &&
                    Number.isNaN(Number(price_with_discount)))
            ) {
                await transaction.rollback();
                return res.status(400).json({ message: "Dados inválidos para atualização." });
            }

            if (category_ids !== undefined) {
                if (!Array.isArray(category_ids)) {
                    await transaction.rollback();
                    return res.status(400).json({ message: "category_ids deve ser um array." });
                }
                const parsedIds = category_ids.map((catId) => Number(catId));
                if (parsedIds.some((catId) => !Number.isInteger(catId) || catId < 1)) {
                    await transaction.rollback();
                    return res.status(400).json({ message: "category_ids contém ID inválido." });
                }
                if (parsedIds.length > 0) {
                    const foundCategories = await Category.findAll({
                        where: { id: parsedIds },
                        attributes: ["id"],
                        transaction,
                    });
                    if (foundCategories.length !== parsedIds.length) {
                        await transaction.rollback();
                        return res
                            .status(400)
                            .json({ message: "Uma ou mais categorias informadas não existem." });
                    }
                }
                await product.setCategories(parsedIds, { transaction });
            }

            await product.update(
                {
                    enabled: enabled !== undefined ? Boolean(enabled) : product.enabled,
                    name: name !== undefined ? name.trim() : product.name,
                    slug: slug !== undefined ? slug.trim() : product.slug,
                    ...(use_in_menu !== undefined
                        ? { use_in_menu: Boolean(use_in_menu) }
                        : {}),
                    stock: stock !== undefined ? Number(stock) : product.stock,
                    description:
                        description !== undefined ? description : product.description,
                    price: price !== undefined ? Number(price) : product.price,
                    price_with_discount:
                        price_with_discount !== undefined
                            ? Number(price_with_discount)
                            : product.price_with_discount,
                },
                { transaction }
            );

            if (images !== undefined) {
                if (!Array.isArray(images)) {
                    await transaction.rollback();
                    return res.status(400).json({ message: "images deve ser um array." });
                }

                // Itens com id pertencente ao produto podem ser atualizados ou removidos.
                for (const img of images) {
                    if (img?.id !== undefined) {
                        const existingImg = await ProductImage.findOne({
                            where: { id: Number(img.id), product_id: product.id },
                            transaction,
                        });
                        if (!existingImg) {
                            await transaction.rollback();
                            return res.status(400).json({
                                message: `Imagem ${img.id} não encontrada para este produto.`,
                            });
                        }

                        if (img.deleted === true) {
                            await existingImg.destroy({ transaction });
                        } else {
                            const nextPath = img.path ?? img.content ?? existingImg.path;
                            await existingImg.update(
                                {
                                    path: nextPath,
                                    ...(img.enabled !== undefined
                                        ? { enabled: Boolean(img.enabled) }
                                        : {}),
                                },
                                { transaction }
                            );
                        }
                    } else {
                        const imgPath = img?.path ?? img?.content;
                        if (!imgPath || typeof imgPath !== "string") {
                            await transaction.rollback();
                            return res.status(400).json({
                                message: "Nova imagem deve conter content ou path válido.",
                            });
                        }
                        await ProductImage.create(
                            {
                                product_id: product.id,
                                enabled: img.enabled !== undefined ? Boolean(img.enabled) : false,
                                path: imgPath,
                            },
                            { transaction }
                        );
                    }
                }
            }

            if (options !== undefined) {
                if (!Array.isArray(options)) {
                    await transaction.rollback();
                    return res.status(400).json({ message: "options deve ser um array." });
                }

                // O mesmo item só é alterado quando o id pertence ao produto atual.
                for (const opt of options) {
                    if (opt?.id !== undefined) {
                        const existingOpt = await ProductOption.findOne({
                            where: { id: Number(opt.id), product_id: product.id },
                            transaction,
                        });
                        if (!existingOpt) {
                            await transaction.rollback();
                            return res.status(400).json({
                                message: `Opção ${opt.id} não encontrada para este produto.`,
                            });
                        }

                        if (opt.deleted === true) {
                            await existingOpt.destroy({ transaction });
                        } else {
                            const rawValues = opt.values ?? opt.value;
                            const parsedValues =
                                rawValues !== undefined
                                    ? Array.isArray(rawValues)
                                        ? rawValues.map((v) => String(v).trim()).filter(Boolean).join(",")
                                        : String(rawValues).trim()
                                    : existingOpt.values;

                            const parsedRadius =
                                opt.radius !== undefined
                                    ? parseRadius(opt.radius)
                                    : existingOpt.radius;

                            if (!parsedValues || Number.isNaN(parsedRadius)) {
                                await transaction.rollback();
                                return res
                                    .status(400)
                                    .json({ message: "Dados inválidos na atualização da opção." });
                            }

                            await existingOpt.update(
                                {
                                    title: opt.title !== undefined ? String(opt.title).trim() : existingOpt.title,
                                    shape: opt.shape !== undefined ? opt.shape : existingOpt.shape,
                                    radius: parsedRadius,
                                    type: opt.type !== undefined ? opt.type : existingOpt.type,
                                    values: parsedValues,
                                },
                                { transaction }
                            );
                        }
                    } else {
                        const rawValues = opt?.values ?? opt?.value;
                        const valuesStr = Array.isArray(rawValues)
                            ? rawValues.map((v) => String(v).trim()).filter(Boolean).join(",")
                            : String(rawValues ?? "").trim();

                        const parsedRadius = parseRadius(opt?.radius);
                        if (!opt?.title || !valuesStr || Number.isNaN(parsedRadius)) {
                            await transaction.rollback();
                            return res
                                .status(400)
                                .json({ message: "Nova opção inválida no produto." });
                        }

                        await ProductOption.create(
                            {
                                product_id: product.id,
                                title: String(opt.title).trim(),
                                shape: opt.shape || "square",
                                radius: parsedRadius,
                                type: opt.type || "text",
                                values: valuesStr,
                            },
                            { transaction }
                        );
                    }
                }
            }

            await transaction.commit();
            return res.status(204).send();
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            if (
                error.name === "SequelizeValidationError" ||
                error.name === "SequelizeUniqueConstraintError" ||
                error.name === "SequelizeForeignKeyConstraintError"
            ) {
                return res
                    .status(400)
                    .json({ message: "Dados inválidos para atualização de produto." });
            }
            return res.status(500).json({ message: "Erro ao atualizar produto." });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "ID de produto inválido." });
            }

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado." });
            }

            await product.destroy();
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao deletar produto." });
        }
    },
};

module.exports = productController;