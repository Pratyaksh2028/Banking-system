const { users } = require("../DB/bankDB");

const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(409).json({
            message: "Email already registered"
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role: "customer"
    };

    users.push(newUser);

    res.status(201).json({
        message: "User registered successfully",
        data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const tokenPrefix = user.role === "admin" ? "admin" : "user";
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
};

module.exports = {
    registerUser,
    loginUser
};