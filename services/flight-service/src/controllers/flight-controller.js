const { FlightService } = require('../services/index');
const { SuccessCodes } = require('../utils/error-codes');

const flightService = new FlightService();

const add = async (req, res) => {
    try {
        const flightRequestData = {
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            arrivalTime: req.body.arrivalTime,
            departureTime: req.body.departureTime,
            price: req.body.price
        }

        const flight = await flightService.add_Flight(flightRequestData);
        return res.status(SuccessCodes.CREATED).json({
            data: flight, 
            success: true,
            message: "Successfully added an Flight",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to add a Flight",
            err: error
        });
    }
}

//DELETE method -> url ->  /flight/:id
const destroy = async (req, res) => {
    try {
        const response = await flightService.delete_Flight(req.params.id);
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully deleted a Flight",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to delete the Flight",
            err: error
        });
    }
}

//PATCH method -> url -> /flight/:id
const update = async (req, res) => {
    try {
        const response = await flightService.update_Flight(req.params.id, req.body); //id -> req.params.id, data -> req.body
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully updated a flight",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to update a flight",
            err: error
        });
    }
}

//GET method -> url -> /flight/:id
const get = async (req, res) => {
    try {
        const response = await flightService.get_Flight(req.params.id);
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            message: "Successfully fetched a Flight",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to get a Flight",
            err: error
        });
    }
}

const all = async (req, res)  => {
    try {
        const response = await flightService.all_Flights(req.query);
        return res.status(SuccessCodes.OK).json({
            data: response, 
            success: true,
            message: "Successfully fetched the Flights",
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to fetch the Flights",
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