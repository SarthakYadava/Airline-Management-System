const express = require('express');
const bodyParser = require('body-parser');

const {PORT} = require('./config/serverconfig');
const ApiRoutes = require('./routes/index');
const db = require('./models/index');

const setupAndStartServer = async () => {
    //create the express object
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/health', async (req, res) => {
        try {
            await db.sequelize.authenticate();
            return res.status(200).json({ service: 'flight-service', status: 'ok' });
        }
        catch (error) {
            return res.status(503).json({ service: 'flight-service', status: 'unavailable' });
        }
    });

    app.use('/api', ApiRoutes);

    app.listen(PORT, async () => {
        console.log(`Server started at ${PORT}`);
    });
};

setupAndStartServer()
