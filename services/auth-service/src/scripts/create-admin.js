require('dotenv').config();

const { Role, User, sequelize } = require('../models');

const createAdmin = async () => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if(!email || !password || password.length < 8) {
        throw new Error(
            'Set ADMIN_EMAIL and ADMIN_PASSWORD with a password of at least 8 characters'
        );
    }

    const [adminRole] = await Role.findOrCreate({
        where: { name: 'ADMIN' },
        defaults: { name: 'ADMIN' }
    });
    const [customerRole] = await Role.findOrCreate({
        where: { name: 'CUSTOMER' },
        defaults: { name: 'CUSTOMER' }
    });
    const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: { email, password }
    });

    await user.addRoles([adminRole, customerRole]);
    console.log(created ? `Created administrator ${email}` : `Updated administrator ${email}`);
};

createAdmin()
    .then(() => sequelize.close())
    .catch(async (error) => {
        console.error(error.message);
        await sequelize.close();
        process.exitCode = 1;
    });
