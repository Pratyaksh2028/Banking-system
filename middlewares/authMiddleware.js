const db = require("../config/db");

const authMiddleware = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Authorization token required"
        });
    }

    const parts = token.split("-");

    if (parts.length !== 2) {
        return res.status(403).json({
            message: "Invalid token format"
        });
    }

    const userId = parseInt(parts[1]);

    db.query(
        "SELECT * FROM users WHERE id = ?",
        [userId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(403).json({
                    message: "Invalid token"
                });
            }

            req.user = results[0];
            next();
        }
    );
};

module.exports = authMiddleware;