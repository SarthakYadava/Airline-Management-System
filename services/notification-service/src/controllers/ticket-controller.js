const TicketService = require('../services/email-service');

const create = async (req, res) => {
    try {
        const response = await TicketService.createNotifications(req.body);
        return res.status(201).json({
            data: response,
            message: 'Successfully registered an email reminder',
            success: true,
            err: {}
        });
    } 
    catch (error) {
        return res.status(201).json({
            data: {},
            message: 'unable to register an email reminder',
            success: true,
            err: error
        });
                
    }
}

module.exports = {
    create
}