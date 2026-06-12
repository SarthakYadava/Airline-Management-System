const { AirplaneRepository } = require('../repository/index');
const { createHttpError } = require('../utils/http-responses');

class AirplaneService {
    constructor({ airplaneRepository = new AirplaneRepository() } = {}) {
        this.airplaneRepository = airplaneRepository;
    }

    async add_Airplane(data) {
        return this.airplaneRepository.add_Airplane(data);
    }

    async delete_Airplane(id) {
        const deleted = await this.airplaneRepository.delete_Airplane(id);
        if(!deleted) throw createHttpError(404, 'Aircraft not found');
        return true;
    }

    async update_Airplane(id, data) {
        const airplane = await this.airplaneRepository.update_Airplane(id, data);
        if(!airplane) throw createHttpError(404, 'Aircraft not found');
        return airplane;
    }

    async get_Airplane(id) {
        const airplane = await this.airplaneRepository.get_Airplane(id);
        if(!airplane) throw createHttpError(404, 'Aircraft not found');
        return airplane;
    }

    async all_Airplane(filter) {
        return this.airplaneRepository.all_Airplane({ modelNumber: filter.modelNumber });
    }
}

module.exports = AirplaneService;
