const { CityService } = require('../services/index');
const { SuccessCodes } = require('../utils/error-codes');

/**
 * POST -> we are going to treat every function as POST written below,
 * data -> Going to fetch tha data using "req.body" 
 */

const cityService = new CityService();

const create = async (req, res) => {
    try {
        const city = await cityService.createCity(req.body);
        return res.status(SuccessCodes.CREATED).json({
            data: city,
            success: true,
            message: "Successfully created a city",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to create a city",
            err: error
        });
    }
}

//DELETE method -> url ->  /city/:id, therefore data should be handled by writing req.params.id, since id is getting in request params
const destroy = async (req, res) => {
    try {
        const response = await cityService.deleteCity(req.params.id);
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully deleted a city",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to delete the city",
            err: error
        });
    }
}

//PATCH method -> url -> /city/:id(what city you want to update) -> req.body(city parameters that is to be updated)
const update = async (req, res) => {
    try {
        const response = await cityService.updateCity(req.params.id, req.body); //id -> req.params.id, data -> req.body
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully updated a city",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to update a city",
            err: error
        });
    }
}

//GET method -> url -> /city/:id
const get = async (req, res) => {
    try {
        const response = await cityService.getCity(req.params.id);
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully fetched a city",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to get a city",
            err: error
        });
    }
}

const allcities = async (req, res) => {
    try {
        const cities = await cityService.allCity(req.query);
        return res.status(SuccessCodes.OK).json({
            data: cities,
            success: true,
            message: "Successfully fetched all cities",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to fetch the cities",
            err: error
        });
    }
}

module.exports = {
    create,
    destroy,
    update,
    get,
    allcities
}
