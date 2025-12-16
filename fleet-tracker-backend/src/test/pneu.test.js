// Import du modèle Pneu (sera remplacé par un mock)
import Pneu from '../models/Pneu.js';
// Import du service à tester
import pneuService from '../service/PneuService.js';

// Mock du modèle Pneu - remplace toutes les méthodes par des fausses fonctions
jest.mock('../models/Pneu.js');

// Bloc describe : groupe tous les tests du PneuService
describe('PneuService', () => {

  // afterEach : s'exécute après chaque test pour nettoyer les mocks
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialise tous les mocks
  });

  // =====================================================
  // Tests pour createPneu
  // =====================================================
  describe('createPneu', () => {

    // Test : création réussie d'un pneu pour un camion
    it('should create a pneu for a Camion successfully', async () => {
      
      // 1. DONNÉES DE TEST (Arrange)
      const pneuData = {
        vehiculeType: "Camion",
        vehiculeId: "64abc123def456789", // ID MongoDB
        position: "Avant Gauche",
        marque: "Michelin",
        dateInstallation: new Date("2024-01-15"),
        kilometrageInstallation: 50000,
        statut: "bon"
      };

      // Pneu créé (ce que create() retourne)
      const createdPneu = {
        _id: "pneu123",
        ...pneuData,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // 2. MOCK (Arrange)
      // Pneu.create : simule la création en base de données
      Pneu.create = jest.fn().mockResolvedValue(createdPneu);

      // 3. EXÉCUTION (Act)
      const result = await pneuService.createPneu(pneuData);

      // 4. VÉRIFICATIONS (Assert)
      // Vérifie que create a été appelé avec les bonnes données
      expect(Pneu.create).toHaveBeenCalledWith({
        vehiculeType: "Camion",
        vehiculeId: "64abc123def456789",
        position: "Avant Gauche",
        marque: "Michelin",
        dateInstallation: new Date("2024-01-15"),
        kilometrageInstallation: 50000,
        statut: "bon"
      });
      expect(result).toEqual(createdPneu);
      expect(result.vehiculeType).toBe("Camion");
    });

    // Test : création d'un pneu pour une Remorque
    it('should create a pneu for a Remorque successfully', async () => {
      const pneuData = {
        vehiculeType: "Remorque",
        vehiculeId: "64xyz789abc123456",
        position: "Arrière Droit",
        marque: "Continental",
        dateInstallation: new Date("2024-02-20"),
        kilometrageInstallation: 30000,
        statut: "bon"
      };

      const createdPneu = {
        _id: "pneu456",
        ...pneuData,
        deletedAt: null
      };

      Pneu.create = jest.fn().mockResolvedValue(createdPneu);

      const result = await pneuService.createPneu(pneuData);

      expect(result.vehiculeType).toBe("Remorque");
      expect(result.position).toBe("Arrière Droit");
    });

    // Test : création avec statut par défaut
    it('should create pneu with default statut if not provided', async () => {
      const pneuData = {
        vehiculeType: "Camion",
        vehiculeId: "64abc123def456789",
        position: "Avant Droit",
        marque: "Bridgestone",
        kilometrageInstallation: 40000
        // statut non fourni
      };

      const createdPneu = {
        _id: "pneu789",
        ...pneuData,
        statut: "bon", // Valeur par défaut du schema
        dateInstallation: new Date(), // Date par défaut
        deletedAt: null
      };

      Pneu.create = jest.fn().mockResolvedValue(createdPneu);

      const result = await pneuService.createPneu(pneuData);

      expect(result.statut).toBe("bon");
    });

  });

  // =====================================================
  // Tests pour AllPneus (avec pagination)
  // =====================================================
  describe('AllPneus', () => {

    // Test : récupération de la première page avec populate
    it('should return paginated list of pneus with populated vehiculeId', async () => {
      
      // DONNÉES DE TEST
      const mockPneus = [
        {
          _id: "pneu1",
          vehiculeType: "Camion",
          vehiculeId: {
            _id: "camion1",
            immatriculation: "ABC123",
            marque: "Volvo"
          },
          position: "Avant Gauche",
          marque: "Michelin",
          statut: "bon"
        },
        {
          _id: "pneu2",
          vehiculeType: "Remorque",
          vehiculeId: {
            _id: "remorque1",
            immatriculation: "REM456",
            type: "Frigorifique"
          },
          position: "Arrière Droit",
          marque: "Continental",
          statut: "moyen"
        }
      ];

      // MOCKS
      // countDocuments : retourne le nombre total de pneus
      Pneu.countDocuments = jest.fn().mockResolvedValue(18);
      
      // find avec chaînage de méthodes (populate, skip, limit)
      Pneu.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockPneus)
      });

      // EXÉCUTION
      const result = await pneuService.AllPneus(1, 10);

      // VÉRIFICATIONS
      expect(Pneu.countDocuments).toHaveBeenCalledWith({ deletedAt: null });
      expect(Pneu.find).toHaveBeenCalledWith({ deletedAt: null });
      expect(result.pneus).toEqual(mockPneus);
      
      // Vérification du populate (charge les données du véhicule)
      expect(Pneu.find().populate).toHaveBeenCalledWith('vehiculeId');
      
      // Vérification de la pagination
      expect(result.pagination).toEqual({
        currentPage: 1,
        totalPages: 2,        // Math.ceil(18/10) = 2
        totalItems: 18,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPrevPage: false
      });
    });

    // Test : page 2
    it('should return page 2 with correct pagination', async () => {
      const mockPneus = [
        {
          _id: "pneu3",
          vehiculeType: "Camion",
          position: "Arrière Gauche"
        }
      ];

      Pneu.countDocuments = jest.fn().mockResolvedValue(18);
      Pneu.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockPneus)
      });

      const result = await pneuService.AllPneus(2, 10);

      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.hasPrevPage).toBe(true);
      expect(result.pagination.hasNextPage).toBe(false); // Dernière page
    });

    // Test : vérification que populate charge bien les données du véhicule
    it('should populate vehiculeId with vehicle data', async () => {
      const mockPneus = [
        {
          _id: "pneu1",
          vehiculeType: "Camion",
          vehiculeId: {
            _id: "camion1",
            immatriculation: "ABC123",
            marque: "Volvo",
            modele: "FH16"
          }
        }
      ];

      Pneu.countDocuments = jest.fn().mockResolvedValue(1);
      Pneu.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockPneus)
      });

      const result = await pneuService.AllPneus(1, 10);

      // Vérifie que vehiculeId contient les données complètes du véhicule
      expect(result.pneus[0].vehiculeId).toBeDefined();
      expect(result.pneus[0].vehiculeId.immatriculation).toBe("ABC123");
    });

  });

  // =====================================================
  // Tests pour PneuById
  // =====================================================
  describe('PneuById', () => {

    // Test : pneu trouvé avec populate
    it('should return a pneu by id with populated vehiculeId', async () => {
      
      // DONNÉES DE TEST
      const mockPneu = {
        _id: "pneu123",
        vehiculeType: "Camion",
        vehiculeId: {
          _id: "camion1",
          immatriculation: "ABC123",
          marque: "Volvo"
        },
        position: "Avant Gauche",
        marque: "Michelin",
        kilometrageInstallation: 50000,
        statut: "bon"
      };

      // MOCK
      // findById avec populate
      Pneu.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPneu)
      });

      // EXÉCUTION
      const result = await pneuService.PneuById("pneu123");

      // VÉRIFICATIONS
      expect(Pneu.findById).toHaveBeenCalledWith("pneu123");
      expect(Pneu.findById().populate).toHaveBeenCalledWith("vehiculeId");
      expect(result).toEqual(mockPneu);
      expect(result.vehiculeId.immatriculation).toBe("ABC123");
    });

    // Test : pneu non trouvé
    it('should return null if pneu not found', async () => {
      
      // MOCK : findById retourne null
      Pneu.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      // EXÉCUTION
      const result = await pneuService.PneuById("pneu999");

      // VÉRIFICATIONS
      expect(Pneu.findById).toHaveBeenCalledWith("pneu999");
      expect(result).toBeNull();
    });

    // Test : vérification du type de véhicule
    it('should return pneu with correct vehiculeType', async () => {
      const mockPneu = {
        _id: "pneu456",
        vehiculeType: "Remorque",
        vehiculeId: {
          _id: "remorque1",
          immatriculation: "REM789"
        },
        position: "Arrière Droit"
      };

      Pneu.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPneu)
      });

      const result = await pneuService.PneuById("pneu456");

      expect(result.vehiculeType).toBe("Remorque");
    });

  });

  // =====================================================
  // Tests pour updatePneu
  // =====================================================
  describe('updatePneu', () => {

    // Test : mise à jour du statut
    it('should update pneu statut successfully', async () => {
      
      // DONNÉES DE TEST
      const updateData = { 
        statut: "usé" 
      };
      
      const updatedPneu = {
        _id: "pneu123",
        vehiculeType: "Camion",
        vehiculeId: "camion1",
        position: "Avant Gauche",
        marque: "Michelin",
        statut: "usé", // Valeur mise à jour
        updatedAt: new Date()
      };

      // MOCK
      Pneu.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedPneu);

      // EXÉCUTION
      const result = await pneuService.updatePneu("pneu123", updateData);

      // VÉRIFICATIONS
      expect(Pneu.findByIdAndUpdate).toHaveBeenCalledWith(
        "pneu123",
        updateData,
        { new: true } // Retourne le document APRÈS modification
      );
      expect(result).toEqual(updatedPneu);
      expect(result.statut).toBe("usé");
    });

    // Test : mise à jour de plusieurs champs
    it('should update multiple fields at once', async () => {
      const updateData = { 
        marque: "Goodyear",
        statut: "moyen",
        kilometrageInstallation: 60000
      };
      
      const updatedPneu = {
        _id: "pneu456",
        vehiculeType: "Remorque",
        position: "Arrière Gauche",
        marque: "Goodyear",
        statut: "moyen",
        kilometrageInstallation: 60000
      };

      Pneu.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedPneu);

      const result = await pneuService.updatePneu("pneu456", updateData);

      expect(result.marque).toBe("Goodyear");
      expect(result.statut).toBe("moyen");
      expect(result.kilometrageInstallation).toBe(60000);
    });

    // Test : changement de statut à "remplacé"
    it('should update statut to remplacé', async () => {
      const updateData = { 
        statut: "remplacé" 
      };
      
      const updatedPneu = {
        _id: "pneu789",
        statut: "remplacé"
      };

      Pneu.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedPneu);

      const result = await pneuService.updatePneu("pneu789", updateData);

      expect(result.statut).toBe("remplacé");
    });

  });

  // =====================================================
  // Tests pour deletePneu (Soft Delete)
  // =====================================================
  describe('deletePneu', () => {

    // Test : suppression logique réussie
    it('should soft delete pneu by setting deletedAt', async () => {
      
      // DONNÉES DE TEST
      const deletedPneu = {
        _id: "pneu123",
        vehiculeType: "Camion",
        vehiculeId: "camion1",
        position: "Avant Gauche",
        marque: "Michelin",
        statut: "bon",
        deletedAt: new Date() // ✅ Vraie Date ici (pas expect.any)
      };

      // MOCK
      Pneu.findByIdAndUpdate = jest.fn().mockResolvedValue(deletedPneu);

      // EXÉCUTION
      const result = await pneuService.deletePneu("pneu123");

      // VÉRIFICATIONS
      expect(Pneu.findByIdAndUpdate).toHaveBeenCalledWith(
        "pneu123",
        { deletedAt: expect.any(Date) }, // ✅ expect.any() seulement dans les assertions
        { new: true }
      );
      expect(result.deletedAt).toBeDefined();
      expect(result.deletedAt).toBeInstanceOf(Date);
    });

    // Test : le pneu reste en base (pas de vrai DELETE)
    it('should not permanently delete the pneu', async () => {
      const deletedPneu = {
        _id: "pneu456",
        vehiculeType: "Remorque",
        position: "Arrière Droit",
        deletedAt: new Date()
      };

      Pneu.findByIdAndUpdate = jest.fn().mockResolvedValue(deletedPneu);

      const result = await pneuService.deletePneu("pneu456");

      // On a utilisé UPDATE, pas DELETE
      expect(Pneu.findByIdAndUpdate).toHaveBeenCalled();
      // Le pneu existe toujours avec deletedAt
      expect(result._id).toBe("pneu456");
      expect(result.vehiculeType).toBe("Remorque");
    });

    // Test : vérification que deletedAt est bien une Date
    it('should set deletedAt as a valid Date object', async () => {
      const deletedPneu = {
        _id: "pneu789",
        deletedAt: new Date("2024-12-16")
      };

      Pneu.findByIdAndUpdate = jest.fn().mockResolvedValue(deletedPneu);

      const result = await pneuService.deletePneu("pneu789");

      expect(result.deletedAt).toBeInstanceOf(Date);
      expect(result.deletedAt.getFullYear()).toBe(2024);
    });

  });

});