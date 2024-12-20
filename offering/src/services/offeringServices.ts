import axios from "axios";
import Offering, { IOffering, IInvestmentOverview, IFinancialDetails, IDetails, IDocuments, Crop } from "../model/Offering";
import mongoose, { SortOrder } from "mongoose";
import config from "../config";
import { translate } from "../utils/i18n";
// import { translate, initI18n } from "../utils/i18n";
import { extractUserIdFromToken, uploadFileToDataRoom } from "../utils/utils";
import Subscription from "../model/Subscription";

export default class OfferingService {
  /**
   * Creates a new offering in the Agsiri platform.
   * @param offering - The offering object containing all required details.
   * @returns A promise that resolves to the complete offering document.
   */
  public async createOffering(
    OfferingData: IOffering,
    authHeader: string
  ): Promise<IOffering> {
    try {
      // Create and save the offering
      let listingUrl = `${config.listingServiceUrl}/listings/${OfferingData.listing_id}`;
      const listingData = await axios
        .get(
          // `${config.listingServiceUrl}/api/listings/${OfferingData.listing_id}`,
          listingUrl,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )
        .then((response: any) => {
          return response.data;
        })
        .catch((error: any) => {
          console.log(translate("ERROR_FETCH_LISTING"), error.response?.data);
        });
      if (!listingData) {
        throw new Error(translate("NO_LISTING_DATA"));
      }


      let offering_id = new mongoose.Types.ObjectId();
      const offering = new Offering({ ...OfferingData, offering_id });

      const savedOffering = await offering.save();
      return savedOffering;
    } catch (error: any) {
      console.log("Error creating offering:", error);

      throw new Error(error.message);
    }
  }

  /**
   * Retrieves a specific offering based on the provided ID.
   * @param offeringId - The ID of the offering to retrieve.
   * @returns A promise that resolves to the requested offering document.
   */
  public async getOfferById(
    id: string,
    authHeader: string
  ): Promise<object> {
    try {
      const offeringId = id;
      const listing_id = id;
      let offering;

      if (!mongoose.isValidObjectId(offeringId)) {
        throw new Error(translate("INVALID_OFFERING_ID"));
      }
       offering = await Offering.findOne({
        offering_id: offeringId, 
        isDeleted: false,
      }).exec();

      if (!offering && listing_id) {
        offering = await Offering.findOne({
          listing_id,
          isDeleted: false,
        }).exec();
      }
      
      if (!offering) {
        throw new Error(translate("OFFERING_NOT_FOUND"));
      }

      if (offering.documents) {
        let investor_memo = offering.documents?.investor_memo;
        let investor_documents = offering.documents?.investor_documents;
        let compliance_audits = offering.documents?.compliance_audits;

        // if investor_memo is not empty then call the dataroom file module and get the file data
        if (investor_memo) {
          const fileData = await axios
            .get(`${config.dataRoomServiceUrl}/files/${investor_memo}`, {
              headers: {
                Authorization: authHeader,
              },
            })
            .then((response) => {
              return response.data;
            })
            .catch((error) => {
              console.error("GET_FILE_ERROR", error);
            })
          offering.documents.investor_memo = fileData?.content_url;
        }

        // if investor_documents is not empty then call the dataroom file module and get the file data
        if (investor_documents) {
          for (let i = 0; i < investor_documents.length; i++) {
            const fileData = await axios
              .get(`${config.dataRoomServiceUrl}/files/${investor_documents[i]}`, {
                headers: {
                  Authorization: authHeader,
                },
              })
              .then((response) => {
                return response.data;
              })
              .catch((error) => {
                console.error("GET_FILE_ERROR", error);
              });
            offering.documents.investor_documents[i] = fileData?.content_url;
          }
        }

        // if compliance_audits is not empty then call the dataroom file module and get the file data
        if (compliance_audits) {
          for (let i = 0; i < compliance_audits.length; i++) {
            const fileData = await axios
              .get(`${config.dataRoomServiceUrl}/files/${compliance_audits[i]}`, {
                headers: {
                  Authorization: authHeader,
                },
              })
              .then((response) => {
                return response.data;
              })
              .catch((error) => {
                console.error("GET_FILE_ERROR", error);
              })
            offering.documents.compliance_audits[i] = fileData?.content_url;
          }
        }


      }

      const connectedData = {
        Offering: offering,
        // Listing: listingData,
      };

      return connectedData;
    } catch (error: any) {
      // console.error("Error fetching offering:", error);
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves all offerings from the listing service.
   * @returns A promise that resolves to an array of all listing documents.
   */
  public async getAllOfferings(authHeader: string): Promise<object[]> {
    try {
      const user = extractUserIdFromToken(authHeader);
      const offerings = await Offering.find({ isDeleted: false }).exec(); // Ensure you call .exec() for a proper promise
      
      const offerWithSubscription: any = [];
      if (offerings.length > 0) {
        // get subsciptions for each offering
        for (let i = 0; i < offerings.length; i++) {
          const offering = offerings[i];
          const offering_id = offering.offering_id;
          const subscription = await Subscription.findOne({
            offering_id: offering_id,
            user_id: user?.userId,
            is_deleted: false,
          })

          // Create a plain JavaScript object copy of the offering
          const offeringCopy: any = offering.toObject();

          if (subscription) {
            offeringCopy['is_user_subscribed'] = true;
            offeringCopy['subscription_id'] = subscription.subscription_id;
          } else {
            offeringCopy['is_user_subscribed'] = false; // Default value
            offeringCopy['subscription_id'] = null; // Default value
          }
          offerWithSubscription.push(offeringCopy)
        }
      }

      return offerWithSubscription;
    } catch (error) {
      throw new Error(translate("ERROR_FETCHING_OFFERINGS"));
    }
  }

  /**
   * Modifies an existing offering.
   * @param offeringId - The ID of the offering to modify.
   * @param updates - An object containing the fields to update in the offering.
   * @returns A promise that resolves to the updated offering document.
   */
  async modifyOffering(offeringId: string, updates: IOffering): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(offeringId)) {
        throw new Error(translate("INVALID_OFFERING_ID"));
      }

      // Validate update data
      this.validateUpdateData(updates);
      // Fetch the current offering
      const currentOffering = await Offering.findOne({
        offering_id: offeringId,
        isDeleted: false,
      });
      if (!currentOffering) {
        throw new Error(translate("OFFERING_NOT_FOUND"));
      }
      // Prepare the updated data
      const updatedOfferingData = { ...currentOffering.toObject() };

      // Apply updates
      if (updates.name) {
        updatedOfferingData.name = updates.name;
      }

      if (updates.listing_id) {
        updatedOfferingData.listing_id = updates.listing_id;
      }

      if (updates.workflows) {
        updatedOfferingData.workflows = updates.workflows;
      }

      if (updates.value_driver) {
        updatedOfferingData.value_driver = updates.value_driver;
      }

      if (updates.expected_returns) {
        const {
          target_net_irr,
          target_net_yield,
          net_equity_multiple,
          target_hold,
          target_net_returns,
        } = updates.expected_returns;
        updatedOfferingData.expected_returns = {
          ...updatedOfferingData.expected_returns,
          target_net_irr:
            target_net_irr !== undefined
              ? target_net_irr
              : (updatedOfferingData.expected_returns
                ?.target_net_irr as string),
          target_net_yield:
            target_net_yield !== undefined
              ? target_net_yield
              : (updatedOfferingData.expected_returns
                ?.target_net_yield as string),
          net_equity_multiple:
            net_equity_multiple !== undefined
              ? net_equity_multiple
              : (updatedOfferingData.expected_returns
                ?.net_equity_multiple as string),
          target_hold:
            target_hold !== undefined
              ? target_hold
              : (updatedOfferingData.expected_returns?.target_hold as string),
          target_net_returns:
            target_net_returns !== undefined
              ? target_net_returns
              : (updatedOfferingData.expected_returns
                ?.target_net_returns as string),
        };
      }

      if (updates.details) {
        const {
          valid_from_date,
          valid_to_date,
          total_shares,
          shares_remaining,
          holding_period,
          minimum_holding_shares,
          maximum_holding_shares,
          subscription_start_date,
          subscription_end_date,
        } = updates.details;
      }

      if (updates.documents) {
        const { investor_memo, investor_documents, compliance_audits } =
          updates.documents;
        updatedOfferingData.documents = {
          ...updatedOfferingData.documents,
          investor_memo:
            investor_memo !== undefined
              ? investor_memo
              : (updatedOfferingData.documents?.investor_memo as string),
          investor_documents:
            investor_documents !== undefined
              ? investor_documents
              : (updatedOfferingData.documents?.investor_documents as string[]),
          compliance_audits:
            compliance_audits !== undefined
              ? compliance_audits
              : (updatedOfferingData.documents?.compliance_audits as string[]),
        };
      }

      if(updates.status) {
        updatedOfferingData.status = updates.status
      }

      if (updates.investment_overview) {
        updatedOfferingData.investment_overview = updates.investment_overview
      }

      if (updates.financial_details) {
        updatedOfferingData.financial_details = updates.financial_details
      }

      if (updates.details) {
        updatedOfferingData.details = updates.details
      }

      // Perform the update
      const updatedoffering = await Offering.findOneAndUpdate(
        { offering_id: offeringId },
        updatedOfferingData,
        { new: true, runValidators: false } // runValidators: false to bypass schema validation errors
      );
      if (!updatedoffering) {
        throw new Error(translate("OFFERING_NOT_FOUND"));
      }

      return updatedoffering;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private validateUpdateData(updateData: IOffering): void {
    if (updateData.name && typeof updateData.name !== "string") {
      throw new Error(translate("INVALID_NAME"));
    }

    if (updateData.listing_id && typeof updateData.listing_id !== "string") {
      throw new Error(translate("INVALID_LISTING_ID"));
    }

    if (updateData.workflows && typeof updateData.workflows !== "object") {
      throw new Error(translate("INVALID_WORKFLOWS"));
    }

    if (
      updateData.value_driver &&
      typeof updateData.value_driver !== "object"
    ) {
      throw new Error(translate("INVALID_VALUE_DRIVER"));
    }

    if (
      updateData.expected_returns &&
      typeof updateData.expected_returns !== "object"
    ) {
      throw new Error(translate("INVALID_EXPECTED_RETURNS"));
    }

    if (updateData.details && typeof updateData.details !== "object") {
      throw new Error(translate("INVALID_DETAILS"));
    }

    if (updateData.documents && typeof updateData.documents !== "object") {
      throw new Error(translate("INVALID_DOCUMENTS"));
    }

    if (updateData.documents) {
      let file_id = updateData.documents?.investor_documents;
      file_id?.push(updateData.documents?.investor_memo);
      for (let i = 0; i < file_id.length; i++) {
        if (!mongoose.isValidObjectId(updateData.documents?.investor_memo)) {
          throw new Error(translate("INVALID_DOCUMENTS_FILE_ID"));
        }
      }
      file_id.pop();
    }
  }

  /**
   * Deletes a offering from the offering service.
   * @param offeringId - The ID of the offering to delete.
   * @returns A promise that resolves to a success message or the deleted offering document.
   */
  public async deleteOffering(offeringId: string) {
    try {
      const deletedOffering = await Offering.findOneAndUpdate(
        { offering_id: offeringId, isDeleted: false },
        { isDeleted: true },
        { new: true, runValidators: false }
      );
      return deletedOffering;
    } catch (error) {
      throw new Error(translate("ERROR_DELETING_OFFERING"));
    }
  }

  /**
   * Searches for offerings based on various criteria.
   * @param criteria - An object containing search criteria such as location, property type, and size.
   * @returns A promise that resolves to an array of offerings that match the search criteria.
   */
  public async searchOfferings(options: SearchOptions): Promise<{
    offerings: any[];
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
    const query = Offering.find(filterObject)
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const offerings = await query.exec();
    const total = await Offering.countDocuments(filterObject);

    return {
      offerings,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    };
  }

  public async queryOfferings(options: queryOptions): Promise<{
    offerings: any[];
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
    const offerings = await Offering.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination metadata
    const total = await Offering.countDocuments(filter);

    // Send response with offerings and pagination metadata
    return {
      offerings,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    };
  }

  /**
   * Updates or creates an offering's documents.
   * @param offeringId - The ID of the offering to update, or `null` to create a new offering.
   * @param files - The document files to upload.
   * @param authHeader - The authorization header to extract the user ID.
   * @returns A promise that resolves to the updated or newly created offering document.
   */
  public async updateDocuments(
    offeringId: string | null,
    files: any,
    authHeader: string,
  ): Promise<any> {
    try {
      // const organizationId = new mongoose.Types.ObjectId(); // question: this should be the USER id
      const user = extractUserIdFromToken(authHeader);
      const userId = user!.userId;
      let offering;
      let listingDetails;
      let documents = {
        investor_memo: null as any,
        investor_documents: [],
        compliance_audits: [],
      } as IDocuments;


      // Check if the offering exists and update it
      if (!mongoose.isValidObjectId(offeringId)) {
        throw new Error(translate("INVALID_OFFERING_ID"));
      }

      offering = await Offering.findOne(
        { offering_id: offeringId, isDeleted: false }
      ).exec();

      if (!offering) {
        throw new Error(translate("OFFERING_NOT_FOUND"));
      }

      documents = (offering.documents) ? offering.documents : documents;

      // call API to check if listing exists
      let listingUrl = `${config.listingServiceUrl}/listings/${offering.listing_id}`;
      listingDetails = await axios
        .get(
          listingUrl,
          {
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          return response.data;
        })

      if (files) {
        if (files.investor_memo) {
          const file = files.investor_memo;
          const fileBlob = new Blob([file.data], { type: file.mimetype });
          const response = await uploadFileToDataRoom(
            fileBlob,
            file.name,
            userId.toString(),
            listingDetails,
          );

          documents['investor_memo'] = response?._id;
        }

        if (files.investor_documents) {
          if (Array.isArray(files.investor_documents)) {
            for (const file of files.investor_documents) {
              const fileBlob = new Blob([file.data], { type: file.mimetype });
              const response = await uploadFileToDataRoom(
                fileBlob,
                file.name,
                userId.toString(),
                listingDetails,
              );

              documents['investor_documents'].push(response?._id);
            }
          } else {
            const file = files.investor_documents;
            const fileBlob = new Blob([file.data], { type: file.mimetype });
            const response = await uploadFileToDataRoom(
              fileBlob,
              file.name,
              userId.toString(),
              listingDetails,
            );

            documents['investor_documents'].push(response?._id);
          }
        }
        if (files.compliance_audits) {
          if (Array.isArray(files.compliance_audits)) {
            for (const file of files.compliance_audits) {
              const fileBlob = new Blob([file.data], { type: file.mimetype });
              const response = await uploadFileToDataRoom(
                fileBlob,
                file.name,
                userId.toString(),
                listingDetails,
              );

              documents['compliance_audits'].push(response?._id);
            }
          } else {
            const file = files.compliance_audits;
            const fileBlob = new Blob([file.data], { type: file.mimetype });
            const response = await uploadFileToDataRoom(
              fileBlob,
              file.name,
              userId.toString(),
              listingDetails,
            );

            documents['compliance_audits'].push(response?._id);
          }
        }
      } else {
        throw new Error("No document file provided");
      }

      // Update the offering with the documents
      offering.documents = documents;
      await offering.save();
      return offering;
    } catch (error: any) {
      throw new Error(`Error uploading media: ${error?.response?.data.message || error.message}`);
    }
  }

  public async getCrop(): Promise<any> {
    const crop = await Crop.find({}).exec();
    if(crop.length > 0) {
      return crop[0]
    }
    return crop;
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
