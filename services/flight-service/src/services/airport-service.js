const { AirportRepository } = require('../repository/index');

class AirportService{

    constructor(){
        this.airportRepository = new AirportRepository();
    }

    async add_Airport(data){
        try{
            const airport = await this.airportRepository.add_Airport(data);
            return airport;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async delete_Airport(cityId){
        try{
            const response = await this.airportRepository.delete_Airport(cityId);
            return response;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async update_Airport(Id, data){
        try{
            const airport = await this.airportRepository.update_Airport(Id, data);
            return airport;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async get_Airport(cityId){
        try{
            const airport = await this.airportRepository.get_Airport(cityId);
            return airport;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async all_Airport(filter){
        try{
            const airports = await this.airportRepository.all_Airport({name: filter.name});
            return airports;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

}

module.exports = AirportService;

