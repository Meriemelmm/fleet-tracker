import Camion from '../models/Camion.js';
import CamionService from '../service/camionService.js';

jest.mock('../models/Camion.js');

describe('CamionService', () => {

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('createCamion', () => {

    it('should return camion created with success', async () => {
      const camionData = {
        immatriculation: "ABC123",
        marque: "Volvo",
        modele: "FH16",
        annee: 2023,
        kilometrageActuel: 50000,
      };

      const camionSaved = {
        _id: "123456",
        ...camionData,
        deletedAt: null
      };

      const mockSave = jest.fn().mockResolvedValue(camionSaved);
      Camion.mockImplementation(() => ({
        save: mockSave
      }));

      const result = await CamionService.createCamion(camionData);

      expect(Camion).toHaveBeenCalledWith(camionData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(camionSaved);
    });

  });

  describe('getAllCamions', () => {

    it('should return paginated camions list', async () => {
      const mockCamions = [
        { _id: "1", immatriculation: "ABC123", marque: "Volvo" },
        { _id: "2", immatriculation: "DEF456", marque: "Mercedes" }
      ];

      Camion.countDocuments = jest.fn().mockResolvedValue(15);
      Camion.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockCamions)
      });

      const result = await CamionService.getAllCamions(1, 10);

      expect(Camion.countDocuments).toHaveBeenCalledWith({ deletedAt: null });
      expect(Camion.find).toHaveBeenCalledWith({ deletedAt: null });
      expect(result.camions).toEqual(mockCamions);
      expect(result.pagination).toEqual({
        currentPage: 1,
        totalPages: 2,
        totalItems: 15,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPrevPage: false
      });
    });

    it('should handle page 2 correctly', async () => {
      const mockCamions = [
        { _id: "3", immatriculation: "GHI789", marque: "Scania" }
      ];

      Camion.countDocuments = jest.fn().mockResolvedValue(15);
      Camion.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockCamions)
      });

      const result = await CamionService.getAllCamions(2, 10);

      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.hasPrevPage).toBe(true);
    });

  });

  describe('getCamion', () => {

    it('should return a single camion by id', async () => {
      const mockCamion = {
        _id: "123",
        immatriculation: "ABC123",
        marque: "Volvo"
      };

      Camion.findOne = jest.fn().mockResolvedValue(mockCamion);

      const result = await CamionService.getCamion("123");

      expect(Camion.findOne).toHaveBeenCalledWith({ 
        _id: "123", 
        deletedAt: null 
      });
      expect(result).toEqual(mockCamion);
    });

    it('should return null if camion not found', async () => {
      Camion.findOne = jest.fn().mockResolvedValue(null);

      const result = await CamionService.getCamion("999");

      expect(result).toBeNull();
    });

  });


























  
  describe('updateCamion', () => {

    it('should update and return the updated camion', async () => {
      const updateData = { kilometrageActuel: 60000 };
      const updatedCamion = {
        _id: "123",
        immatriculation: "ABC123",
        marque: "Volvo",
        kilometrageActuel: 60000
      };

      Camion.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCamion);

      const result = await CamionService.updateCamion("123", updateData);

      expect(Camion.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedCamion);
    });

  });

  describe('deleteCamion', () => {

    it('should soft delete camion (set deletedAt)', async () => {
      const deletedCamion = {
        _id: "123",
        immatriculation: "ABC123",
        deletedAt: expect.any(Date)
      };

      Camion.findByIdAndUpdate = jest.fn().mockResolvedValue(deletedCamion);

      const result = await CamionService.deleteCamion("123");

      expect(Camion.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { deletedAt: expect.any(Date) },
        { new: true }
      );
      expect(result.deletedAt).toBeDefined();
    });

  });

});