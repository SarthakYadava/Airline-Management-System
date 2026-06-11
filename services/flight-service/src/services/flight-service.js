const { FlightRepository, AirplaneRepository } = require('../repository/index');
const { compareTime } = require('../utils/helper');

class FlightService{

    constructor({
        airplaneRepository = new AirplaneRepository(),
        flightRepository = new FlightRepository()
    } = {}){
        this.airplaneRepository = airplaneRepository;
        this.flightRepository = flightRepository;
    }

    async add_Flight(data){
        try {
            if(!compareTime(data.arrivalTime, data.departureTime)){
                throw {error: 'Arrival Time cannot be less than Departure Time'}
            }
            const airplane = await this.airplaneRepository.get_Airplane(data.airplaneId);
            const flight = await this.flightRepository.add_Flight({
                ...data, totalSeats: airplane.capacity
            })
            return flight;
        } 
        catch (error) {
            console.log("Something went wrong at service layer");
            throw{error};
        }
    }

    async delete_Flight(Id){
        try{
            const response = await this.flightRepository.delete_Flight(Id);
            return response;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async update_Flight(Id, data){
        try{
            const response = await this.flightRepository.update_Flight(Id, data);
            return response;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async changeSeatInventory(Id, action, seatCount) {
        const result = action === 'reserve'
            ? await this.flightRepository.reserveSeats(Id, seatCount)
            : await this.flightRepository.releaseSeats(Id, seatCount);

        if(result.status === 'not_found') {
            const error = new Error('Flight not found');
            error.statusCode = 404;
            throw error;
        }
        if(result.status === 'insufficient') {
            const error = new Error('Insufficient seats');
            error.statusCode = 409;
            throw error;
        }

        return result.flight;
    }

    async get_Flight(Id){
        try{
            const flight = await this.flightRepository.get_Flight(Id);
            return flight;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async all_Flights(data){
        try {
            const flights = await this.flightRepository.all_Flights(data);
            return flights;
        } 
        catch (error) {
            console.log("Something went wrong at service layer");
            throw{error};
        }
    }

}

module.exports = FlightService;
