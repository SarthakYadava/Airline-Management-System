const axios = require('axios');

const { BookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/ServerConfig');
const { ServiceError } = require('../utils/errors');

class BookingService{

    constructor({
        bookingRepository = new BookingRepository(),
        flightClient = axios,
        flightServicePath = FLIGHT_SERVICE_PATH
    } = {}){
        this.bookingRepository = bookingRepository;
        this.flightClient = flightClient;
        this.flightServicePath = flightServicePath;
    }

    async createBooking(data){
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${this.flightServicePath}/api/v1/flight/${flightId}`;
            const response = await this.flightClient.get(getFlightRequestURL);
            const flightData = response.data.data;
            const priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError(
                    'Insufficient seats',
                    'The requested number of seats is not available',
                    409
                );
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${this.flightServicePath}/api/v1/flight/${booking.flightId}`;
            await this.flightClient.patch(updateFlightRequestURL, {
                totalSeats: flightData.totalSeats - booking.noOfSeats
            });
            const finalBooking = await this.bookingRepository.update(booking.id, {status: 'Booked'});
            return finalBooking;
        } 
        catch (error) {
            if(['RepositoryError', 'ValidationError', 'ServiceError'].includes(error.name)){
                throw error;
            }
            throw new ServiceError(
                'Unable to complete booking',
                error.message || 'The booking workflow failed'
            );
        }
    }
}

module.exports = BookingService;
