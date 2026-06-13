const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { PORT } = require('./config/serverConfig');
const db = require('./models/index');

const { setupJobs } = require('./utils/job');
const { isEmailConfigured } = require('./config/emailConfig');
const ticketController = require('./controllers/ticket-controller');
const { subscribeMessage, createChannel } = require('./utils/messageQueue');
const { REMINDER_BINDING_KEY, BROKER_RETRY_MS } = require('./config/serverConfig');
const EmailService = require('./services/email-service');

const setupAndStartServer = async () => {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/health', async (req, res) => {
        try {
            await db.sequelize.authenticate();
            return res.status(200).json({
                service: 'notification-service',
                status: 'ok',
                emailDelivery: isEmailConfigured ? 'configured' : 'disabled'
            });
        }
        catch (error) {
            return res.status(503).json({ service: 'notification-service', status: 'unavailable' });
        }
    });

    app.post('/api/v1/ticket', ticketController.create);

    app.listen(PORT, () => {
        console.log(`Server Started on Port ${PORT}`);
    });

    const connectToBroker = async () => {
        try {
            const channel = await createChannel();
            await subscribeMessage(channel, EmailService.subscribeEvents, REMINDER_BINDING_KEY);
            console.log('Notification service connected to message broker');
        }
        catch (error) {
            console.error(`Message broker unavailable, retrying in ${BROKER_RETRY_MS}ms`);
            setTimeout(connectToBroker, BROKER_RETRY_MS);
        }
    };

    connectToBroker();
    setupJobs();
}

setupAndStartServer()
