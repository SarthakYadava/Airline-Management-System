const { CityRepository } = require('../repository/index');
const { createHttpError } = require('../utils/http-responses');

class CityService {
    constructor({ cityRepository = new CityRepository() } = {}) {
        this.cityRepository = cityRepository;
    }

    async createCity(data) {
        return this.cityRepository.createCity(data);
    }

    async deleteCity(cityId) {
        const deleted = await this.cityRepository.deleteCity(cityId);
        if(!deleted) throw createHttpError(404, 'City not found');
        return true;
    }

    async updateCity(cityId, data) {
        const city = await this.cityRepository.updateCity(cityId, data);
        if(!city) throw createHttpError(404, 'City not found');
        return city;
    }

    async getCity(cityId) {
        const city = await this.cityRepository.getCity(cityId);
        if(!city) throw createHttpError(404, 'City not found');
        return city;
    }

    async allCity(filter) {
        return this.cityRepository.allCity({ name: filter.name });
    }
}

module.exports = CityService;
