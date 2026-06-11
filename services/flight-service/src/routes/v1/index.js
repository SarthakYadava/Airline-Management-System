const express = require('express');

const { FlightMiddlewares } = require('../../middlewares/index');

const CityController = require('../../controllers/city-controller');
const AirportController = require('../../controllers/airport-controller');
const AirplaneController = require('../../controllers/airplane-controller');
const FlightController = require('../../controllers/flight-controller');

const router = express.Router();

//city
router.post('/city', CityController.create);
router.delete('/city/:id', CityController.destroy);
router.get('/city/:id', CityController.get);
router.get('/city', CityController.allcities);
router.patch('/city/:id', CityController.update);

//airport
router.post('/airport', AirportController.add);
router.delete('/airport/:id', AirportController.destroy);
router.get('/airport/:id', AirportController.get);
router.get('/airport', AirportController.all);
router.patch('/airport/:id', AirportController.update);

//airplane
router.post('/airplane', AirplaneController.add);
router.delete('/airplane/:id', AirplaneController.destroy);
router.get('/airplane/:id', AirplaneController.get);
router.get('/airplane', AirplaneController.all);
router.patch('/airplane/:id', AirplaneController.update);

//flight
router.post('/flight', FlightMiddlewares.validate_add, FlightController.add);
router.delete('/flight/:id', FlightController.destroy);
router.get('/flight/:id', FlightController.get);
router.get('/flight', FlightController.all);
router.patch('/flight/:id/seats', FlightMiddlewares.validate_seat_inventory, FlightController.changeSeatInventory);
router.patch('/flight/:id', FlightMiddlewares.validate_update, FlightController.update);

module.exports = router;
