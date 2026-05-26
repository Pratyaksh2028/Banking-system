const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                message: "Access denied. Only " + requiredRole + " allowed."
            });
        }

        next();
    };
};

module.exports = roleMiddleware;