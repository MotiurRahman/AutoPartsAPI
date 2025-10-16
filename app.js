// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { errorHandler } = require("./middleware/error");

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "*",
        credentials: true,
    })
);
app.use(express.json());

// Ensure models are registered once
require("./models/User");
require("./models/Part");

// Routes
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/parts", require("./routes/parts"));

// Errors
app.use(errorHandler);

module.exports = app; // <<— IMPORTANT
