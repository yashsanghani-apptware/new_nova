import { Request, Response } from "express";
import mongoose, { SortOrder } from "mongoose";
import OfferingService from "../services/offeringServices";
import Offering from "../model/Offering";
import { translate, initI18n } from "../utils/i18n";

class OfferingController {
  private offeringService: OfferingService;

  constructor() {
    this.offeringService = new OfferingService();
  }
  /**
   * Helper method to check if a given ID is a valid MongoDB ObjectId.
   *
   * @param {any} id - The ID to validate
   * @returns {boolean} Returns true if the ID is a valid ObjectId, otherwise false
   */
  private isValidObjectId(id: any): boolean {
    return mongoose.isValidObjectId(id);
  }

  /**
   * Create a new offering.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to the created offering object
   */
  public async createOffering(req: Request, res: Response): Promise<void> {
    try {
      const offeringData = req.body;

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      // Call the service method to create the offering
      const savedOffering = await this.offeringService.createOffering(
        offeringData,
        authHeader
      );

      res.status(201).json(savedOffering);
    } catch (error: any) {
      // console.error("Error creating offering:", error);

      res.status(500).json({
        message: translate("ERROR_CREATING_OFFERING"),
        error: error.message,
      });
    }
  }

  /**
   * Retrieve a specific offering by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to the retrieved offering object
   */
  public async getOffering(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      // Call the service method to get the offering
      const offering = await this.offeringService.getOfferById(
        id,
        authHeader
      );

      if (!offering) {
        res.status(404).json({ message: translate("OFFERING_NOT_FOUND") });
      }

      res.status(200).json(offering);
    } catch (error: any) {
      if (error.message.startsWith("Invalid")) {
        res.status(400).json({ message: error.message });
      } else if (error.message === translate("OFFERING_NOT_FOUND")) {
        res.status(404).json({ message: translate("OFFERING_NOT_FOUND") });
      } else {
        res.status(500).json({
          message: translate("ERROR_FETCHING_OFFERING"),
          error: error.message,
        });
      }
    }
  }

  /**
   * Retrieve all offerings.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to an array of all offerings
   */
  public async getAllofferings(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      const offerings = await this.offeringService.getAllOfferings(authHeader);
      if (offerings.length === 0) {
        res.status(404).json({ message: translate("OFFERINGS_NOT_AVAILABLE") });
        return;
      }

      res.status(200).json(offerings);
    } catch (error: any) {
      console.error("Error fetching offerings:", error.message);
      res.status(500).json({
        message: translate("ERROR_FETCHING_OFFERINGS"),
        error: error.message,
      });
    }
  }

  /**
   * Update an existing offering by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to the updated offering object
   */
  public async updateOffering(req: Request, res: Response): Promise<void> {
    try {
      const { offering_id } = req.params;
      const updateData = req.body;
      // Call the service
      const updatedoffering = await this.offeringService.modifyOffering(
        offering_id,
        updateData
      );

      res.status(200).json(updatedoffering);
    } catch (error: any) {
      // console.error('Error updating offering:', error);
      if (error.message === translate("OFFERING_NOT_FOUND")) {
        res.status(404).json({ message: translate("OFFERING_NOT_FOUND") });
      } else if (error.message.startsWith("Invalid")) {
        res.status(400).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: translate("ERROR_UPDATING_OFFERINGS") });
      }
    }
  }

  /**
   * Delete a specific offering by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves when the offering is deleted
   */
  public async deleteOffering(req: Request, res: Response): Promise<void> {
    try {
      const { offering_id } = req.params;

      const deletedOffering = await this.offeringService.deleteOffering(
        offering_id
      );

      if (!deletedOffering) {
        res.status(404).json({
          message: translate("OFFERING_NOT_FOUND"),
          error: translate("OFFERING_NOT_FOUND"),
        });
        return;
      }

      res.status(200).json({
        message: translate("OFFERING_DELETED"),
        offering_id: deletedOffering.offering_id,
      });
    } catch (error: any) {
      console.error("Error deleting offering:", error.message);
      res.status(500).json({
        message: translate("ERROR_DELETING_OFFERINGS"),
        error: error.message,
      });
    }
  }

  /**
   * Search for offerings with filters, pagination, and sorting
   * @param req - Express request object
   * @param res - Express response object
   */

  public async searchOfferings(req: Request, res: Response): Promise<void> {
    try {
      // Extract query parameters and convert to the expected format
      const {
        page = "1",
        limit = "10",
        sort = "created_at",
        order = "desc",
        ...filters
      } = req.query;
      const orderValue: "desc" | "asc" = order === "desc" ? "desc" : "asc";
      const searchOptions = {
        page: Number(page),
        limit: Number(limit),
        sort: String(sort),
        order: orderValue,
        filters: filters as Record<string, string | undefined>,
      };

      // Call the service method to search offerings
      const result = await this.offeringService.searchOfferings(searchOptions);

      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error searching offerings:", error.message);
      res.status(500).json({
        message: translate("ERROR_SEARCHING_OFFERINGS"),
        error: error.message,
      });
    }
  }

  /**
   * Query offerings with advanced filtering and pagination.
   *
   * @function queryofferings
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters for advanced filtering and pagination
   * @param {number} [req.query.page] - Page number for pagination
   * @param {number} [req.query.limit] - Number of results per page
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to a paginated list of offerings matching the query
   */
  public async queryOfferings(req: Request, res: Response): Promise<void> {
    try {
      // Extract query parameters and convert to the expected format

      const { page = 1, limit = 10, ...queryParams } = req.query;
      const queryOptions = {
        page: Number(page),
        limit: Number(limit),
        queryParams,
      };
      const offerings = await this.offeringService.queryOfferings(queryOptions);

      res.status(200).json(offerings);
    } catch (error: any) {
      res.status(404).json({
        message: translate("ERROR_FETCHING_OFFERINGS"),
        error: error.message,
      });
    }
  }

  /**
 * Update or upload the documents of an offering.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves to the updated or newly created offering.
 */


  /**
 * Update or upload the documents of an offering.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves to the updated or newly created offering.
 */
  public async updateDocuments(req: Request, res: Response): Promise<void> {
    try {

      const { offering_id } = req.params;
      const files = req.files;
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      if (!files ||!offering_id) {
        res.status(400).json({ message: translate("MISSING_DOCUMENTS_OR_ID") });
        return;
      }

      const updatedOffering = await this.offeringService.updateDocuments(
        offering_id,
        files,
        authHeader
      );

      res.status(200).json(updatedOffering);
    } catch (error: any) {
      res.status(500).json({
        message: translate("ERROR_UPDATING_OFFER_DOCUMENTS"),
        error: error.message,
      });
    }
  }

  /**
   * Retrieve all crops.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to an array of all crops
   */
  public async getCrop(req: Request, res: Response): Promise<void> { 
    try {
      const crop = await this.offeringService.getCrop();
      res.status(200).json(crop);
    } catch (error: any) {
      res.status(500).json({
        message: translate("ERROR_FETCHING_OFFERINGS"),
        error: error.message,
      });
    }
  }

}

export default new OfferingController();
