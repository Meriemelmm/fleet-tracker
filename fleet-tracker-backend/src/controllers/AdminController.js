import { response } from 'express';
import AdminService from '../service/AdminService.js'
import EmailService from '../service/EmailService.js';
class AdminController {
    createChauffeur = async (req, res) => {
        try {
            const data = req.body;

            const { user: Chauffeur, tempPassword } = await AdminService.createChauffeur(data);
            console.log("temp", tempPassword);
            await EmailService.sendChauffeurWelcomeEmail({
                name: Chauffeur.name,
                email: Chauffeur.email,
                tempPassword: tempPassword
            });

            return res.status(201).json({
                succes: true,
                message: "Chauffeur created",
                data: {
                    name: Chauffeur.name,
                    email: Chauffeur.email,
                    role: Chauffeur.role
                }
            });
        } catch (error) {
            return res.status(500).json({
                succes: false,
                message: "Server Error",
                error: error.message
            });
        }
    };
    getAllChauffeurs = async (req, res, next) => {
        try {
            const { page = 1, limit = 10 } = req.query;

            const result = await AdminService.getAllChauffeurs(page, limit);

            if (result.chauffeurs.length === 0) {
                return res.status(404).json({
                    succes: false,
                    message: "No Chauffeurs found"
                });
            }

            return res.status(200).json({
                succes: true,
                message: "Liste des Chauffeurs",
                data: result.chauffeurs,
                pagination: result.pagination
            });

        } catch (error) {
            return res.status(500).json({
                succes: false,
                message: "Server Error",
                error: error.message
            });
        }
    }

    deleteChauffeur = async (req, res, next) => {
        const id = req.params.id;
        const Chauffeur = await AdminService.deleteChauffeur(id);
        if (!Chauffeur) {
            res.status(404).json({
                succes: false,
                message: "Chauffeur not found"
            })
        }
        res.status(200).json({
            succes: true,
            message: "Chauffeur deleted",


        })

    }




}
export default new AdminController();