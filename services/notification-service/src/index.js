const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { PORT } = require('./config/serverConfig');

const jobs = require('./utils/job');
const ticketController = require('./controllers/ticket-controller');
const { subscribeMessage, createChannel } = require('./utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('./config/serverConfig');
const EmailService = require('./services/email-service');

const setupAndStartServer = async () => {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.post('/api/v1/ticket', ticketController.create);

    const channel = await createChannel();
    subscribeMessage(channel, EmailService.subscribeEvents, REMINDER_BINDING_KEY)

    app.listen(PORT, () => {
        console.log(`Server Started on Port ${PORT}`);

        // jobs();
        
    });
}

setupAndStartServer()