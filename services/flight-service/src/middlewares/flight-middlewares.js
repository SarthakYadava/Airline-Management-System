const { ClientErrorCodes } = require('../utils/error-codes');

const validate_add = (req, res, next) => {
    if(
        !req.body.flightNumber ||
        !req.body.airplaneId ||
        !req.body.departureAirportId ||
        !req.body.arrivalAirportId ||
        !req.body.arrivalTime ||
        !req.body.departureTime ||
        !req.body.price
    ) {
        //if any of the body params is missing we come inside the if
        return res.status(ClientErrorCodes.BAD_REQUEST).json({
            data: {},
            success: false,
            message: 'Invalid request body for create flight',
            err: 'Missing mandatory properties to create a flight'  
        });

    }

    next();
}

const validate_update = (req, res, next) => {
    if(req.body.flightNumber) {
        //if flightNumber passed should throw an error
        return res.status(ClientErrorCodes.BAD_REQUEST).json({
            data: {},
            success: false,
            message: 'Invalid request body for updating the flight',
            err: 'flightNumber cannot be updated'  
        });

    }

    next();
}

module.exports = {
    validate_add,
    validate_update
}