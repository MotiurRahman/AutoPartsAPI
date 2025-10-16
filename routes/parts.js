const express = require("express");
const { Op } = require("sequelize");
const { Part } = require("../models/Part");
const { authRequired } = require("../middleware/auth");
const {
    createPartSchema,
    updatePartSchema,
} = require("../validation/partSchemas");

const router = express.Router();

// GET /api/parts
router.get("/", async (req, res, next) => {
    try {
        const { q, category, minPrice, maxPrice } = req.query;
        const where = {};
        if (q) where.name = { [Op.like]: `%${q}%` };
        if (category) where.category = category;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = Number(minPrice);
            if (maxPrice) where.price[Op.lte] = Number(maxPrice);
        }
        const parts = await Part.findAll({
            where,
            order: [["created_at", "DESC"]],
        });
        res.json(parts);
    } catch (err) {
        next(err);
    }
});

// GET /api/parts/:id
router.get("/:id", async (req, res, next) => {
    try {
        const part = await Part.findByPk(req.params.id);
        if (!part) return res.status(404).json({ error: "Not found" });
        res.json(part);
    } catch (err) {
        next(err);
    }
});

// POST /api/parts
router.post("/", authRequired, async (req, res, next) => {
    try {
        const data = createPartSchema.parse(req.body);
        const created = await Part.create(data);
        res.status(201).json(created);
    } catch (err) {
        if (err.name === "ZodError") err.status = 400;
        next(err);
    }
});

// PUT /api/parts/:id
router.put("/:id", authRequired, async (req, res, next) => {
    try {
        const data = updatePartSchema.parse(req.body);
        const part = await Part.findByPk(req.params.id);
        if (!part) return res.status(404).json({ error: "Not found" });
        await part.update(data);
        res.json(part);
    } catch (err) {
        if (err.name === "ZodError") err.status = 400;
        next(err);
    }
});

// DELETE /api/parts/:id
router.delete("/:id", authRequired, async (req, res, next) => {
    try {
        const part = await Part.findByPk(req.params.id);
        if (!part) return res.status(404).json({ error: "Part not found" });

        // Keep a copy before deletion
        const deletedPart = part.toJSON();

        await part.destroy();

        res.status(200).json({
            message: "Part deleted successfully",
            deleted: deletedPart,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
