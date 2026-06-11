const { StatusCodes } = require('http-status-codes');

const validateAuthenticatedUser = (req, res, next) => {
    const userId = Number(req.headers['x-user-id']);

    if(!Number.isInteger(userId) || userId < 1) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            data: {},
            success: false,
            message: 'Authentication is required',
            err: 'A valid authenticated user id is required'
        });
    }

    req.authenticatedUserId = userId;
    next();
};

const validateCreateBooking = (req, res, next) => {
    const flightId = Number(req.body.flightId);
    const noOfSeats = Number(req.body.noOfSeats);

    if(
        !Number.isInteger(flightId) ||
        flightId < 1 ||
        !Number.isInteger(noOfSeats) ||
        noOfSeats < 1 ||
        noOfSeats > 9
    ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            data: {},
            success: false,
            message: 'Invalid booking request',
            err: 'flightId must be a positive integer and noOfSeats must be between 1 and 9'
        });
    }

    req.body.flightId = flightId;
    req.body.noOfSeats = noOfSeats;
    next();
};

module.exports = {
    validateAuthenticatedUser,
    validateCreateBooking
};
