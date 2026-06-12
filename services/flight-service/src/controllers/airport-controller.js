const { AirportService } = require('../services/index');
const { SuccessCodes } = require('../utils/error-codes');
const { sendError, sendSuccess } = require('../utils/http-responses');

const airportService = new AirportService();

const add = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.CREATED,
            await airportService.add_Airport(req.body),
            'Successfully added an airport'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to add an airport');
    }
};

const destroy = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await airportService.delete_Airport(req.params.id),
            'Successfully deleted an airport'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to delete the airport');
    }
};

const update = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await airportService.update_Airport(req.params.id, req.body),
            'Successfully updated an airport'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to update the airport');
    }
};

const get = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await airportService.get_Airport(req.params.id),
            'Successfully fetched an airport'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to get the airport');
    }
};

const all = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await airportService.all_Airport(req.query),
            'Successfully fetched airports'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to fetch airports');
    }
};

module.exports = { add, destroy, update, get, all };
