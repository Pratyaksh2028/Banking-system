const generateAccountNumber = (nextId) => {
    return "ACC" + String(100000 + nextId);
};

module.exports = generateAccountNumber;