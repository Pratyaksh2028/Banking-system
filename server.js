const express = require("express");
const app = express();

const loggerMiddleware = require("./middlewares/loggerMiddleware");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Banking System API",
        version: "1.0.0"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/test-error", (req, res, next) => {
    next(new Error("Test error from Banking System API"));
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(3000, () => {
    console.log("Banking System API running on port 3000");
});