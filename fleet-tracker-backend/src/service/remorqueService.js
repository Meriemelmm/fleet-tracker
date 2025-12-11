import Remorque from '../models/Remorque.js';

class RemorqueService {

    async createRemorque(data) {
        const remorque = new Remorque(data);
        return await remorque.save();
    }

   async getAllRemorques(page = 1, limit = 10) {
   
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

  
    const total = await Remorque.countDocuments({ deletedAt: null });

  
    const remorques = await Remorque.find({ deletedAt: null })
        .skip(skip)
        .limit(limit);

    return {
        remorques,
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


    async getRemorqueById(id) {
        return await Remorque.findOne({ _id: id, deletedAt: null });
    }

    async updateRemorque(id, data) {
        return await Remorque.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
    }

    async deleteRemorque(id) {
        return await Remorque.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
        );
    }

}

export default new RemorqueService();
