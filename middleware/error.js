function errorHandler(err, req, res, _next) {
    const status = err.status || 500;
    const msg = err.message || "Server error";
    if (process.env.NODE_ENV !== "production") console.error(err);
    res.status(status).json({ error: msg });
}

module.exports = { errorHandler };
