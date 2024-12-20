import { Request, Response } from 'express';
import CampaignService from '../services/CampaignService';
import { translate } from '../utils/i18n';

export default class CampaignController {
    private static campaignService = new CampaignService();

    /**
     * Creates a new campaign.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    public static async createCampaign(req: Request, res: Response): Promise<void> {
        try {
            const campaignData = req.body;
            const authHeader = req.headers.authorization || '';
            const campaign = await CampaignController.campaignService.createCampaign(campaignData, authHeader);
            res.status(201).json(campaign);
        } catch (error: any) {
            res.status(500).json({
                message: translate("ERROR_CREATING_CAMPAIGN"),
                error: error.message
            });
        }
    }

    /**
     * Modifies an existing campaign.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    public static async modifyCampaign(req: Request, res: Response): Promise<void> {
        try {
            const { campaignId } = req.params;
            const updates = req.body;
            const updatedCampaign = await CampaignController.campaignService.modifyCampaign(campaignId, updates);
            res.status(200).json(updatedCampaign);
        } catch (error: any) {
            res.status(500).json({
                message: translate("ERROR_MODIFYING_CAMPAIGN"), error: error.message
            });
        }
    }

    /**
     * Retrieves a specific campaign by its ID.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns A promise that resolves to a JSON response with the campaign document.
     */
    public static async getCampaign(req: Request, res: Response): Promise<void> {
        try {
            const { campaignId } = req.params;
            const authHeader = req.headers.authorization || '';

            console.log({ campaignId });
            const campaign = await CampaignController.campaignService.findCampaignById(campaignId, authHeader);

            if (!campaign) {
                res.status(404).json({ message: translate("CAMPAIGN_NOT_FOUND"), error: translate("CAMPAIGN_NOT_FOUND") });
                return;
            }

            res.status(200).json(campaign);
        } catch (error: any) {
            console.error('Error fetching campaign:', error);
            res.status(500).json({ message: translate("ERROR_FETCHING_CAMPAIGN"), error: error.message });
        }
    }


    /**
     * Retrieves all campaigns in the system, excluding soft-deleted campaigns.
     *
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns A promise that resolves to an array of all campaign documents.
     */
    public static async getAllCampaigns(req: Request, res: Response): Promise<void> {
        try {
            const campaigns = await CampaignController.campaignService.getAllCampaigns();
            res.status(200).json(campaigns);
        } catch (error: any) {
            res.status(500).json({ message: translate("ERROR_FETCHING_CAMPAIGN"), error: error.message });
        }
    }


    /**
     * Deletes a campaign from the system.
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns A promise that resolves to a JSON response with a message and the campaign ID.
     */
    public static async deleteCampaign(req: Request, res: Response): Promise<void> {
        try {
            const { campaignId } = req.params;
            const deletedCampaign = await CampaignController.campaignService.deleteCampaign(campaignId);

            if (!deletedCampaign) {
                res.status(404).json({ message: translate('CAMPAIGN_NOT_FOUND'), error: translate("CAMPAIGN_NOT_FOUND") });
                return;
            }

            res.status(200).json({ message: translate("CAMPAIGN_DELETED_SUCCESSFULLY"), campaign_id: deletedCampaign.campaign_id });
        } catch (error: any) {
            res.status(500).json({ message: translate("ERROR_FETCHING_CAMPAIGN"), error: error.message });
        }
    }



    /**
     * Queries campaigns with advanced filtering and pagination.
     *
     * @function queryCampaigns
     * @param {Object} req - Express request object
     * @param {Object} req.query - Query parameters for advanced filtering and pagination
     * @param {number} [req.query.page=1] - Page number for pagination
     * @param {number} [req.query.limit=10] - Number of results per page
     * @param {Object} res - Express response object
     * @returns {Promise<void>} Returns a promise that resolves to a paginated list of campaigns matching the query
     */
    public static async queryCampaigns(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 10, ...queryParams } = req.query;
            const queryOptions = {
                page: Number(page),
                limit: Number(limit),
                queryParams
            }
            const campaigns = await CampaignController.campaignService.queryCampaigns(queryOptions);

            res.status(200).json(campaigns);
        } catch (error: any) {
            res
                .status(500)
                .json({ message: translate("ERROR_FETCHING_CAMPAIGNS"), error: error.message });
        }
    }


    /**
     * Searches for campaigns with advanced filtering and pagination.
     *
     * @function searchCampaigns
     * @param {Object} req - Express request object
     * @param {Object} req.query - Query parameters for advanced filtering and pagination
     * @param {string} [req.query.page=1] - Page number for pagination
     * @param {string} [req.query.limit=10] - Number of results per page
     * @param {string} [req.query.sort=created_at] - Sort field
     * @param {string} [req.query.order=desc] - Sort order
     * @param {Object} res - Express response object
     * @returns {Promise<void>} Returns a promise that resolves to a paginated list of campaigns matching the query
     */
    public static async searchCampaigns(req: Request, res: Response): Promise<void> {
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

            // Call the service method to search campaigns
            const result = await CampaignController.campaignService.searchCampaigns(searchOptions);

            res.status(200).json(result);
        } catch (error: any) {
            console.error("Error searching campaigns:", error.message);
            res.status(500).json({
                message: translate("ERROR_SEARCHING_CAMPAIGNS"),
                error: error.message,
            });
        }
    }


    /**
    * Upload media to a Campaign.
    * @param req - Express request object
    * @param res - Express response object
    */
    public static async uploadMedia(req: Request, res: Response): Promise<void> {
        try {
            const { campaignId } = req.params;
            const files = req.files;

            if ((!campaignId) || (!files)) {
                res.status(400).json({ message: translate("MISSING_PARAMETERS") });
                return;
            }
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({ message: translate("UNAUTHORIZED") });
                return;
            }

            // Call the service method to upload the media
            const updatedCampaign = await CampaignController.campaignService.uploadMedia(
                campaignId,
                files,
                authHeader,
            );

            res.status(200).json(updatedCampaign);
        } catch (error: any) {
            res.status(500).json({ message: translate("ERROR_UPLOADING_MEDIA"), error: error.message });
        }
    }
}
