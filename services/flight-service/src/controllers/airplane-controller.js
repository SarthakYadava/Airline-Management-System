const { AirplaneService } = require('../services/index');
const { SuccessCodes } = require('../utils/error-codes');

const airplaneService = new AirplaneService();

const add = async (req, res) => {
    try {
        const airplaneRquestBody = {
            modelNumber: req.body.modelNumber,
            capacity: req.body.capacity
        }

        const airplane = await airplaneService.add_Airplane(airplaneRquestBody);
        return res.status(SuccessCodes.CREATED).json({
            data: airplane, 
            success: true,
            message: "Successfully added an Airplane",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to add a Airplane",
            err: error
        });
    }
}

//DELETE method -> url ->  /airplane/:id
const destroy = async (req, res) => {
    try {
        const response = await airplaneService.delete_Airplane(req.params.id);
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully deleted an Airplane",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to delete the Airplane",
            err: error
        });
    }
}

//PATCH method -> url -> /airplane/:id
const update = async (req, res) => {
    try {
        const response = await airplaneService.update_Airplane(req.params.id, {
            modelNumber: req.body.modelNumber, 
            capacity: req.body.capacity
        }); //id -> req.params.id, data -> req.body
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully updated an Airplane",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to update an Airplane",
            err: error
        });
    }
}

//GET method -> url -> /airplane/:id
const get = async (req, res) => {
    try {
        const response = await airplaneService.get_Airplane(req.params.id);
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully fetched an Airplane",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to get an Airplane",
            err: error
        });
    }
}

const all = async (req, res) => {
    try {
        const airplane = await airplaneService.all_Airplane(req.query);
        return res.status(SuccessCodes.OK).json({
            data: airplane,
            success: true,
            message: "Successfully fetched all Airplane",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to fetch the Airplane",
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