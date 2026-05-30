const db = require("../config/db");

const registerUser = (req, res) => {

    const { name, email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            db.query(
                `INSERT INTO users
                (name, email, password, role)
                VALUES (?, ?, ?, ?)`,
                [name, email, password, "customer"],
                (err, insertResult) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Database Error",
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        message: "User registered successfully",
                        data: {
                            id: insertResult.insertId,
                            name,
                            email,
                            role: "customer"
                        }
                    });
                }
            );
        }
    );
};

const loginUser = (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const user = result[0];

            const tokenPrefix =
                user.role === "admin"
                    ? "admin"
                    : "user";

            const token = `${tokenPrefix}-${user.id}`;

            res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
};

module.exports = {
    registerUser,
    loginUser
};