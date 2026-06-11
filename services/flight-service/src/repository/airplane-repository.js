const { Op } = require('sequelize');
const { Airplane } = require('../models/index')

class AirplaneRepository{

    async add_Airplane(data){ 
        try{
            const airplane = await Airplane.create(data);
            return airplane;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async delete_Airplane(Id){
        try{
            await Airplane.destroy({
                where: { 
                    id: Id
                }
            });
            return true;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async update_Airplane(Id, data){
        try{
            const airplane = await Airplane.findByPk(Id);
            airplane.modelNumber = data.modelNumber;
            airplane.capacity = data.capacity;
            await airplane.save();
            return airplane; 
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async get_Airplane(Id){
        try{
            const airplane = await Airplane.findByPk(Id); 
            return airplane;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async all_Airplane(filter){ 
        try{
            if(filter.modelNumber){
                const airplane = await Airplane.findAll({
                    where: {
                        modelNumber: {
                            [Op.startsWith]: filter.modelNumber
                        }
                    }
                });
                return airplane;
            }

            const airplane = await Airplane.findAll(); 
            return airplane;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

}

module.exports = AirplaneRepository;