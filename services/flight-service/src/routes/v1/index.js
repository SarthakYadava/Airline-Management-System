const express = require('express');

const { FlightMiddlewares, ManagementMiddlewares } = require('../../middlewares/index');

const CityController = require('../../controllers/city-controller');
const AirportController = require('../../controllers/airport-controller');
const AirplaneController = require('../../controllers/airplane-controller');
const FlightController = require('../../controllers/flight-controller');

const router = express.Router();

//city
router.post('/city', ManagementMiddlewares.validateCity, CityController.create);
router.delete('/city/:id', ManagementMiddlewares.validateResourceId, CityController.destroy);
router.get('/city/:id', ManagementMiddlewares.validateResourceId, CityController.get);
router.get('/city', CityController.allcities);
router.patch('/city/:id', ManagementMiddlewares.validateResourceId, ManagementMiddlewares.validateCity, CityController.update);

//airport
router.post('/airport', ManagementMiddlewares.validateAirport, AirportController.add);
router.delete('/airport/:id', ManagementMiddlewares.validateResourceId, AirportController.destroy);
router.get('/airport/:id', ManagementMiddlewares.validateResourceId, AirportController.get);
router.get('/airport', AirportController.all);
router.patch('/airport/:id', ManagementMiddlewares.validateResourceId, ManagementMiddlewares.validateAirport, AirportController.update);

//airplane
router.post('/airplane', ManagementMiddlewares.validateAirplane, AirplaneController.add);
router.delete('/airplane/:id', ManagementMiddlewares.validateResourceId, AirplaneController.destroy);
router.get('/airplane/:id', ManagementMiddlewares.validateResourceId, AirplaneController.get);
router.get('/airplane', AirplaneController.all);
router.patch('/airplane/:id', ManagementMiddlewares.validateResourceId, ManagementMiddlewares.validateAirplane, AirplaneController.update);

//flight
router.post('/flight', FlightMiddlewares.validate_add, FlightController.add);
router.delete('/flight/:id', FlightController.destroy);
router.get('/flight/:id', FlightController.get);
router.get('/flight', FlightMiddlewares.validate_list, FlightController.all);
router.patch('/flight/:id/seats', FlightMiddlewares.validate_seat_inventory, FlightController.changeSeatInventory);
router.patch('/flight/:id', FlightMiddlewares.validate_update, FlightController.update);

module.exports = router;
