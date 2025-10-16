const { z } = require("zod");

const createPartSchema = z.object({
    name: z.string().min(2),
    brand: z.string().min(1),
    price: z.number().nonnegative(),
    stock: z.number().int().nonnegative(),
    category: z.string().min(1),
});

const updatePartSchema = createPartSchema.partial();

module.exports = { createPartSchema, updatePartSchema };
