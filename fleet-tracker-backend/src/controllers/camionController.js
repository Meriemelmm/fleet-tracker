import CamionService from "../service/camionService.js";

class CamionController {

    createCamion = async (req, res) => {
        try {
            const camion = await CamionService.createCamion(req.body);

            return res.status(201).json({
                success: true,
                message: "Camion créé avec succès",
                data: camion
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message
            });
        }
    };


  getAllCamions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; 
        const result = await CamionService.getAllCamions(page, limit);

        if (result.camions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucun camion trouvé"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Liste des camions récupérée avec succès",
            data: result.camions,
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



    getCamion = async (req, res) => {
        try {
            const camion = await CamionService.getCamion(req.params.id);

            if (!camion) {
                return res.status(404).json({
                    success: false,
                    message: "Camion non trouvé"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Camion récupéré avec succès",
                data: camion
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message
            });
        }
    };


    updateCamion = async (req, res) => {
        try {
            const camion = await CamionService.updateCamion(req.params.id, req.body);

            if (!camion) {
                return res.status(404).json({
                    success: false,
                    message: "Camion non trouvé"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Camion modifié avec succès",
                data: camion
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message
            });
        }
    };


    deleteCamion = async (req, res) => {
        try {
            const camion = await CamionService.deleteCamion(req.params.id);

            if (!camion) {
                return res.status(404).json({
                    success: false,
                    message: "Camion non trouvé"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Camion supprimé avec succès",
                data: camion
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

export default new CamionController();
