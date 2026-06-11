const { Flights, Airport, Airplane, City } = require('../models/index');
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
        if(data.departureDate) {
            const start = new Date(`${data.departureDate}T00:00:00.000Z`);
            const end = new Date(`${data.departureDate}T23:59:59.999Z`);
            filter.departureTime = { [Op.between]: [start, end] };
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
        if(priceFilter.length) {
            Object.assign(filter, {[Op.and]: priceFilter});
        }

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

    async reserveSeats(Id, seatCount) {
        return Flights.sequelize.transaction(async (transaction) => {
            const flight = await Flights.findByPk(Id, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if(!flight) {
                return { status: 'not_found' };
            }
            if(flight.totalSeats < seatCount) {
                return { status: 'insufficient', flight };
            }

            flight.totalSeats -= seatCount;
            await flight.save({ transaction });
            return { status: 'reserved', flight };
        });
    }

    async releaseSeats(Id, seatCount) {
        return Flights.sequelize.transaction(async (transaction) => {
            const flight = await Flights.findByPk(Id, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if(!flight) {
                return { status: 'not_found' };
            }

            flight.totalSeats += seatCount;
            await flight.save({ transaction });
            return { status: 'released', flight };
        });
    }

    async get_Flight(Id){
        try{
            const flight = await Flights.findByPk(Id, {
                include: this.#Includes()
            });
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
            const sortDirection = filter.sort === 'price_desc' ? 'DESC' : 'ASC';
            const flight = await Flights.findAll({
                where: filterObject,
                include: this.#Includes(),
                order: [[filter.sort?.startsWith('price') ? 'price' : 'departureTime', sortDirection]]
            });
            return flight;
        }
        catch (error){
            console.log("Something went wrong in the repository layer");
            throw {error};
        }
    }

    #Includes() {
        const airportAttributes = ['id', 'code', 'name', 'address', 'latitude', 'longitude'];

        return [
            {
                model: Airport,
                as: 'departureAirport',
                attributes: airportAttributes,
                include: [{ model: City, attributes: ['id', 'name'] }]
            },
            {
                model: Airport,
                as: 'arrivalAirport',
                attributes: airportAttributes,
                include: [{ model: City, attributes: ['id', 'name'] }]
            },
            {
                model: Airplane,
                as: 'airplane',
                attributes: ['id', 'modelNumber', 'capacity']
            }
        ];
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
