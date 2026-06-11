const { Op } = require('sequelize');
const { City } = require('../models/index');

/**
 * All of this syntax is written in sequelize ORM documentation.
 * Just go in the documention and can see how to create, delete, etc.
 * you'll find everything in the documentation like how to write sequelize code in js. 
 */

class CityRepository{

    async createCity({ name }){ 

        /**
         * //{ name } , this is the syntax of object destructuring, it is equivalent to "name" : "person1"
         * so instead of writing obj.name we could write { name }, if we have multiple obj we can write it like this,
         * { name, address, id }
         */
        try{
            const city = await City.create({ name }); //{ name } similer to writing { name : name } ,key value pair
            return city;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async deleteCity(cityId){
        try{
            await City.destroy({
                where: { //where cluase
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

    async updateCity(cityId, data){
        try{
            // const city = await City.update(data, {
            //     where: {
            //         id: cityId
            //     }
            // });

            //for getting updated data in mysql we use the below approach else above is also fine,
            const city = await City.findByPk(cityId);
            city.name = data.name;
            await city.save();
            return city; 
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async getCity(cityId){
        try{
            const city = await City.findByPk(cityId); //findByPk = find by primary key, all in the sequelize documentation
            return city;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async allCity(filter){ //filter can be empty as well
        try{
            if(filter.name){
                const cities = await City.findAll({
                    where: {
                        name: {
                            [Op.startsWith]: filter.name
                        }
                    }
                });
                return cities;
            }

            const cities = await City.findAll(); 
            return cities;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

}

module.exports = CityRepository;