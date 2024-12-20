import axios from "axios";
import Portfolio, {
  IPortfolio,
  //  IInvestmentOverview, IFinancialDetails, IDetails, IDocuments,
  // Crop
} from "../model/Portfolio";
import mongoose, { SortOrder } from "mongoose";
import config from "../config";
import { translate } from "../utils/i18n";
import { log } from "util";

export default class PortfolioService {
  /**
   * Creates a new portfolio in the Agsiri platform.
   * @param portfolio - The portfolio object containing all required details.
   * @returns A promise that resolves to the complete portfolio document.
   */
  public async createPortfolio(
    PortfolioData: any,
    authHeader: string
  ): Promise<IPortfolio> {
    try {
      try {
        const { user_id, investments } = PortfolioData;

        // Check if a portfolio for the given user_id exists
        let existingPortfolio = await Portfolio.findOne({ user_id });

        if (existingPortfolio) {
          // User exists, update the investments array
          existingPortfolio.investments.push(...investments);

          // Update the `updated_at` field
          existingPortfolio.updated_at = new Date();

          // Save the updated portfolio
          await existingPortfolio.save();
          console.log("Portfolio updated successfully:", existingPortfolio);
          return existingPortfolio;
        } else {
          // User does not exist, create a new portfolio
          const portfolio_id = new mongoose.Types.ObjectId();
          const newPortfolio = new Portfolio({
            ...PortfolioData,
            portfolio_id,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });

          const savedPortfolio = await newPortfolio.save();
          console.log("New portfolio created successfully:", savedPortfolio);
          return savedPortfolio;
        }
      } catch (error) {
        console.error("Error saving or updating portfolio:", error);
        throw error;
      }
      // return savedPortfolio;
    } catch (error: any) {
      console.log("Error creating portfolio:", error);
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves a specific portfolio based on the provided ID.
   * @param portfolioId - The ID of the portfolio to retrieve.
   * @returns A promise that resolves to the requested portfolio document.
   */
  public async getPortfolioById(
    id: string,
    authHeader: string
  ): Promise<object> {
    try {
      const portfolioId = id;
      const listing_id = id;
      let portfolio;

      if (!mongoose.isValidObjectId(portfolioId)) {
        throw new Error(translate("INVALID_PORTFOLIO_ID"));
      }
      portfolio = await Portfolio.findOne({
        portfolio_id: portfolioId,
        is_deleted: false,
      }).exec();

      if (!portfolio) {
        throw new Error(translate("PORTFOLIO_NOT_FOUND"));
      }

      return portfolio;
    } catch (error: any) {
      // console.error("Error fetching portfolio:", error);
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves all portfolios from the listing service.
   * @returns A promise that resolves to an array of all listing documents.
   */
  public async getAllPortfolios(): Promise<object[]> {
    try {
      const portfolios = await Portfolio.find({ is_deleted: false }).exec(); // Ensure you call .exec() for a proper promise
      return portfolios;
    } catch (error) {
      throw new Error(translate("ERROR_FETCHING_PORTFOLIOS"));
    }
  }

  /**
   * Modifies an existing portfolio.
   * @param portfolioId - The ID of the portfolio to modify.
   * @param updates - An object containing the fields to update in the portfolio.
   * @returns A promise that resolves to the updated portfolio document.
   */
  async modifyPortfolio(
    portfolioId: string,
    updates: Partial<IPortfolio>
  ): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(portfolioId)) {
        throw new Error(translate("INVALID_PORTFOLIO_ID"));
      }

      // Validate update data
      this.validateUpdateData(updates);

      // Fetch the current portfolio
      const currentPortfolio = await Portfolio.findOne({
        portfolio_id: portfolioId,
        is_deleted: false,
      });

      if (!currentPortfolio) {
        throw new Error(translate("PORTFOLIO_NOT_FOUND"));
      }

      // Apply updates
      const updatedPortfolioData: Partial<IPortfolio> = {
        ...currentPortfolio.toObject(),
      };

      // Update core fields
      if (updates.user_id) updatedPortfolioData.user_id = updates.user_id;
      if (updates.is_deleted !== undefined)
        updatedPortfolioData.is_deleted = updates.is_deleted;

      // Update investments
      if (updates.investments) {
        // Replace investments or merge logic (choose based on requirements)
        updatedPortfolioData.investments = updates.investments;
      }

      // Ensure `updated_at` is refreshed
      updatedPortfolioData.updated_at = new Date();

      // Perform the update
      const updatedPortfolio = await Portfolio.findOneAndUpdate(
        { portfolio_id: portfolioId },
        updatedPortfolioData,
        { new: true, runValidators: false }
      );

      if (!updatedPortfolio) {
        throw new Error(translate("PORTFOLIO_NOT_FOUND"));
      }

      return updatedPortfolio;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private validateUpdateData(updateData: Partial<IPortfolio>): void {
    if (updateData.user_id && typeof updateData.user_id !== "string") {
      throw new Error(translate("INVALID_USER_ID"));
    }

    if (updateData.investments) {
      if (!Array.isArray(updateData.investments)) {
        throw new Error(translate("INVALID_INVESTMENTS"));
      }
      updateData.investments.forEach((investment) => {
        if (
          !investment.offering_id ||
          typeof investment.offering_id !== "string"
        ) {
          throw new Error(translate("INVALID_OFFERING_ID"));
        }
        if (
          investment.status &&
          !["ACTIVE", "CLOSED"].includes(investment.status)
        ) {
          throw new Error(translate("INVALID_INVESTMENT_STATUS"));
        }
      });
    }

    // Other validations (documents, details, etc.) remain unchanged
  }

  /**
   * Deletes a portfolio from the portfolio service.
   * @param portfolioId - The ID of the portfolio to delete.
   * @returns A promise that resolves to a success message or the deleted portfolio document.
   */
  public async deletePortfolio(portfolioId: string) {
    try {
      const deletedPortfolio = await Portfolio.findOneAndUpdate(
        { portfolio_id: portfolioId, is_deleted: false },
        { is_deleted: true },
        { new: true, runValidators: false }
      );
      return deletedPortfolio;
    } catch (error) {
      throw new Error(translate("ERROR_DELETING_PORTFOLIO"));
    }
  }

  /**
   * Searches for portfolios based on various criteria.
   * @param criteria - An object containing search criteria such as location, property type, and size.
   * @returns A promise that resolves to an array of portfolios that match the search criteria.
   */
  public async searchPortfolios(options: SearchOptions): Promise<{
    portfolios: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    const { page, limit, sort, order, filters } = options;

    // Convert query parameters to correct types
    const pageNumber = page;
    const limitNumber = limit;
    const sortOptions: Record<string, 1 | -1> = {
      [sort]: order === "desc" ? -1 : 1,
    };

    // Construct filters with regex for partial and case-insensitive search
    const filterObject: Record<string, any> = {};
    for (const [key, value] of Object.entries(filters)) {
      // Check if value is provided
      if (value) {
        filterObject[key] = { $regex: value, $options: "i" }; // 'i' for case-insensitive regex
      }
    }

    // Construct the query with filtering, sorting, and pagination
    const query = Portfolio.find({ ...filterObject, is_deleted: false })
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const portfolios = await query.exec();
    const total = await Portfolio.countDocuments({
      ...filterObject,
      is_deleted: false,
    });

    return {
      portfolios,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    };
  }

  public async queryPortfolios(options: queryOptions): Promise<{
    portfolios: any[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const { page = 1, limit = 10, queryParams } = options;

    // Calculate skip value based on the current page and limit
    const skip = (Number(page) - 1) * Number(limit);

    // Explicitly cast the sort order
    const sort: { [key: string]: SortOrder } = { createdAt: -1 as SortOrder };

    // Create a filter object based on the query parameters
    const filter: Record<string, any> = {};

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && typeof value === "object") {
        filter[key] = {
          [`${Object.keys(value)[0]}`]:
            Number(Object.values(value)[0]) || Object.values(value)[0],
        };
      } else {
        filter[key] = Number(value) || value;
      }
    });

    // Execute the query with filtering, sorting, and pagination
    const portfolios = await Portfolio.find({ ...filter, is_deleted: false })
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination metadata
    const total = await Portfolio.countDocuments({
      ...filter,
      is_deleted: false,
    });

    // Send response with portfolios and pagination metadata
    return {
      portfolios,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    };
  }

  /**
   * Retrieve all portfolios for a specific user.
   *
   * @param user_id - The User ID of the portfolio to retrieve.
   * @returns A promise that resolves to the requested portfolio document.
   */
  public async getPortfoliosByUser(
    id: string,
    authHeader: string
  ): Promise<object> {
    try {
      const user_id = id;

      if (!mongoose.isValidObjectId(user_id)) {
        throw new Error(translate("INVALID_PORTFOLIO_ID"));
      }
      const mergedPortfolios: IPortfolio[] = [];

      const portfolios = await Portfolio.find({
        user_id,
        is_deleted: false,
      }).exec();

      if (portfolios.length === 0) {
        return { message: translate("PORTFOLIOS_NOT_AVAILABLE_BY_USER") };
      }
      return portfolios[0];
    } catch (error: any) {
      console.error("Error fetching portfolios by user:", error.message);
      throw new Error(error.message);
    }
  }
}

interface queryOptions {
  page: number;
  limit: number;
  queryParams: any;
}

interface SearchOptions {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  filters: Record<string, string | undefined>;
}
