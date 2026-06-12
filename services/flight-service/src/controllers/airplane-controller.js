const { AirplaneService } = require('../services/index');
const { SuccessCodes } = require('../utils/error-codes');
const { sendError, sendSuccess } = require('../utils/http-responses');

const airplaneService = new AirplaneService();

const add = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.CREATED,
            await airplaneService.add_Airplane(req.body),
            'Successfully added an aircraft'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to add an aircraft');
    }
};

const destroy = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await airplaneService.delete_Airplane(req.params.id),
            'Successfully deleted an aircraft'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to delete the aircraft');
    }
};

const update = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await airplaneService.update_Airplane(req.params.id, req.body),
            'Successfully updated an aircraft'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to update the aircraft');
    }
};

const get = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await airplaneService.get_Airplane(req.params.id),
            'Successfully fetched an aircraft'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to get the aircraft');
    }
};

const all = async (req, res) => {
    try {
        return sendSuccess(
            res,
            SuccessCodes.OK,
            await airplaneService.all_Airplane(req.query),
            'Successfully fetched aircraft'
        );
    }
    catch (error) {
        return sendError(res, error, 'Not able to fetch aircraft');
    }
};

module.exports = { add, destroy, update, get, all };
