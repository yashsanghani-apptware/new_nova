import { Request, Response } from "express";
import mongoose, { SortOrder } from "mongoose";
import PortfolioService from "../services/portfolioServices";
import Portfolio from "../model/Portfolio";
import { translate, initI18n } from "../utils/i18n";
import { log } from "util";

class PortfolioController {
  private portfolioService: PortfolioService;

  constructor() {
    this.portfolioService = new PortfolioService();
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
   * Create a new portfolio.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to the created portfolio object
   */
  public async createPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const portfolioData = req.body;

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      // Call the service method to create the portfolio
      const savedPortfolio = await this.portfolioService.createPortfolio(
        portfolioData,
        authHeader
      );

      res.status(201).json(savedPortfolio);
    } catch (error: any) {
      // console.error("Error creating portfolio:", error);

      res.status(500).json({
        message: translate("ERROR_CREATING_PORTFOLIO"),
        error: error.message,
      });
    }
  }

  /**
   * Retrieve a specific portfolio by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to the retrieved portfolio object
   */
  public async getPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const { portfolio_id } = req.params;

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }

      // Call the service method to get the portfolio
      const portfolio = await this.portfolioService.getPortfolioById(
        portfolio_id,
        authHeader
      );

      if (!portfolio) {
        res.status(404).json({ message: translate("PORTFOLIO_NOT_FOUND") });
      }

      res.status(200).json(portfolio);
    } catch (error: any) {
      if (error.message.startsWith("Invalid")) {
        res.status(400).json({ message: error.message });
      } else if (error.message === translate("PORTFOLIO_NOT_FOUND")) {
        res.status(404).json({ message: translate("PORTFOLIO_NOT_FOUND") });
      } else {
        res.status(500).json({
          message: translate("ERROR_FETCHING_PORTFOLIO"),
          error: error.message,
        });
      }
    }
  }

  /**
   * Retrieve all portfolios.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to an array of all portfolios
   */
  public async getAllPortfolios(req: Request, res: Response): Promise<void> {
    try {
      const portfolios = await this.portfolioService.getAllPortfolios();

      if (portfolios.length === 0) {
        res
          .status(404)
          .json({ message: translate("PORTFOLIOS_NOT_AVAILABLE") });
        return;
      }

      res.status(200).json(portfolios);
    } catch (error: any) {
      console.error("Error fetching portfolios:", error.message);
      res.status(500).json({
        message: translate("ERROR_FETCHING_PORTFOLIOS"),
        error: error.message,
      });
    }
  }

  /**
   * Update an existing portfolio by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to the updated portfolio object
   */
  public async updatePortfolio(req: Request, res: Response): Promise<void> {
    try {
      const { portfolio_id } = req.params;
      const updateData = req.body;
      // Call the service
      const updatedoffering = await this.portfolioService.modifyPortfolio(
        portfolio_id,
        updateData
      );

      res.status(200).json(updatedoffering);
    } catch (error: any) {
      if (error.message.startsWith("Invalid")) {
        res.status(400).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: translate("ERROR_UPDATING_PORTFOLIO") });
      }
    }
  }

  /**÷÷÷
   * Delete a specific portfolio by its ID.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves when the portfolio is deleted
   */
  public async deletePortfolio(req: Request, res: Response): Promise<void> {
    try {
      const { portfolio_id } = req.params;

      const deletedPortfolio = await this.portfolioService.deletePortfolio(
        portfolio_id
      );

      if (!deletedPortfolio) {
        res.status(404).json({
          message: translate("PORTFOLIO_NOT_FOUND"),
          error: translate("PORTFOLIO_NOT_FOUND"),
        });
        return;
      }

      res.status(200).json({
        message: translate("PORTFOLIO_DELETED"),
        portfolio_id: deletedPortfolio.portfolio_id,
      });
    } catch (error: any) {
      console.error("Error deleting portfolio:", error.message);
      res.status(500).json({
        message: translate("ERROR_DELETING_PORTFOLIO"),
        error: error.message,
      });
    }
  }

  /**
   * Search for portfolios with filters, pagination, and sorting
   * @param req - Express request object
   * @param res - Express response object
   */

  public async searchPortfolios(req: Request, res: Response): Promise<void> {
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

      // Call the service method to search portfolios
      const result = await this.portfolioService.searchPortfolios(
        searchOptions
      );

      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error searching portfolios:", error.message);
      res.status(500).json({
        message: translate("ERROR_SEARCHING_PORTFOLIOS"),
        error: error.message,
      });
    }
  }

  /**
   * Query portfolios with advanced filtering and pagination.
   *
   * @function queryportfolios
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters for advanced filtering and pagination
   * @param {number} [req.query.page] - Page number for pagination
   * @param {number} [req.query.limit] - Number of results per page
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to a paginated list of portfolios matching the query
   */
  public async queryPortfolios(req: Request, res: Response): Promise<void> {
    try {
      // Extract query parameters and convert to the expected format

      const { page = 1, limit = 10, ...queryParams } = req.query;
      const queryOptions = {
        page: Number(page),
        limit: Number(limit),
        queryParams,
      };
      const portfolios = await this.portfolioService.queryPortfolios(
        queryOptions
      );

      res.status(200).json(portfolios);
    } catch (error: any) {
      res.status(404).json({
        message: translate("ERROR_FETCHING_PORTFOLIOS"),
        error: error.message,
      });
    }
  }

  /**
   * Retrieve all portfolios for a specific user.
   *
   * @param {Request} req - Express request object containing the user ID in req.params.id
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Returns a promise that resolves to an array of all portfolios for the user
   */
  public async getPortfoliosByUser(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: translate("UNAUTHORIZED") });
        return;
      }
      const portfolios = await this.portfolioService.getPortfoliosByUser(
        user_id,
        authHeader
      );

      res.status(200).json(portfolios);
    } catch (error: any) {
      res.status(404).json({
        message: translate("ERROR_FETCHING_PORTFOLIOS"),
        error: error.message,
      });
    }
  }
}

export default new PortfolioController();
