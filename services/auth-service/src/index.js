const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/ServerConfig');
const apiRoutes = require('./routes/index');

const db = require('./models/index');
// const { User, Role } = require('./models/index');

const app = express();

const prepareAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/health', async (req, res) => {
        try {
            await db.sequelize.authenticate();
            return res.status(200).json({ service: 'auth-service', status: 'ok' });
        }
        catch (error) {
            return res.status(503).json({ service: 'auth-service', status: 'unavailable' });
        }
    });

    app.use('/api', apiRoutes);
    
    app.listen(PORT, async () => {
        console.log(`Server Started on Port: ${PORT}`); 

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter: true});
        }

        // const u1 = await User.findByPk(4);
        // const r1 = await Role.findByPk(1);
        // u1.addRole(r1) //role to user in table
    });
}

prepareAndStartServer();
