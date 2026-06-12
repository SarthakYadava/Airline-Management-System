const { CityService } = require('../services/index');
const { SuccessCodes } = require('../utils/error-codes');
const { sendError, sendSuccess } = require('../utils/http-responses');

const cityService = new CityService();

const create = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.CREATED,
            await cityService.createCity(req.body),
            'Successfully created a city'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to create a city');
    }
};

const destroy = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await cityService.deleteCity(req.params.id),
            'Successfully deleted a city'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to delete the city');
    }
};

const update = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await cityService.updateCity(req.params.id, req.body),
            'Successfully updated a city'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to update the city');
    }
};

const get = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await cityService.getCity(req.params.id),
            'Successfully fetched a city'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to get the city');
    }
};

const allcities = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await cityService.allCity(req.query),
            'Successfully fetched cities'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to fetch cities');
    }
};

module.exports = { create, destroy, update, get, allcities };
