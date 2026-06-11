const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const { PORT } = require('./config/ServerConfig');
const apiRoutes = require('./routes/index');
const db = require('./models/index');

const setuptAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/health', async (req, res) => {
        try {
            await db.sequelize.authenticate();
            return res.status(200).json({ service: 'booking-service', status: 'ok' });
        }
        catch (error) {
            return res.status(503).json({ service: 'booking-service', status: 'unavailable' });
        }
    });

    app.use('/api', apiRoutes);

    app.listen(PORT, () =>{
        console.log(`Server started on Port ${PORT} `);

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter: true});
        }
    });
}

setuptAndStartServer();
