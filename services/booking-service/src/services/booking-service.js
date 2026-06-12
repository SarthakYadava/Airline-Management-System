const axios = require('axios');

const { BookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_PATH, INTERNAL_SERVICE_TOKEN } = require('../config/ServerConfig');
const { ServiceError } = require('../utils/errors');
const { publishBookingConfirmation } = require('../utils/booking-events');

class BookingService{

    constructor({
        bookingRepository = new BookingRepository(),
        flightClient = axios,
        flightServicePath = FLIGHT_SERVICE_PATH,
        eventPublisher = publishBookingConfirmation
    } = {}){
        this.bookingRepository = bookingRepository;
        this.flightClient = flightClient;
        this.flightServicePath = flightServicePath;
        this.eventPublisher = eventPublisher;
    }

    async createBooking(data){
        const seatInventoryURL = `${this.flightServicePath}/api/v1/flight/${data.flightId}/seats`;
        const { userEmail, ...bookingData } = data;
        const requestConfig = {
            headers: {
                'x-internal-service-token': INTERNAL_SERVICE_TOKEN
            }
        };
        let seatsReserved = false;
        try {
            const response = await this.flightClient.patch(seatInventoryURL, {
                action: 'reserve',
                seats: data.noOfSeats
            }, requestConfig);
            seatsReserved = true;
            const flightData = response.data.data;
            const priceOfTheFlight = flightData.price;
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const booking = await this.bookingRepository.create({
                ...bookingData,
                totalCost,
                status: 'Booked'
            });
            if(userEmail) {
                try {
                    await this.eventPublisher(booking, userEmail);
                }
                catch (eventError) {
                    console.error(
                        'Booking completed but notification event could not be published',
                        eventError.message
                    );
                }
            }
            return booking;
        } 
        catch (error) {
            if(seatsReserved) {
                try {
                    await this.flightClient.patch(seatInventoryURL, {
                        action: 'release',
                        seats: data.noOfSeats
                    }, requestConfig);
                }
                catch (releaseError) {
                    console.error('Unable to release reserved seats', releaseError.message);
                }
            }
            if(['RepositoryError', 'ValidationError', 'ServiceError'].includes(error.name)){
                throw error;
            }
            if(error.response) {
                throw new ServiceError(
                    error.response.data?.message || 'Unable to reserve seats',
                    error.response.data?.err || 'The flight inventory request failed',
                    error.response.status
                );
            }
            throw new ServiceError(
                'Unable to complete booking',
                error.message || 'The booking workflow failed'
            );
        }
    }

    async getBookings(userId) {
        return this.bookingRepository.getByUser(userId);
    }
}

module.exports = BookingService;
