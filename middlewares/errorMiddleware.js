const errorMiddleware = (err, req, res, next) => {
    console.log("Error:", err.message);

    res.status(500).json({
        message: "Internal server error",
        error: err.message
    });
};

module.exports = errorMiddleware;