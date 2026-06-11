const { StatusCodes } = require('http-status-codes');

const { BookingService } = require('../services/index');

const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/ServerConfig');
const bookingService = new BookingService();

class BookingController {

    async sendMessageToQueue(req, res){
        const channel = await createChannel();
        const payload = {
            data: {
                subject: 'This is a notification from queue',
                content: 'Some queue will subscribe this',
                recepientEmail: 'traveler@example.com',
                notificationTime: '2024-09-14T09:25:00' 
            },
            service: 'CREATE_TICKET'
        };
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json({
            message: 'Successfully published the event'
        });
    }

    async create (req, res){
        try {
            const authenticatedUserId = Number(req.headers['x-user-id']);
            const response = await bookingService.createBooking({
                ...req.body,
                userId: authenticatedUserId || req.body.userId
            });
            return res.status(StatusCodes.CREATED).json({
                data: response,
                message: 'Successfully completed booking',
                success: true,
                err: {}
            });    
        } 
        catch (error) {
            console.log(error);
            return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
                data: {},
                message: error.message,
                success: false,
                err: error.explanation
            });
        }
    }
}

module.exports = BookingController;
