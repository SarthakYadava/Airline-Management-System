const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

if(process.env.NODE_ENV === 'production' && !process.env.JWT_KEY) {
    throw new Error('JWT_KEY is required in production');
}

module.exports = {
    PORT: process.env.PORT || 3001,
    SALT: bcrypt.genSaltSync(10),
    JWT_KEY: process.env.JWT_KEY
}
