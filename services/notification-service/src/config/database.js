require('dotenv').config();

const createConfig = (database) => ({
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database,
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false
});

module.exports = {
    development: createConfig(process.env.DB_NAME || 'skyroute_notifications'),
    test: createConfig(process.env.DB_TEST_NAME || 'skyroute_notifications_test'),
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false
    }
};

