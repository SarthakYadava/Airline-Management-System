const { AirplaneRepository } = require('../repository/index');

class AirplaneService{

    constructor(){
        this.airplaneRepository = new AirplaneRepository();
    }

    async add_Airplane(data){ 
        try{
            const airplane = await this.airplaneRepository.add_Airplane(data);
            return airplane;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async delete_Airplane(Id){
        try{
            const response = await this.airplaneRepository.delete_Airplane(Id);
            return response;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async update_Airplane(Id, data){
        try{
            const airplane = await this.airplaneRepository.update_Airplane(Id, data);
            return airplane;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async get_Airplane(Id){
        try{
            const airplane = await this.airplaneRepository.get_Airplane(Id);
            return airplane;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async all_Airplane(filter){
        try{
            const airplane = await this.airplaneRepository.all_Airplane({modelNumber: filter.modelNumber});
            return airplane;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

}

module.exports = AirplaneService;

