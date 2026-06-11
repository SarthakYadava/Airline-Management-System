const { AirportService } = require('../services/index');
const { SuccessCodes } = require('../utils/error-codes');


const airportService = new AirportService();

const add = async (req, res) => {
    try {
        const airportRquestBody = {
            name: req.body.name,
            address: req.body.address,
            cityId: req.body.cityId
        }

        const airport = await airportService.add_Airport(req.airportRquestBody);
        return res.status(SuccessCodes.CREATED).json({
            data: airport, 
            success: true,
            message: "Successfully added an Airport",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to add a Airport",
            err: error
        });
    }
}

//DELETE method -> url ->  /airport/:id
const destroy = async (req, res) => {
    try {
        const response = await airportService.delete_Airport(req.params.id);
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully deleted an airport",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to delete the airport",
            err: error
        });
    }
}

//PATCH method -> url -> /airport/:id
const update = async (req, res) => {
    try {
        const response = await airportService.update_Airport(req.params.id, {
            name: req.body.name, 
            address: req.body.address,
            cityId: req.body.cityId
        }); //id -> req.params.id, data -> req.body
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully updated an airport",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to update an airport",
            err: error
        });
    }
}

//GET method -> url -> /airport/:id
const get = async (req, res) => {
    try {
        const response = await airportService.get_Airport(req.params.id);
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully fetched an airport",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to get an airport",
            err: error
        });
    }
}

const all = async (req, res) => {
    try {
        const airport = await airportService.all_Airport(req.query);
        return res.status(SuccessCodes.OK).json({
            data: airport,
            success: true,
            message: "Successfully fetched all airport",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to fetch the airport",
            err: error
        });
    }
}

module.exports = {
    add,
    destroy,
    update,
    get,
    all
}