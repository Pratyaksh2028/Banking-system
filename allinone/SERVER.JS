const express = require("express");
const app = express();

app.use(express.json());


// FAKE DATABASE

// Creating users array to act like a fake users table
let users = [
    //first user gonna be a admin user
    { 
        id: 1,
        name: "Admin User",
        email: "admin@bank.com",
        password: "admin123",
        role: "admin"
    },

    //second user is a normal customer
    {
        id: 2,
        name: "Pratyaksh Rawat",
        email: "pratyaksh12345@gmail.com",
        password: "pratyaksh12345",
        role: "customer"
    },
];

// Creating an accounts array to act like a fake accounts table
let accounts = [
    //this gonna be an existing account for Pratyaksh
    {
        id: 1,
        userId: 2,
        accountNumber: "ACC100001",
        balance: 100000,
        status: "active"
    }
];

// Creating a transactions array to act like a fake transactions table
let transactions = [
    {
        id: 1,
        accountId: 1,
        type: "deposit",
        description: "Initial deposit",
        createdAt: new Date().toISOString()
    }
];


// Creating a helper function to generate account numbers
const genrateAccountNumber = (nextId) => {
    // Adding nextId to 100000 and attach ACC in front
    return "ACC" + String(100000 + nextId);
};


// LOGGER MIDDLEWARE
const loggerMiddleware = (req, res, next) => {
    // this gonna print request method, request URL, and current time in terminal
    console.log(`${req.method} ${req.url} - ${new Date().toLocalString()}`);
    next();
};

app.use(loggerMiddleware);


// AUTH MIDDLEWARE
const authMiddleware = (req, res, next) => {
    // Read token from request headers
    const token = req.headers.authorization;

    if (!token) {
        return res.status(404).json({
            message: "Authorization token required"
        });
    }   
    // split gonna split them in arrays part[0] = "user" and part[1] = "2"
    const parts = token.split("-");

    //converting 2nd part in numbers fro string
    const userId = parseInt(parts[1]);

    //finding that user 
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            message: "Invalid Token"
        });
    }

    req.user = user;

    next();
};


// ROLE MIDDLEWARE
const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(404).json({
                message: "Access Denied. Only " + requiredRole + "allowed"
            });
        }

        next();
    };
};


// VALIDATION MIDDLEWARES
const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(404).json({
            message: "Name , email , password are required"
        });
    }

    if (password.length < 6) {
        return res.status(404).json({
            message: "Password must be at least 6 characters"
        });
    }
    next();
};

//validate login request 
const validateLogin = (req, res, next) => {
    const { email , password } = req.body;

    if (!email || !password) {
        return res.status(404).json({
            message: "Email and password are required"
        });
    }
    next();
};

//validate amount
const validateAmount = (req, res, next) => {
    const amount = req.body.amount;

    if (!amount || amount === undefined) {
        return res.status(404).json({
            message: "Amount is required"
        });
    }

    if (typeof amount !== "number") {
        return res.status(404).json({
            message: "Amount must be in numbers"
        });
    }

    if (amount <= 0) {
        return res.status(404).json({
            message: "Amount must be great than 0"
        });
    }
    next();
};

//validate transfer
const validateTransfer = (req, res, next) => {
    const { recieverAccountNumber , amount } = req.body;

    if (!recieverAccountNumber) {
        return res.status(404).json({
            message: "Reciever Account Number is needed for transaction"
        });
    }

    if (amount === undefined || typeof amount !== "number" || amount <= 0) {
        return res.status(404).json({
            message: "Give Valid amount"
        });
    }
    next();
};


//home route
app.get("/",( req, res) => {
    res.status(200).json({
        message: "Welcome this is the homepage"
    });
});


//Register route
app.post ("/api/auth/register", validateRegister,(req, res, next) =>{
    //get register data from body
    const {name, email, password} = req.body;
    
    const existingUser = users.find(u => user.email === email);

    if (existingUser) {
        return res.status(409).json({
            message: "Email already registered"
        });
    }
    //creating that new user
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        role: "customer"
    };

    users.push(newUser);

    return res.status(201).json({
        message: "User registered successfully",
        data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
    });
});


// Login route
app.post("/api/auth/login", validateLogin, (req, res) => {
    const {email, password} = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if(!user){
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const tokenPrefix = user.role === "admin" ? "admin" : "user";

    const token = `${tokenPrefix} - ${user.id}`;

    res.status(200).json({
        message: "Login Successfully",
        token: token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});


// Create bank account
app.post("/api/accounts/create", authMiddleware, (req, res) => {
    const existingAccount = accounts.find(acc => acc.userId === req.user.id);

    if (existingAccount) {
        return res.status(404).json({
            message: "User already have a bank account"
        });
    }
    //creating new bankk account
    const newAccount = {
        id: accounts.length + 1,
        userId: req.user.id,
        accountNumber: genrateAccountNumber(accounts.length + 1),
        balance: 0,
        status: "active"
    };
    //saving this new acc in the database
    accounts.push(newAccount);

    res.status(200).json({
        message: "Bank account created successfull",
        data: newAccount
    });
});


//logged in user account 
app.get("/api/accounts/my-account", authMiddleware, (req, res) => {
    const account = accounts.find(acc => acc.userId === req.userId);

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    res.status(200).json({
        message: "Account fetched successfully",
        data: account
    });
});


//get balance of the user acc
app.get("/api/accounts/balance", authMiddleware, (req, res) => {
    const account = accounts.find(acc => acc.userId === req.userId);

    if (!account) {
        return res.status(404).json({
            message: "This account doesnt exist"
        });
    }
    res.status(200).json({
        accountNumber: account.accountNumber,
        balance: account.balance,
        status: account.status
    });
});



// TRANSACTION ROUTES

//Depositing money
app.post("/api/transactions/deposti", authMiddleware, validateAmount, (req, res) => {
    const account = accounts.find(acc => acc.userId === req.userId);

    if (!account) {
        return res.status(404).json({
            message: " Account not found"
        });
    }

    if (account.status !== "active") {
        return res.status(404).json({
            message: "Account if not active"
        });
    }
    account.balance += req.body.amount;

    //creating the transaction record
    const transaction = {
        id: transactions.length + 1,
        accountId: account.id,
        type: "deposit",
        amount: req.body.amount,
        description: "Money deposited",
        createdAt: new Date().toISOString()
    };
    transactions.push(transaction);

    res.status(200).json({
        message: "Deposit successfully",
        balance: account.balance,
        transaction: transaction
    });
});


// Withdraw money
app.post("/api/transactions/withdraw", authMiddleware, validateAmount, (req, res) => {

    const account = accounts.find(acc => acc.userId === req.userId);
    
    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    if(account.status !=="active") {
        return res.status(404).json({
            message: "Account is not active"
        });
    }

    if(account.balance <= 0) {
        return res.status(404).json({
            message: "Insufficient funds"
        });
    }

    //subtracting the amount from the balance
    account.balnce -= req.body.amount;

    //creating the transactions record
    const transaction = {
        id: transactions.length + 1,
        accountId: account.id,
        type: "withdraw",
        amount: req.body.amount,
        description: "Money withdrawn",
        createdAt: new Date().toISOString()
    };
    
    transactions.push(transaction);

    res.status(200).json({
        message: "Withdrawn successfully",
        balance: account.balance,
        transaction: transaction
    });
});


// Transfer money
app.post("/api/transactions/transfer", authMiddleware, validateTransfer, (req, res) => {
    const {recieverAccountNumber, amount} = req.body;

    const senderAccount = accounts.find(acc => acc.userId === req.userId);
    const recieverAccount = accounts.find(acc => acc.accountNumber === recieverAccountNumber);

    if (!senderAccount) {
        return res.status(404).json({
            message: "Sender account not found"
        });
    }

    if (!recieverAccount) {
        return res.status(404).json({
            message: "Receiver account not found"
        });
    }

    if (recieverAccount.status !== "active" || senderAccount.status !== "active"){
        return res.status(403).json({
            message: "one of the account if frozen"
        });
    }

    if (senderAccount.balance < req.amount) {
        return res.status(403).json({
            message: "Insiffecient balance"
        });
    }

    senderAccount.balance -= amount;

    recieverAccount.balance += amount;


    // Creating sender debit transaction
    const debitTransaction = {
        id: transactions.length + 1,                      
        accountId: senderAccount.id,                     
        type: "transfer_debit",                           
        amount: amount,                                    
        description: `Transfer to ${receiverAccount.accountNumber}`, 
        createdAt: new Date().toISOString()                
    };
    transactions.push(debitTransaction);


    // Creating receiver credit transaction
     const creditTransaction = {
        id: transactions.length + 1,                       
        accountId: receiverAccount.id,                   
        type: "transfer_credit",                         
        amount: amount,                                
        description: `Transfer from ${senderAccount.accountNumber}`, 
        createdAt: new Date().toISOString()      
    };
    transactions.push(creditTransaction);
    
    res.status(200).json({
        message: "Transfer successful",
        balance: senderAccount.balance,
        transaction: debitTransaction
    });
});


// Transaction history route
app.get("/api/transactions/history", authMiddleware, (req, res) => {
    
    const account = accounts.find(acc => acc.userId === req.user.id);

    
    if (!account) {
        // Send not found response
        return res.status(404).json({
            message: "Account not found"
        });
    }

    
    const history = transactions.filter(t => t.accountId === account.id);

    
    res.status(200).json({
        message: "Transaction history fetched successfully",
        data: history
    });
});


// Admin get all users route
app.get("/api/admin/users", authMiddleware, roleMiddleware("admin"), (req, res) => {
    // Create users list without passwords
    const safeUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }));

    // Send users list
    res.status(200).json({
        message: "All users fetched successfully",
        data: safeUsers
    });
});


// Admin get all accounts route
app.get("/api/admin/accounts", authMiddleware, roleMiddleware("admin"), (req, res) => {
    
    res.status(200).json({
        message: "All accounts fetched successfully",
        data: accounts
    });
});


// Admin get all transactions route
app.get("/api/admin/transactions", authMiddleware, roleMiddleware("admin"), (req, res) => {
    
    res.status(200).json({
        message: "All transactions fetched successfully",
        data: transactions
    });
});


// Admin freeze account route
app.patch("/api/admin/accounts/:id/freeze", authMiddleware, roleMiddleware("admin"), (req, res) => {
    // Gettin account id from URL params and convert to number
    const accountId = parseInt(req.params.id);

    // Find account by account id
    const account = accounts.find(acc => acc.id === accountId);

    // If account not found
    if (!account) {
        // Send not found response
        return res.status(404).json({
            message: "Account not found"
        });
    }

    // Change account status to frozen
    account.status = "frozen";

    // Send success response
    res.status(200).json({
        message: "Account frozen successfully",
        data: account
    });
});


// Admin unfreeze account route
app.patch("/api/admin/accounts/:id/unfreeze", authMiddleware, roleMiddleware("admin"), (req, res) => {
    // Get account id from URL params and convert to number
    const accountId = parseInt(req.params.id);

    // Find account by account id
    const account = accounts.find(acc => acc.id === accountId);

    // If account not found
    if (!account) {
        // Send not found response
        return res.status(404).json({
            message: "Account not found"
        });
    }

    // Change account status to active
    account.status = "active";

    // Send success response
    res.status(200).json({
        message: "Account unfrozen successfully",
        data: account
    });
});


// Test error route
app.get("/api/test-error", (req, res, next) => {
    // Create a fake error
    const error = new Error("Test error from Banking System API");

    // Send error to error middleware
    next(error);
});


// 404 middleware
app.use((req, res) => {
    // Send response when route is not found
    res.status(404).json({
        message: "API route not found"
    });
});


// Error middleware
app.use((err, req, res, next) => {
    // Print error in terminal
    console.log("Error:", err.message);

    // Send server error response
    res.status(500).json({
        message: "Internal server error",
        error: err.message
    });
});


// Start server
app.listen(3000, () => {
    // Print message when server starts
    console.log("Banking System API running on port 3000");
});