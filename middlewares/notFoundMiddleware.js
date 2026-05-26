const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        message: "API route not found"
    });
};

module.exports = notFoundMiddleware;