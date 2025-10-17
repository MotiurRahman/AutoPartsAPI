// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { errorHandler } = require("./middleware/error");

dotenv.config();

const app = express();

// ---- CORS ----
const allowedOrigins = [
  "https://auto-parts-eight.vercel.app", // your production frontend
  "http://localhost:3000", // Next.js dev
  /\.vercel\.app$/, // Vercel preview URLs (optional, safe)
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // server-to-server/Postman
    const ok = allowedOrigins.some((o) =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    return ok
      ? callback(null, true)
      : callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: false, // set true ONLY if you’re using cookies
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// ---- END CORS ----
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
