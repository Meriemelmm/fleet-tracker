import remorqueService from "../service/remorqueService.js";

class RemorqueController {

    createRemorque = async (req, res) => {
        try {
            const remorque = await remorqueService.createRemorque(req.body);

            return res.status(201).json({
                success: true,
                message: "Remorque créée avec succès",
                data: remorque
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message
            });
        }
    };


 getAllRemorques = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; 
        const result = await remorqueService.getAllRemorques(page, limit);

        if (result.remorques.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucune remorque trouvée"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Liste des remorques récupérée",
            data: result.remorques,
            pagination: result.pagination
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
}


    getRemorqueById = async (req, res) => {
        try {
            const remorque = await remorqueService.getRemorqueById(req.params.id);

            if (!remorque) {
                return res.status(404).json({
                    success: false,
                    message: "Remorque non trouvée"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Remorque récupérée avec succès",
                data: remorque
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message
            });
        }
    };


    updateRemorque = async (req, res) => {
        try {
            const remorque = await remorqueService.updateRemorque(
                req.params.id,
                req.body
            );

            if (!remorque) {
                return res.status(404).json({
                    success: false,
                    message: "Remorque non trouvée"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Remorque modifiée avec succès",
                data: remorque
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message
            });
        }
    };


    deleteRemorque = async (req, res) => {
        try {
            const remorque = await remorqueService.deleteRemorque(req.params.id);

            if (!remorque) {
                return res.status(404).json({
                    success: false,
                    message: "Remorque non trouvée"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Remorque supprimée avec succès",
                data: remorque
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message
            });
        }
    };

}

export default new RemorqueController();
