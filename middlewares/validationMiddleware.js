const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email, and password are required"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    next();
};

const validateAmount = (req, res, next) => {
    const { amount } = req.body;

    if (amount === undefined) {
        return res.status(400).json({
            message: "Amount is required"
        });
    }

    if (typeof amount !== "number") {
        return res.status(400).json({
            message: "Amount must be a number"
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            message: "Amount must be greater than 0"
        });
    }

    next();
};

const validateTransfer = (req, res, next) => {
    const { receiverAccountNumber, amount } = req.body;

    if (!receiverAccountNumber) {
        return res.status(400).json({
            message: "Receiver account number is required"
        });
    }

    if (amount === undefined || typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
            message: "Valid amount is required"
        });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateAmount,
    validateTransfer
};