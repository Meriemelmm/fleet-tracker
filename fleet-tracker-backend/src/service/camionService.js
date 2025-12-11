import Camion from "../models/Camion.js";

class CamionService {

    async createCamion(data) {
        const camion = new Camion(data);
        return await camion.save();
    }

    async getAllCamions(page = 1, limit = 10) {
    
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const total = await Camion.countDocuments({ deletedAt: null });

    
    const camions = await Camion.find({ deletedAt: null })
        .skip(skip)
        .limit(limit);

    return {
        camions,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
        }
    };
}


    async getCamion(id) {
        return await Camion.findOne({ _id: id, deletedAt: null });
    }

    async updateCamion(id, data) {
        return await Camion.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
    }

    async deleteCamion(id) {
        return await Camion.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
        );
    }

}

export default new CamionService();
