const { StatusCodes } = require('http-status-codes');

const { BookingService } = require('../services/index');

const bookingService = new BookingService();

class BookingController {

    async create (req, res){
        try {
            const response = await bookingService.createBooking({
                ...req.body,
                userId: req.authenticatedUserId,
                userEmail: req.authenticatedUserEmail
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

    async all(req, res) {
        try {
            const response = await bookingService.getBookings(req.authenticatedUserId);
            return res.status(StatusCodes.OK).json({
                data: response,
                message: 'Successfully fetched bookings',
                success: true,
                err: {}
            });
        }
        catch (error) {
            return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
                data: [],
                message: error.message,
                success: false,
                err: error.explanation
            });
        }
    }
}

module.exports = BookingController;
