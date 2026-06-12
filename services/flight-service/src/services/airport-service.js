const { AirportRepository } = require('../repository/index');
const { createHttpError } = require('../utils/http-responses');

class AirportService {
    constructor({ airportRepository = new AirportRepository() } = {}) {
        this.airportRepository = airportRepository;
    }

    async add_Airport(data) {
        return this.airportRepository.add_Airport(data);
    }

    async delete_Airport(id) {
        const deleted = await this.airportRepository.delete_Airport(id);
        if(!deleted) throw createHttpError(404, 'Airport not found');
        return true;
    }

    async update_Airport(id, data) {
        const airport = await this.airportRepository.update_Airport(id, data);
        if(!airport) throw createHttpError(404, 'Airport not found');
        return airport;
    }

    async get_Airport(id) {
        const airport = await this.airportRepository.get_Airport(id);
        if(!airport) throw createHttpError(404, 'Airport not found');
        return airport;
    }

    async all_Airport(filter) {
        return this.airportRepository.all_Airport({ name: filter.name });
    }
}

module.exports = AirportService;
