const { users } = require("../DB/bankDB");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Authorization token required"
        });
    }

    const parts = token.split("-");
    const userId = parseInt(parts[1]);

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }

    req.user = user;
    next();
};

module.exports = authMiddleware;