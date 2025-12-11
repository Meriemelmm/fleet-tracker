
import Camion from '../models/Camion.js';
import Remorque from '../models/Remorque.js';

import Pneu from '../models/Pneu.js'
class PneuService {


    async createPneu(pneu) {
        const { vehiculeType,
            vehiculeId,
            position,
            marque,
            dateInstallation,
            kilometrageInstallation,
            statut } = pneu;
        return await Pneu.create({
            vehiculeType,
            vehiculeId,
            position,
            marque,
            dateInstallation,
            kilometrageInstallation,
            statut
        })
    }
    async AllPneus(page = 1, limit = 10) {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const total = await Pneu.countDocuments({ deletedAt: null });

    const pneus = await Pneu.find({ deletedAt: null })
        .populate('vehiculeId')
        .skip(skip)
        .limit(limit);

    return {
        pneus,
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

    async PneuById(id) {
        return await Pneu.findById(id).populate("vehiculeId");;
    }
    async updatePneu(id, data) {
        return await Pneu.findByIdAndUpdate(id, data, { new: true });

    }
    async deletePneu(id) {
        return await Pneu.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    }
}


export default new PneuService();