const { Flights } = require('../models/index');
const { Op } = require('sequelize');

class FlightRepository{

    #Filters (data) { //private member - function
        let filter = {};
        if(data.arrivalAirportId) {
            filter.arrivalAirportId = data.arrivalAirportId;
        }
        if(data.departureAirportId) {
            filter.departureAirportId = data.departureAirportId;
        }
        // if(data.minPrice) { //it will handle only gte case
        //     Object.assign(filter, {price: {[Op.gte]: data.minPrice}}); //gte = greater than or equal to
        // }
        // if(data.maxPrice) { //it will handle only lte case
        //     Object.assign(filter, {price: {[Op.lte]: data.maxPrice}}); //lte = less than or equal to
        // } if call both in query the latest will override the previous like maxPrice is latest will override minPrice everytime in queryif put both together

        // if(data.minPrice && data.maxPrice){ //it will handle all the case, lte, gte, between, etc. but it's not the perfect method, it will stuck in some edge cases
        //     Object.assign(filter, {
        //         [Op.and]: [
        //             { price: {[Op.lte]: data.maxPrice} },
        //             { price: {[Op.gte]: data.minPrice} }
        //         ]
        //     });
        // }

        //below will work fine in every case
        let priceFilter = [];
        if(data.minPrice) {
            priceFilter.push({price: {[Op.gte]: data.minPrice}});
        }
        if(data.maxPrice) {
            priceFilter.push({price: {[Op.lte]: data.maxPrice}});
        }
        Object.assign(filter, {[Op.and]: priceFilter});

        return filter;
    }

    async add_Flight(data){
        try {
            const flight = await Flights.create(data);
            return flight;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async delete_Flight(Id){
        try{
            await Flights.destroy({
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

    async update_Flight(Id, data){
        try{
            await Flights.update(data, {
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

    async get_Flight(Id){
        try{
            const flight = await Flights.findByPk(Id);
            return flight;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    async all_Flights(filter){
        try{
            const filterObject = this.#Filters(filter);
            const flight = await Flights.findAll({
                where: filterObject
            });
            return flight;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }
}

module.exports = FlightRepository;

/*
this is how or where is going to look like of all_Flights,
{
    where: {
        arrivalAirportId: 2,
        departureAirportId: 4,
        price: {[Op.gte]: 4000}
    }
}
*/