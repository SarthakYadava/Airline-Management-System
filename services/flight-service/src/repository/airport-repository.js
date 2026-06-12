const { Op } = require('sequelize');
const { Airport, City } = require('../models/index')

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
            const deletedRows = await Airport.destroy({
                where: { 
                    id: cityId
                }
            });
            return deletedRows > 0;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async update_Airport(Id, data){
        try{
            const airport = await Airport.findByPk(Id);
            if(!airport) return null;
            if(data.code !== undefined) airport.code = data.code;
            airport.name = data.name;
            airport.address = data.address;
            airport.cityId = data.cityId;
            if(data.latitude !== undefined) airport.latitude = data.latitude;
            if(data.longitude !== undefined) airport.longitude = data.longitude;
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
            const airport = await Airport.findByPk(cityId, {
                include: [{ model: City, attributes: ['id', 'name'] }]
            });
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
                    },
                    include: [{ model: City, attributes: ['id', 'name'] }]
                });
                return airport;
            }

            const airport = await Airport.findAll({
                include: [{ model: City, attributes: ['id', 'name'] }]
            });
            return airport;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

}

module.exports = AirportRepository;
