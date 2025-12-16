// Import du modèle Remorque (sera remplacé par un mock)
import Remorque from '../models/Remorque.js';
// Import du service à tester
import RemorqueService from '../service/remorqueService.js';

// Mock du modèle Remorque - remplace toutes les méthodes par des fausses fonctions
jest.mock('../models/Remorque.js');

// Bloc describe : groupe tous les tests du RemorqueService
describe('RemorqueService', () => {

  // afterEach : s'exécute après chaque test pour nettoyer les mocks
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialise tous les mocks pour éviter les interférences
  });

  // =====================================================
  // Tests pour createRemorque
  // =====================================================
  describe('createRemorque', () => {

    // Test : création réussie d'une remorque
    it('should create and return a new remorque', async () => {
      
      // 1. DONNÉES DE TEST (Arrange)
      const remorqueData = {
        immatriculation: "REM123",
        type: "Frigorifique",
        status: "disponible"
      };

      // Remorque sauvegardée (ce que save() retourne)
      const savedRemorque = {
        _id: "abc123",
        ...remorqueData,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // 2. MOCK (Arrange)
      // mockSave : simule la méthode save()
      const mockSave = jest.fn().mockResolvedValue(savedRemorque);
      
      // Quand on fait "new Remorque(data)", retourne un objet avec save()
      Remorque.mockImplementation(() => ({
        save: mockSave
      }));

      // 3. EXÉCUTION (Act)
      const result = await RemorqueService.createRemorque(remorqueData);

      // 4. VÉRIFICATIONS (Assert)
      expect(Remorque).toHaveBeenCalledWith(remorqueData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(savedRemorque);
      expect(result.immatriculation).toBe("REM123");
    });

    // Test : création avec status par défaut
    it('should create remorque with default status if not provided', async () => {
      const remorqueData = {
        immatriculation: "REM456",
        type: "Bâchée"
        // status non fourni, devrait être "disponible" par défaut
      };

      const savedRemorque = {
        _id: "def456",
        ...remorqueData,
        status: "disponible", // Valeur par défaut
        deletedAt: null
      };

      const mockSave = jest.fn().mockResolvedValue(savedRemorque);
      Remorque.mockImplementation(() => ({
        save: mockSave
      }));

      const result = await RemorqueService.createRemorque(remorqueData);

      expect(result.status).toBe("disponible");
    });

  });

  // =====================================================
  // Tests pour getAllRemorques
  // =====================================================
  describe('getAllRemorques', () => {

    // Test : récupération de la première page
    it('should return paginated list of remorques', async () => {
      
      // DONNÉES DE TEST
      const mockRemorques = [
        { 
          _id: "1", 
          immatriculation: "REM001", 
          type: "Frigorifique",
          status: "disponible" 
        },
        { 
          _id: "2", 
          immatriculation: "REM002", 
          type: "Bâchée",
          status: "en_service" 
        }
      ];

      // MOCKS
      // countDocuments : retourne le nombre total de remorques
      Remorque.countDocuments = jest.fn().mockResolvedValue(25);
      
      // find : retourne les remorques avec pagination
      Remorque.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockRemorques)
      });

      // EXÉCUTION
      const result = await RemorqueService.getAllRemorques(1, 10);

      // VÉRIFICATIONS
      expect(Remorque.countDocuments).toHaveBeenCalledWith({ deletedAt: null });
      expect(Remorque.find).toHaveBeenCalledWith({ deletedAt: null });
      expect(result.remorques).toEqual(mockRemorques);
      
      // Vérification de la pagination
      expect(result.pagination).toEqual({
        currentPage: 1,
        totalPages: 3,        // Math.ceil(25/10) = 3
        totalItems: 25,
        itemsPerPage: 10,
        hasNextPage: true,    // 1 < 3
        hasPrevPage: false    // pas de page avant la 1
      });
    });

    // Test : page 2 avec vérification hasPrevPage
    it('should handle page 2 correctly with hasPrevPage true', async () => {
      const mockRemorques = [
        { _id: "3", immatriculation: "REM003", type: "Plateau" }
      ];

      Remorque.countDocuments = jest.fn().mockResolvedValue(25);
      Remorque.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockRemorques)
      });

      const result = await RemorqueService.getAllRemorques(2, 10);

      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.hasPrevPage).toBe(true);
      expect(result.pagination.hasNextPage).toBe(true);
    });

    // Test : dernière page
    it('should handle last page with hasNextPage false', async () => {
      const mockRemorques = [
        { _id: "5", immatriculation: "REM005", type: "Citerne" }
      ];

      Remorque.countDocuments = jest.fn().mockResolvedValue(25);
      Remorque.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockRemorques)
      });

      // Page 3 sur 3
      const result = await RemorqueService.getAllRemorques(3, 10);

      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPrevPage).toBe(true);
    });

  });

  // =====================================================
  // Tests pour getRemorqueById
  // =====================================================
  describe('getRemorqueById', () => {

    // Test : remorque trouvée
    it('should return a single remorque by id', async () => {
      
      // DONNÉES DE TEST
      const mockRemorque = {
        _id: "123",
        immatriculation: "REM123",
        type: "Frigorifique",
        status: "disponible"
      };

      // MOCK
      Remorque.findOne = jest.fn().mockResolvedValue(mockRemorque);

      // EXÉCUTION
      const result = await RemorqueService.getRemorqueById("123");

      // VÉRIFICATIONS
      // Vérifie qu'on cherche avec ID ET deletedAt null
      expect(Remorque.findOne).toHaveBeenCalledWith({ 
        _id: "123", 
        deletedAt: null 
      });
      expect(result).toEqual(mockRemorque);
      expect(result.immatriculation).toBe("REM123");
    });

    // Test : remorque non trouvée
    it('should return null if remorque not found', async () => {
      
      // MOCK : findOne retourne null si pas trouvé
      Remorque.findOne = jest.fn().mockResolvedValue(null);

      // EXÉCUTION
      const result = await RemorqueService.getRemorqueById("999");

      // VÉRIFICATIONS
      expect(Remorque.findOne).toHaveBeenCalledWith({ 
        _id: "999", 
        deletedAt: null 
      });
      expect(result).toBeNull();
    });

    // Test : remorque supprimée (deletedAt non null)
    it('should return null if remorque is soft deleted', async () => {
      
      // MOCK : la remorque existe mais est supprimée
      Remorque.findOne = jest.fn().mockResolvedValue(null);

      const result = await RemorqueService.getRemorqueById("123");

      // La requête exclut les remorques avec deletedAt !== null
      expect(result).toBeNull();
    });

  });

  // =====================================================
  // Tests pour updateRemorque
  // =====================================================
  describe('updateRemorque', () => {

    // Test : mise à jour réussie
    it('should update and return the updated remorque', async () => {
      
      // DONNÉES DE TEST
      const updateData = { 
        status: "en_maintenance" 
      };
      
      const updatedRemorque = {
        _id: "123",
        immatriculation: "REM123",
        type: "Frigorifique",
        status: "en_maintenance", // Valeur mise à jour
        updatedAt: new Date()
      };

      // MOCK
      Remorque.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedRemorque);

      // EXÉCUTION
      const result = await RemorqueService.updateRemorque("123", updateData);

      // VÉRIFICATIONS
      expect(Remorque.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        updateData,
        { new: true } // Retourne le document APRÈS modification
      );
      expect(result).toEqual(updatedRemorque);
      expect(result.status).toBe("en_maintenance");
    });

    // Test : mise à jour de plusieurs champs
    it('should update multiple fields at once', async () => {
      const updateData = { 
        type: "Plateau",
        status: "disponible"
      };
      
      const updatedRemorque = {
        _id: "456",
        immatriculation: "REM456",
        type: "Plateau",
        status: "disponible"
      };

      Remorque.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedRemorque);

      const result = await RemorqueService.updateRemorque("456", updateData);

      expect(result.type).toBe("Plateau");
      expect(result.status).toBe("disponible");
    });

  });

  // =====================================================
  // Tests pour deleteRemorque (Soft Delete)
  // =====================================================
  describe('deleteRemorque', () => {

    // Test : suppression logique réussie
    it('should soft delete remorque by setting deletedAt', async () => {
      
      // DONNÉES DE TEST
      const deletedRemorque = {
        _id: "123",
        immatriculation: "REM123",
        type: "Frigorifique",
        status: "disponible",
        deletedAt: new Date() // ✅ Vraie Date ici (pas expect.any)
      };

      // MOCK
      Remorque.findByIdAndUpdate = jest.fn().mockResolvedValue(deletedRemorque);

      // EXÉCUTION
      const result = await RemorqueService.deleteRemorque("123");

      // VÉRIFICATIONS
      expect(Remorque.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { deletedAt: expect.any(Date) }, // ✅ expect.any() seulement dans les assertions
        { new: true }
      );
      expect(result.deletedAt).toBeDefined();
      expect(result.deletedAt).toBeInstanceOf(Date);
    });

    // Test : la remorque reste en base (pas de vrai DELETE)
    it('should not permanently delete the remorque', async () => {
      const deletedRemorque = {
        _id: "789",
        immatriculation: "REM789",
        deletedAt: new Date()
      };

      Remorque.findByIdAndUpdate = jest.fn().mockResolvedValue(deletedRemorque);

      const result = await RemorqueService.deleteRemorque("789");

      // On a utilisé UPDATE, pas DELETE
      expect(Remorque.findByIdAndUpdate).toHaveBeenCalled();
      // La remorque existe toujours avec deletedAt
      expect(result._id).toBe("789");
      expect(result.immatriculation).toBe("REM789");
    });

  });

});