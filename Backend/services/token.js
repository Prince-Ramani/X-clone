const jwt = require("jsonwebtoken");

const createToken = async (userId) => {
    return jwt.sign({ userId }, process.env.TOKEN_KEY);
}

module.exports = createToken;