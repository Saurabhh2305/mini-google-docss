"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./config/db");
const swagger_1 = require("./config/swagger");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const note_routes_1 = __importDefault(require("./routes/note.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
// middlewares
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
// swagger
(0, swagger_1.setupSwagger)(app);
// basic route
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});
// api routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/notes", note_routes_1.default);
// error middleware
app.use(error_middleware_1.errorHandler);
// start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
    await (0, db_1.connectDB)();
    console.log(`Server running on port ${PORT}`);
});
