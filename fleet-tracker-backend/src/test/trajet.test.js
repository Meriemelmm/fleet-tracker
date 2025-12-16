// Import des modèles (seront remplacés par des mocks)
import Trajet from '../models/Trajet.js';
import Camion from '../models/Camion.js';
import Remorque from '../models/Remorque.js';
import User from '../models/User.js';
// Import du service à tester
import trajetService from '../service/TrajetService.js';

// Mock de tous les modèles
jest.mock('../models/Trajet.js');
jest.mock('../models/Camion.js');
jest.mock('../models/Remorque.js');
jest.mock('../models/User.js');

describe('TrajetService', () => {
 
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialise tous les mocks
  });

  // =====================================================
  // Tests pour createTrajet
  // =====================================================
  describe('createTrajet', () => {

    // Test : création réussie avec remorque
    it('should create trajet successfully with camion and remorque', async () => {
      
      // DONNÉES DE TEST
      const trajetData = {
        camionId: "camion123",
        remorqueId: "remorque456",
        chauffeur: "chauffeur789",
        pointDepart: "Paris",
        pointArrivee: "Lyon",
        dateDepart: new Date("2024-12-20"),
        statut: "À faire"
      };

      const createdTrajet = {
        _id: "trajet123",
        ...trajetData,
        kmDepart: null,
        kmArrivee: null,
        dateArrivee: null,
        remarques: null,
        remarquesChauffeur: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // MOCKS
      // Le chauffeur existe
      User.findById = jest.fn().mockResolvedValue({
        _id: "chauffeur789",
        name: "Jean Dupont",
        email: "jean@example.com"
      });

      // Le camion existe
      Camion.findById = jest.fn().mockResolvedValue({
        _id: "camion123",
        immatriculation: "ABC123"
      });

      // La remorque existe
      Remorque.findById = jest.fn().mockResolvedValue({
        _id: "remorque456",
        immatriculation: "REM456"
      });

      // Création du trajet
      Trajet.create = jest.fn().mockResolvedValue(createdTrajet);

      // EXÉCUTION
      const result = await trajetService.createTrajet(trajetData);

      // VÉRIFICATIONS
      expect(User.findById).toHaveBeenCalledWith("chauffeur789");
      expect(Camion.findById).toHaveBeenCalledWith("camion123");
      expect(Remorque.findById).toHaveBeenCalledWith("remorque456");
      expect(Trajet.create).toHaveBeenCalledWith(trajetData);
      expect(result).toEqual(createdTrajet);
      expect(result.statut).toBe("À faire");
    });

    // Test : création sans remorque (remorque optionnelle)
    it('should create trajet without remorque', async () => {
      const trajetData = {
        camionId: "camion123",
        remorqueId: null, // Pas de remorque
        chauffeur: "chauffeur789",
        pointDepart: "Marseille",
        pointArrivee: "Nice",
        dateDepart: new Date("2024-12-21"),
        statut: "À faire"
      };

      const createdTrajet = {
        _id: "trajet456",
        ...trajetData
      };

      User.findById = jest.fn().mockResolvedValue({ _id: "chauffeur789" });
      Camion.findById = jest.fn().mockResolvedValue({ _id: "camion123" });
      Trajet.create = jest.fn().mockResolvedValue(createdTrajet);

      const result = await trajetService.createTrajet(trajetData);

      // Vérifie que Remorque.findById n'a PAS été appelé
      expect(Remorque.findById).not.toHaveBeenCalled();
      expect(result).toEqual(createdTrajet);
    });

    // Test : erreur si chauffeur n'existe pas
    it('should throw error if chauffeur not found', async () => {
      const trajetData = {
        camionId: "camion123",
        chauffeur: "chauffeur999", // N'existe pas
        pointDepart: "Paris",
        pointArrivee: "Lyon",
        dateDepart: new Date()
      };

      // Chauffeur non trouvé
      User.findById = jest.fn().mockResolvedValue(null);

      // EXÉCUTION et VÉRIFICATION
      await expect(trajetService.createTrajet(trajetData))
        .rejects
        .toThrow('Chauffeur non trouvé');

      // Vérifie que create n'a PAS été appelé
      expect(Trajet.create).not.toHaveBeenCalled();
    });

    // Test : erreur si camion n'existe pas
    it('should throw error if camion not found', async () => {
      const trajetData = {
        camionId: "camion999", // N'existe pas
        chauffeur: "chauffeur789",
        pointDepart: "Paris",
        pointArrivee: "Lyon",
        dateDepart: new Date()
      };

      User.findById = jest.fn().mockResolvedValue({ _id: "chauffeur789" });
      Camion.findById = jest.fn().mockResolvedValue(null); // Camion non trouvé

      await expect(trajetService.createTrajet(trajetData))
        .rejects
        .toThrow('Camion non trouvé');
    });

    // Test : erreur si remorque n'existe pas (quand remorqueId est fourni)
    it('should throw error if remorque not found when remorqueId provided', async () => {
      const trajetData = {
        camionId: "camion123",
        remorqueId: "remorque999", // N'existe pas
        chauffeur: "chauffeur789",
        pointDepart: "Paris",
        pointArrivee: "Lyon",
        dateDepart: new Date()
      };

      User.findById = jest.fn().mockResolvedValue({ _id: "chauffeur789" });
      Camion.findById = jest.fn().mockResolvedValue({ _id: "camion123" });
      Remorque.findById = jest.fn().mockResolvedValue(null); // Remorque non trouvée

      await expect(trajetService.createTrajet(trajetData))
        .rejects
        .toThrow('Remorque non trouvée');
    });

    // Test : erreur si statut n'est pas "À faire"
    it('should throw error if statut is not À faire', async () => {
      const trajetData = {
        camionId: "camion123",
        chauffeur: "chauffeur789",
        pointDepart: "Paris",
        pointArrivee: "Lyon",
        dateDepart: new Date(),
        statut: "En cours" // Statut invalide pour la création
      };

      User.findById = jest.fn().mockResolvedValue({ _id: "chauffeur789" });
      Camion.findById = jest.fn().mockResolvedValue({ _id: "camion123" });

      await expect(trajetService.createTrajet(trajetData))
        .rejects
        .toThrow("Statut invalide : le statut doit être 'À faire' lors de la création");
    });

  });

  // =====================================================
  // Tests pour AllTrajets
  // =====================================================
  describe('AllTrajets', () => {

    it('should return paginated list of trajets with populated fields', async () => {
      
      // DONNÉES DE TEST
      const mockTrajets = [
        {
          _id: "trajet1",
          camionId: {
            _id: "camion1",
            immatriculation: "ABC123",
            marque: "Volvo"
          },
          remorqueId: {
            _id: "remorque1",
            immatriculation: "REM456"
          },
          chauffeur: {
            _id: "chauffeur1",
            name: "Jean Dupont",
            email: "jean@example.com"
          },
          pointDepart: "Paris",
          pointArrivee: "Lyon",
          statut: "À faire"
        },
        {
          _id: "trajet2",
          camionId: { _id: "camion2" },
          chauffeur: { _id: "chauffeur2", name: "Marie Martin" },
          pointDepart: "Marseille",
          pointArrivee: "Nice",
          statut: "En cours"
        }
      ];

      // MOCKS
      Trajet.countDocuments = jest.fn().mockResolvedValue(15);
      
      // Mock avec chaînage de méthodes
      Trajet.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockTrajets)
      });

      // EXÉCUTION
      const result = await trajetService.AllTrajets(1, 10);

      // VÉRIFICATIONS
      expect(Trajet.find).toHaveBeenCalledWith({ deletedAt: null });
      expect(Trajet.countDocuments).toHaveBeenCalledWith({ deletedAt: null });
      
      // Vérifie les populate
      const findChain = Trajet.find();
      expect(findChain.populate).toHaveBeenCalledWith('camionId');
      expect(findChain.populate).toHaveBeenCalledWith('remorqueId');
      expect(findChain.populate).toHaveBeenCalledWith('chauffeur', 'name email');
      
      // Vérifie le tri (createdAt décroissant)
      expect(findChain.sort).toHaveBeenCalledWith({ createdAt: -1 });

      expect(result.trajets).toEqual(mockTrajets);
      expect(result.pagination).toEqual({
        currentPage: 1,
        totalPages: 2, // Math.ceil(15/10)
        totalTrajets: 15,
        hasNext: true,
        hasPrev: false
      });
    });

    it('should return page 2 correctly', async () => {
      const mockTrajets = [{ _id: "trajet3" }];

      Trajet.countDocuments = jest.fn().mockResolvedValue(15);
      Trajet.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockTrajets)
      });

      const result = await trajetService.AllTrajets(2, 10);

      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.hasPrev).toBe(true);
      expect(result.pagination.hasNext).toBe(false); // Dernière page
    });

  });

  // =====================================================
  // Tests pour deleteTrajet
  // =====================================================
  describe('deleteTrajet', () => {

    it('should soft delete trajet with statut À faire', async () => {
      
      // DONNÉES DE TEST
      const trajetToDelete = {
        _id: "trajet123",
        statut: "À faire", // Seul ce statut peut être supprimé
        pointDepart: "Paris",
        pointArrivee: "Lyon"
      };

      const deletedTrajet = {
        ...trajetToDelete,
        deletedAt: new Date()
      };

      // MOCKS
      Trajet.findById = jest.fn().mockResolvedValue(trajetToDelete);
      Trajet.findByIdAndUpdate = jest.fn().mockResolvedValue(deletedTrajet);

      // EXÉCUTION
      const result = await trajetService.deleteTrajet("trajet123");

      // VÉRIFICATIONS
      expect(Trajet.findById).toHaveBeenCalledWith("trajet123");
      expect(Trajet.findByIdAndUpdate).toHaveBeenCalledWith(
        "trajet123",
        { deletedAt: expect.any(Date) },
        { new: true }
      );
      expect(result.deletedAt).toBeDefined();
    });

    it('should throw error if trajet not found', async () => {
      Trajet.findById = jest.fn().mockResolvedValue(null);

      await expect(trajetService.deleteTrajet("trajet999"))
        .rejects
        .toThrow('Trajet non trouvé');

      expect(Trajet.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should throw error if trajet statut is not À faire', async () => {
      const trajet = {
        _id: "trajet123",
        statut: "En cours" // Ne peut pas être supprimé
      };

      Trajet.findById = jest.fn().mockResolvedValue(trajet);

      await expect(trajetService.deleteTrajet("trajet123"))
        .rejects
        .toThrow('Seuls les trajets À faire peuvent être supprimés');

      expect(Trajet.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should not delete trajet with statut Terminé', async () => {
      const trajet = {
        _id: "trajet123",
        statut: "Terminé"
      };

      Trajet.findById = jest.fn().mockResolvedValue(trajet);

      await expect(trajetService.deleteTrajet("trajet123"))
        .rejects
        .toThrow('Seuls les trajets À faire peuvent être supprimés');
    });

  });

  // =====================================================
  // Tests pour getTrajetsByChauffeur
  // =====================================================
  describe('getTrajetsByChauffeur', () => {

    it('should return trajets for specific chauffeur', async () => {
      
      const chauffeurId = "chauffeur123";
      const mockTrajets = [
        {
          _id: "trajet1",
          chauffeur: chauffeurId,
          camionId: { _id: "camion1", immatriculation: "ABC123" },
          pointDepart: "Paris",
          pointArrivee: "Lyon",
          statut: "À faire"
        },
        {
          _id: "trajet2",
          chauffeur: chauffeurId,
          statut: "En cours"
        }
      ];

      Trajet.countDocuments = jest.fn().mockResolvedValue(5);
      Trajet.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockTrajets)
      });

      const result = await trajetService.getTrajetsByChauffeur(chauffeurId, 1, 10);

      // Vérifie qu'on filtre par chauffeur ET deletedAt null
      expect(Trajet.find).toHaveBeenCalledWith({
        chauffeur: chauffeurId,
        deletedAt: null
      });

      expect(Trajet.countDocuments).toHaveBeenCalledWith({
        chauffeur: chauffeurId,
        deletedAt: null
      });

      expect(result.trajets).toEqual(mockTrajets);
      expect(result.pagination.totalTrajets).toBe(5);
    });

    it('should return empty array if chauffeur has no trajets', async () => {
      const chauffeurId = "chauffeur999";

      Trajet.countDocuments = jest.fn().mockResolvedValue(0);
      Trajet.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      });

      const result = await trajetService.getTrajetsByChauffeur(chauffeurId);

      expect(result.trajets).toEqual([]);
      expect(result.pagination.totalTrajets).toBe(0);
    });

  });

  // =====================================================
  // Tests pour UpdateTrajetByAdmin
  // =====================================================
  describe('UpdateTrajetByAdmin', () => {

    it('should update trajet fields by admin', async () => {
      
      const trajetId = "trajet123";
      const updateData = {
        remarques: "Livraison urgente",
        pointDepart: "Marseille",
        pointArrivee: "Toulouse"
      };

      const existingTrajet = {
        _id: trajetId,
        statut: "À faire",
        pointDepart: "Paris",
        pointArrivee: "Lyon"
      };

      const updatedTrajet = {
        ...existingTrajet,
        ...updateData,
        updatedAt: new Date()
      };

      Trajet.findById = jest.fn().mockResolvedValue(existingTrajet);
      Trajet.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTrajet);

      const result = await trajetService.UpdateTrajetByAdmin(trajetId, updateData);

      expect(Trajet.findById).toHaveBeenCalledWith(trajetId);
      expect(Trajet.findByIdAndUpdate).toHaveBeenCalledWith(
        trajetId,
        updateData,
        { new: true, runValidators: true }
      );
      expect(result.remarques).toBe("Livraison urgente");
    });

    it('should throw error if trajet not found', async () => {
      Trajet.findById = jest.fn().mockResolvedValue(null);

      await expect(trajetService.UpdateTrajetByAdmin("trajet999", {}))
        .rejects
        .toThrow("Trajet non trouvé");
    });

    it('should throw error if trajet statut is not À faire', async () => {
      const trajet = {
        _id: "trajet123",
        statut: "En cours"
      };

      Trajet.findById = jest.fn().mockResolvedValue(trajet);

      await expect(trajetService.UpdateTrajetByAdmin("trajet123", { remarques: "Test" }))
        .rejects
        .toThrow("Seuls les trajets avec le statut 'À faire' peuvent être modifiés");
    });

    it('should throw error if admin tries to change statut to non À faire', async () => {
      const trajet = {
        _id: "trajet123",
        statut: "À faire"
      };

      const updateData = {
        statut: "En cours" // Admin ne peut pas changer à ce statut
      };

      Trajet.findById = jest.fn().mockResolvedValue(trajet);

      await expect(trajetService.UpdateTrajetByAdmin("trajet123", updateData))
        .rejects
        .toThrow("L'admin ne peut changer le statut que lorsqu'il reste 'À faire'");
    });

    it('should only update allowed fields', async () => {
      const trajet = {
        _id: "trajet123",
        statut: "À faire"
      };

      const updateData = {
        remarques: "Test",
        camionId: "newCamion",
        unauthorizedField: "shouldNotBeUpdated" // Champ non autorisé
      };

      Trajet.findById = jest.fn().mockResolvedValue(trajet);
      Trajet.findByIdAndUpdate = jest.fn().mockResolvedValue(trajet);

      await trajetService.UpdateTrajetByAdmin("trajet123", updateData);

      // Vérifie que seuls les champs autorisés sont passés
      const callArgs = Trajet.findByIdAndUpdate.mock.calls[0][1];
      expect(callArgs.remarques).toBe("Test");
      expect(callArgs.camionId).toBe("newCamion");
      expect(callArgs.unauthorizedField).toBeUndefined();
    });

  });

  // =====================================================
  // Tests pour updateTrajetByChauffeur
  // =====================================================
  describe('updateTrajetByChauffeur', () => {

    it('should update trajet by chauffeur with allowed fields', async () => {
      
      const trajetId = "trajet123";
      const chauffeurId = "chauffeur456";
      const updateData = {
        statut: "En cours",
        kmDepart: 50000,
        remarquesChauffeur: "Départ effectué"
      };

      const existingTrajet = {
        _id: trajetId,
        chauffeur: chauffeurId,
        statut: "À faire"
      };

      const updatedTrajet = {
        ...existingTrajet,
        ...updateData
      };

      Trajet.findOne = jest.fn().mockResolvedValue(existingTrajet);
      Trajet.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTrajet);

      const result = await trajetService.updateTrajetByChauffeur(
        trajetId,
        chauffeurId,
        updateData
      );

      expect(Trajet.findOne).toHaveBeenCalledWith({
        _id: trajetId,
        chauffeur: chauffeurId
      });

      expect(Trajet.findByIdAndUpdate).toHaveBeenCalledWith(
        trajetId,
        updateData,
        { new: true, runValidators: true }
      );

      expect(result.statut).toBe("En cours");
      expect(result.kmDepart).toBe(50000);
    });

    it('should throw error if trajet not found or not owned by chauffeur', async () => {
      Trajet.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        trajetService.updateTrajetByChauffeur("trajet123", "chauffeur999", {})
      ).rejects.toThrow('Trajet non trouvé');
    });

    it('should update statut to Terminé with arrival data', async () => {
      const trajetId = "trajet123";
      const chauffeurId = "chauffeur456";
      const updateData = {
        statut: "Terminé",
        kmArrivee: 50500,
        dateArrivee: new Date(),
        remarquesChauffeur: "Livraison effectuée"
      };

      const existingTrajet = {
        _id: trajetId,
        chauffeur: chauffeurId,
        statut: "En cours"
      };

      const updatedTrajet = {
        ...existingTrajet,
        ...updateData
      };

      Trajet.findOne = jest.fn().mockResolvedValue(existingTrajet);
      Trajet.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTrajet);

      const result = await trajetService.updateTrajetByChauffeur(
        trajetId,
        chauffeurId,
        updateData
      );

      expect(result.statut).toBe("Terminé");
      expect(result.kmArrivee).toBe(50500);
      expect(result.dateArrivee).toBeDefined();
    });

    it('should only update allowed fields for chauffeur', async () => {
      const trajet = {
        _id: "trajet123",
        chauffeur: "chauffeur456"
      };

      const updateData = {
        statut: "En cours",
        kmDepart: 50000,
        camionId: "newCamion", // Champ NON autorisé pour chauffeur
        pointArrivee: "Nice" // Champ NON autorisé pour chauffeur
      };

      Trajet.findOne = jest.fn().mockResolvedValue(trajet);
      Trajet.findByIdAndUpdate = jest.fn().mockResolvedValue(trajet);

      await trajetService.updateTrajetByChauffeur("trajet123", "chauffeur456", updateData);

      // Vérifie que seuls les champs autorisés sont passés
      const callArgs = Trajet.findByIdAndUpdate.mock.calls[0][1];
      expect(callArgs.statut).toBe("En cours");
      expect(callArgs.kmDepart).toBe(50000);
      expect(callArgs.camionId).toBeUndefined(); // Pas autorisé
      expect(callArgs.pointArrivee).toBeUndefined(); // Pas autorisé
    });

  });

});