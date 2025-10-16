const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { registerSchema, loginSchema } = require("../validation/authSchemas");

const router = express.Router();

router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);
        const exists = await User.findOne({ where: { email } });
        if (exists)
            return res.status(400).json({ error: "Email already in use" });

        const password_hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password_hash });
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
        });
    } catch (err) {
        if (err.name === "ZodError") err.status = 400;
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES || "7d",
            }
        );
        res.json({ token });
    } catch (err) {
        if (err.name === "ZodError") err.status = 400;
        next(err);
    }
});

module.exports = router;
