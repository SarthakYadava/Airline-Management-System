const { Op } = require('sequelize');
const { Airport } = require('../models/index')

class AirportRepository{

    async add_Airport(data){
        try{
            const airport = await Airport.create(data);
            return airport;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async delete_Airport(cityId){
        try{
            await Airport.destroy({
                where: { 
                    id: cityId
                }
            });
            return true;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async update_Airport(Id, data){
        try{
            const airport = await Airport.findByPk(Id);
            airport.name = data.name;
            airport.address = data.address;
            airport.cityId = data.cityId;
            await airport.save();
            return airport; 
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async get_Airport(cityId){
        try{
            const airport = await Airport.findByPk(cityId); 
            return airport;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async all_Airport(filter){ 
        try{
            if(filter.name){
                const airport = await Airport.findAll({
                    where: {
                        name: {
                            [Op.startsWith]: filter.name
                        }
                    }
                });
                return airport;
            }

            const airport = await Airport.findAll(); 
            return airport;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

}

module.exports = AirportRepository;
