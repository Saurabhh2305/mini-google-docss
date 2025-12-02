"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({
        message: err.message || "Internal server error"
    });
};
exports.errorHandler = errorHandler;
