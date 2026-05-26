let users = [
    {
        id: 1,
        name: "Admin User",
        email: "admin@bank.com",
        password: "admin123",
        role: "admin"
    },
    {
        id: 2,
        name: "Pratyaksh Rawat",
        email: "pratyaksh12345@gmail.com",
        password: "pratyaksh12345",
        role: "customer"
    }
];

let accounts = [
    {
        id: 1,
        userId: 2,
        accountNumber: "ACC100001",
        balance: 100000,
        status: "active"
    }
];

let transactions = [
    {
        id: 1,
        accountId: 1,
        type: "deposit",
        amount: 100000,
        description: "Initial deposit",
        createdAt: new Date().toISOString()
    }
];

module.exports = {
    users,
    accounts,
    transactions
};