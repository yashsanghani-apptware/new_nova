import { Request, Response } from "express";
import mongoose, { SortOrder } from "mongoose";
import ListingService from "../services/listingService";
import { translate, initI18n } from "../utils/i18n";

/**
 * ListingController class handles CRUD operations and additional functionalities
 * related to property listings.
 */
class ListingController {
  private listingService: ListingService;

  constructor() {
    this.listingService = new ListingService();
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
   * @param req - Express request object
   * @param res - Express response object
   */
  public async webhook(req: Request, res: Response): Promise<void> {
    try {
      console.log("Webhook Info:", req.body);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error getting webhook", error: error.message });
    }
  }
  /**
   * Create a new listing.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to the created listing object
   */
  public async createListing(req: Request, res: Response): Promise<void> {
    try {
      const listingData = req.body;

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      // Call the service method to create the listing
      const savedListing = await this.listingService.createListing(
        listingData,
        authHeader
      );

      res.status(201).json(savedListing);
    } catch (error: any) {
      // console.error("Error creating listing:", error);

      res
        .status(500)
        .json({
          message: translate("ERROR_CREATING_LISTING"),
          error: error.message,
        });
    }
  }

  /**
   * Retrieve a specific listing by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to the retrieved listing object
   */
  public async getListing(req: Request, res: Response): Promise<void> {
    try {
      const { listing_id } = req.params;

      // Call the service method to get the listing
      const listing = await this.listingService.getListingById(listing_id);

      if (!listing) {
        res.status(404).json({ message: translate("LISTING_NOT_FOUND") });
      }

      res.status(200).json(listing);
    } catch (error: any) {
      if (error.message.startsWith("Invalid")) {
        res.status(400).json({ message: error.message });
      } else if (error.message === translate("LISTING_NOT_FOUND")) {
        res.status(404).json({ message: translate("LISTING_NOT_FOUND") });
      } else {
        res.status(500).json({ message: translate("ERROR_FETCHING_LISTINGS") });
      }
    }
  }

  /**
   * Update an existing listing by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to the updated listing object
   */
  public async updateListing(req: Request, res: Response): Promise<void> {
    try {
      const { listing_id } = req.params;
      const updateData = req.body;
      // Call the service
      const updatedListing = await this.listingService.modifyListing(
        listing_id,
        updateData
      );

      res.status(200).json(updatedListing);
    } catch (error: any) {
      // console.error('Error updating listing:', error);
      if (error.message === translate("LISTING_NOT_FOUND")) {
        res.status(404).json({ message: translate("LISTING_NOT_FOUND") });
      } else if (error.message.startsWith("Invalid")) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: translate("ERROR_UPDATING_LISTINGS") });
      }
    }
  }

  /**
   * Delete a specific listing by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves when the listing is deleted
   */
  public async deleteListing(req: Request, res: Response): Promise<void> {
    try {
      const { listing_id } = req.params;

      // Call the service method to delete the listing
      const result = await this.listingService.deleteListing(listing_id);

      if (!result.success) {
        res
          .status(
            result.message === translate("INVALID_LISTING_ID") ? 400 : 404
          )
          .json({ message: result.message });
        return;
      }

      res.status(200).json({ message: result.message });
    } catch (error: any) {
      console.error("Error deleting listing:", error.message);
      res.status(500).json({
        message: translate("ERROR_DELETING_LISTING"),
        error: error.message,
      });
    }
  }

  /**
   * Retrieve all listings.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to an array of all listings
   */
  public async getAllListings(req: Request, res: Response): Promise<void> {
    try {
      // Get query parameters from request
      const sortBy = req.query.sortBy as string;  // e.g., 'newest', 'oldest', 'priceHighToLow', 'priceLowToHigh'
      const page = parseInt(req.query.page as string, 10) || 1;  // Defaults to page 1
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;  // Defaults to 10 items per page
      const search = req.query.search as string || ''; // Get search parameter if provided

      // Fetch listings from service with sorting, pagination, and search filter
      const listings = await this.listingService.getAllListings({ sortBy, page, pageSize, search });
  
      // If no listings, return 404
      if (listings.data.length === 0) {
        res.status(404).json({ message: translate("LISTING_NOT_AVAILABLE") });
        return;
      }
  
      // Respond with listings and pagination metadata
      res.status(200).json({
        data: listings.data,  // The paginated listings data
        meta: {
          totalItems: listings.totalItems,  // Total number of listings
          totalPages: listings.totalPages,  // Total number of pages
          currentPage: page,
          pageSize: pageSize,
        },
      });
    } catch (error: any) {
      console.error("Error fetching listings:", error.message);
      res.status(500).json({
        message: translate("ERROR_FETCHING_LISTINGS"),
        error: error.message,
      });
    }
  }
  
  /**
   * Search for listing with filters, pagination, and sorting
   * @param req - Express request object
   * @param res - Express response object
   */

  public async searchListing(req: Request, res: Response): Promise<void> {
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

      // Call the service method to search listings
      const result = await this.listingService.searchListings(searchOptions);

      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error searching listings:", error.message);
      res.status(500).json({
        message: translate("ERROR_SEARCHING_LISTINGS"),
        error: error.message,
      });
    }
  }

  /**
   * Query listings with advanced filtering and pagination.
   *
   * @function queryListings
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters for advanced filtering and pagination
   * @param {number} [req.query.page] - Page number for pagination
   * @param {number} [req.query.limit] - Number of results per page
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to a paginated list of listings matching the query
   */
  public async queryListings(req: Request, res: Response) {
    try {
      // Extract query parameters and convert to the expected format
      const { page = 1, limit = 10, ...queryParams } = req.query;
      const queryOptions = {
        page: Number(page),
        limit: Number(limit),
        queryParams,
      };
      const listings = await this.listingService.queryListings(queryOptions);

      res.status(200).json(listings);
    } catch (error: any) {
      res
        .status(404)
        .json({
          message: translate("ERROR_FETCHING_LISTING"),
          error: error.message,
        });
    }
  }

  /**
   * Upload media to a listing.
   * @param req - Express request object
   * @param res - Express response object
   */
  public async uploadMedia(req: Request, res: Response): Promise<void> {
    try {
      const { listingId, mediaType } = req.params;
      const files = req.files;
      const maps = req.body.maps;
      //TODO:Commenting for maps and media type insertion using extraction
      if (
        !listingId ||
        !mediaType ||
        (mediaType !== "map" && !files) ||
        (mediaType === "map" && !maps)
      ) {
        res.status(400).json({ message: translate("MISSING_PARAMETERS") });
        return;
      }
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      // Call the service method to upload the media
      const updatedListing = await this.listingService.uploadMedia(
        listingId,
        mediaType as "image" | "video" | "map",
        files,
        authHeader,
        maps
      );

      res.status(200).json(updatedListing);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error uploading media", error: error.message });
    }
  }

  /**
   * Upload media to a listing.
   * @param req - Express request object
   * @param res - Express response object
   */
  public async getImage(req: Request, res: Response): Promise<void> {
    try {
      const { listing_id } = req.params;
      const page = parseInt(req.query.page as string, 10) || 1;  // Defaults to page 1
      const limit = parseInt(req.query.limit as string, 10) || 10;  // Defaults to 10 items per page


      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      const result = await this.listingService.getImage(listing_id, authHeader, page, limit);

      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: translate("ERROR_FETCHING_IMAGE"),
          error: error.message,
        });
    }
  }
}

export default new ListingController();
