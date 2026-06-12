const { FlightService } = require('../services/index');
const { SuccessCodes } = require('../utils/error-codes');
const {
    sendError,
    sendSuccess
} = require('../utils/http-responses');

const flightService = new FlightService();

const add = async (req, res) => {
    try {
        const flight = await flightService.add_Flight({
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            arrivalTime: req.body.arrivalTime,
            departureTime: req.body.departureTime,
            price: req.body.price
        });
        return sendSuccess(res, SuccessCodes.CREATED, flight, 'Successfully added a flight');
    }
    catch (error) {
        return sendError(res, error, 'Not able to add a flight');
    }
};

const destroy = async (req, res) => {
    try {
        const response = await flightService.delete_Flight(req.params.id);
        return sendSuccess(res, SuccessCodes.OK, response, 'Successfully deleted a flight');
    }
    catch (error) {
        return sendError(res, error, 'Not able to delete the flight');
    }
};

const update = async (req, res) => {
    try {
        const response = await flightService.update_Flight(req.params.id, req.body);
        return sendSuccess(res, SuccessCodes.OK, response, 'Successfully updated a flight');
    }
    catch (error) {
        return sendError(res, error, 'Not able to update the flight');
    }
};

const changeSeatInventory = async (req, res) => {
    try {
        const response = await flightService.changeSeatInventory(
            req.params.id,
            req.body.action,
            req.body.seats
        );
        const message = req.body.action === 'reserve'
            ? 'Successfully reserved seats'
            : 'Successfully released seats';
        return sendSuccess(res, SuccessCodes.OK, response, message);
    }
    catch (error) {
        return sendError(res, error, 'Not able to update seat inventory');
    }
};

const get = async (req, res) => {
    try {
        const response = await flightService.get_Flight(req.params.id);
        return sendSuccess(res, SuccessCodes.OK, response, 'Successfully fetched a flight');
    }
    catch (error) {
        return sendError(res, error, 'Not able to get the flight');
    }
};

const all = async (req, res) => {
    try {
        const response = await flightService.all_Flights(req.flightQuery);
        return sendSuccess(
            res,
            SuccessCodes.OK,
            response.flights,
            'Successfully fetched flights',
            { pagination: response.pagination }
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to fetch flights');
    }
};

module.exports = {
    add,
    destroy,
    update,
    changeSeatInventory,
    get,
    all
};
