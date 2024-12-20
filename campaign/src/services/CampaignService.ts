import mongoose from 'mongoose';
import Campaign, { ICampaign } from '../models/Campaign';
import axios from 'axios';
import config from '../config/config';
import { extractUserIdFromToken, createDataRoomName, uploadFileToDataRoom, getOfferAndListingData } from '../utils/utils';
import { translate } from "../utils/i18n";
import { SortOrder } from 'mongoose';

export default class CampaignService {
    /**
     * Creates a new campaign.
     * @param campaignData - The campaign object containing all required details.
     * @param authHeader - The authorization header to extract the user ID.
     * @returns A promise that resolves to the complete campaign document.
     */
    public async createCampaign(campaignData: ICampaign, authHeader: string): Promise<ICampaign> {
        try {
            const {
                name,
                offering_id,
                main_picture,
                webinars,
                newsletters,
            } = campaignData;

            // Create and save the campaign
            const campaign = new Campaign({
                campaign_id: new mongoose.Types.ObjectId().toString(),
                name,
                offering_id,
                main_picture,
                webinars,
                newsletters,
            });

            const user = extractUserIdFromToken(authHeader);
            console.log(user);

            const offerData = await axios
                .get(
                    `${config.offeringServiceUrl}/api/offerings/${campaignData.offering_id}`,
                    {
                        headers: {
                            Authorization: authHeader,
                        },
                    }
                )
                .then((response) => {
                    console.log("GET_OFFERING");
                    return response.data;
                })
                .catch((error) => {
                    console.log(translate("ERROR_FETCH_OFFERING"), error.response);
                });
            if (!offerData) {
                 new Error(translate("NO_OFFERING_DATA"));
            }

            // Save the campaign
            const savedCampaign = await campaign.save();
            return savedCampaign;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Modifies an existing campaign.
     * @param campaignId - The ID of the campaign to modify.
     * @param updates - An object containing the fields to update in the campaign.
     * @returns A promise that resolves to the updated campaign document.
     */
    async modifyCampaign(campaignId: string, updates: Partial<ICampaign>): Promise<ICampaign> {
        try {
            if (!mongoose.isValidObjectId(campaignId)) {
                throw new Error(translate("INVALID_CAMPAIGN_ID"));
            }

            // Fetch the current campaign
            const currentCampaign = await Campaign.findOne({ campaign_id: campaignId });
            if (!currentCampaign) {
                throw new Error(translate("CAMPAIGN_NOT_FOUND"));
            }

            // Apply updates
            const updatedCampaignData = { ...currentCampaign.toObject(), ...updates };

            // Perform the update
            const updatedCampaign = await Campaign.findOneAndUpdate(
                { campaign_id: campaignId },
                updatedCampaignData,
                { new: true, runValidators: false }
            );
            if (!updatedCampaign) {
                throw new Error(translate("CAMPAIGN_NOT_FOUND"));
            }

            return updatedCampaign;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Retrieves a specific campaign based on the provided ID.
     * @param campaignId - The ID of the campaign to retrieve.
     * @returns A promise that resolves to the requested campaign document.
     */
    async findCampaignById(campaignId: string, authHeader: string) {
        try {
            if (!mongoose.isValidObjectId(campaignId)) {
                throw new Error(translate("INVALID_CAMPAIGN_ID"));
            }
            const campaignData = await Campaign.findOne({ campaign_id: campaignId, isDeleted: false });

            if (!campaignData) {
                throw new Error(translate("CAMPAIGN_NOT_FOUND"));
            }

            // Fetch the offering data
            const offerData = await axios
                .get(
                    `${config.offeringServiceUrl}/api/offerings/${campaignData.offering_id}`,
                    {
                        headers: {
                            Authorization: authHeader,
                        },
                    }
                )
                .then((response) => {
                    console.log("GET_OFFERING");
                    return response.data;
                })
                .catch((error) => {
                    console.log(translate("ERROR_FETCH_OFFERING"), error.response.data);
                });
            if (!offerData) {
                throw new Error(translate("NO_OFFERING_DATA"));
            }

            // Fetch the listing data
            const listingData = await axios
                .get(
                    `${config.listingServiceUrl}/api/listings/${offerData.Listing.listing_id}`,
                    {
                        headers: {
                            Authorization: authHeader,
                        },
                    }
                )
                .then((response) => {
                    console.log("GET_LISTING");
                    return response.data;
                })
                .catch((error) => {
                    console.log(translate("ERROR_FETCH_LISTING"), error.response.data);
                });

            if (!listingData) {
                throw new Error(translate("NO_LISTING_DATA"));
            }

            // Fetch the main picture
            let MainPictureDatails = {}
            if (campaignData.main_picture) {
                const fileData = await axios
                    .get(`${config.dataRoomServiceUrl}/files/${campaignData.main_picture}`, {
                        headers: {
                            Authorization: authHeader,
                        },
                    })
                    .then((response) => {
                        console.log("GET_FILE");
                        MainPictureDatails = response.data
                        return response.data;
                    })
                    .catch((error) => {
                        console.log(translate("ERROR_FETCH_FILE"), error.response.data);
                    });
            }

            const connectedData = {
                Campaign: campaignData,
                MainPictureDatails,
                Offering: offerData,
                Listing: listingData,
            };

            return connectedData
        } catch (error: any) {
            console.error('Error finding campaign:', error);
            throw new Error(error.message);
        }
    }

    /**
     * Retrieves all campaigns in the system, excluding soft-deleted campaigns.
     * @returns A promise that resolves to an array of all campaign documents.
     */
    async getAllCampaigns() {
        try {
            const campaigns = await Campaign.find({ isDeleted: false });
            return campaigns;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Deletes a campaign from the system.
     * @param campaignId - The ID of the campaign to delete.
     * @returns A promise that resolves to the deleted campaign document.
     */
    async deleteCampaign(campaignId: string) {
        try {
            const deletedCampaign = await Campaign.findOneAndUpdate({ campaign_id: campaignId }, { isDeleted: true }, { new: true, runValidators: false });
            return deletedCampaign;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Queries campaigns with advanced filtering and pagination.
     *
     * @function queryCampaigns
     * @param {Object} options - Query options
     * @param {number} [options.page=1] - Page number for pagination
     * @param {number} [options.limit=10] - Number of results per page
     * @param {Object} [options.queryParams] - Query parameters for advanced filtering
     * @returns {Promise<{
     *   offerings: any[];
     *   total: number;
     *   page: number;
     *   limit: number;
     *   pages: number;
     * }>} A promise that resolves to a paginated list of campaigns matching the query
     */
    async queryCampaigns(options: queryOptions): Promise<{
        campaigns: any[];
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
        const campaigns = await Campaign.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Get total count for pagination metadata
        const total = await Campaign.countDocuments(filter);

        // Send response with campaigns and pagination metadata
        return {
            campaigns,
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
        };
    }

    async searchCampaigns(options: SearchOptions): Promise<{
        campaigns: any[];
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
        const query = Campaign.find(filterObject)
            .sort(sortOptions)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const campaigns = await query.exec();
        const total = await Campaign.countDocuments(filterObject);

        return {
            campaigns,
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
        };
    }


    async uploadMedia(
        campaignId: string,
        files: any,
        authHeader: string,
    ): Promise<any> {
        try {
            const user = extractUserIdFromToken(authHeader);
            const userId = user!.userId;

            const campaign = await Campaign.findOne({ campaign_id: campaignId });
            if (!campaign) throw new Error(translate("CAMPAIGN_NOT_FOUND"));

            const offerData: any = await getOfferAndListingData(campaign.offering_id, authHeader);

            if (!offerData) throw new Error(translate("ERROR_FETCH_OFFERING"));
            if (!offerData.Listing) throw new Error(translate("LISTING_NOT_FOUND"));

            const dataroomId = offerData.Listing.dataroom_id;

            if (files && files.image) {
                const file = files.image;
                const fileBlob = new Blob([file.data], { type: file.mimetype });
                console.log("file.name from else =>", file.name);
                const response = await uploadFileToDataRoom(
                    fileBlob,
                    file.name,
                    userId.toString(),
                    campaign,
                    dataroomId
                );

                if (response._id) {
                    campaign.main_picture = response._id;
                }
            } else {
                throw new Error(translate("ERROR_UPLOADING_MEDIA"));
            }


            const updatedCampaign = await campaign.save();
            return updatedCampaign;
        } catch (error: any) {
            throw new Error(translate("ERROR_UPLOADING_MEDIA") + `${error.message}`);
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
