const { FlightRepository, AirplaneRepository } = require('../repository/index');
const { compareTime } = require('../utils/helper');
const { createHttpError } = require('../utils/http-responses');

class FlightService {
    constructor({
        airplaneRepository = new AirplaneRepository(),
        flightRepository = new FlightRepository()
    } = {}) {
        this.airplaneRepository = airplaneRepository;
        this.flightRepository = flightRepository;
    }

    async add_Flight(data) {
        if(!compareTime(data.arrivalTime, data.departureTime)) {
            throw createHttpError(
                400,
                'Arrival time must be after departure time'
            );
        }

        const airplane = await this.airplaneRepository.get_Airplane(data.airplaneId);
        if(!airplane) {
            throw createHttpError(404, 'Airplane not found');
        }

        return this.flightRepository.add_Flight({
            ...data,
            totalSeats: airplane.capacity
        });
    }

    async delete_Flight(Id) {
        const response = await this.flightRepository.delete_Flight(Id);
        if(!response) {
            throw createHttpError(404, 'Flight not found');
        }
        return true;
    }

    async update_Flight(Id, data) {
        const response = await this.flightRepository.update_Flight(Id, data);
        if(!response) {
            throw createHttpError(404, 'Flight not found');
        }
        return true;
    }

    async changeSeatInventory(Id, action, seatCount) {
        const result = action === 'reserve'
            ? await this.flightRepository.reserveSeats(Id, seatCount)
            : await this.flightRepository.releaseSeats(Id, seatCount);

        if(result.status === 'not_found') {
            throw createHttpError(404, 'Flight not found');
        }
        if(result.status === 'insufficient') {
            throw createHttpError(
                409,
                'Insufficient seats',
                'The requested number of seats is not available'
            );
        }

        return result.flight;
    }

    async get_Flight(Id) {
        const flight = await this.flightRepository.get_Flight(Id);
        if(!flight) {
            throw createHttpError(404, 'Flight not found');
        }
        return flight;
    }

    async all_Flights(data) {
        return this.flightRepository.all_Flights(data);
    }
}

module.exports = FlightService;
