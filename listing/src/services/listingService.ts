import axios from "axios";
import Listing from "../models/Listing";
import mongoose, { SortOrder } from "mongoose";
import { MapData, validateMap } from "../utils/utils";
import {
  createDataRoomName,
  extractUserIdFromToken,
  uploadFileToDataRoom,
} from "../utils/utils";
import config from "../config/config";
import { translate, initI18n } from "../utils/i18n";

export default class ListingService {
  /**
   * Creates a new listing in the Agsiri platform.
   * @param listing - The listing object containing all required details.
   * @returns A promise that resolves to the complete listing document.
   */
  public async createListing(
    listingData: Listing,
    authHeader: string
  ): Promise<object> {
    try {
      const {
        name,
        address,
        property_description,
        property_highlights,
        days_on_market,
        type,
        built_on,
        renovated_on,
        listing_agent,
        dataroom_id,
        workflows,
        images,
        videos,
        maps,
        property_details,
        sales_and_tax,
        public_facts,
        schools,
        listing_source,
        status,
      } = listingData;
      // Check if listing with the same name and house number already exists
      const existingListing = await Listing.findOne({
        name: name,
        "address.house_number": address.house_number,
      });

      if (existingListing) {
        let oldPrice = existingListing?.property_details?.financial?.price as {
          price: number;
          currency: string;
        };

        let newPrice = listingData?.property_details.financial?.price;

        if (
          existingListing.status != listingData.status ||
          (existingListing &&
            existingListing.property_details &&
            existingListing.property_details.financial &&
            existingListing.property_details.financial.price &&
            oldPrice?.price &&
            oldPrice?.price != newPrice.price)
        ) {
          if (newPrice?.price != 0) {
           
            const payload = {
              status: String(listingData.status),
              property_details: {
                financial: {
                  TaxInformation: (existingListing.property_details &&
                    existingListing.property_details.financial &&
                    typeof existingListing.property_details.financial === "object"
                    ? existingListing.property_details.financial.TaxInformation
                    : {}),
                  price: {
                    currency: "USD",
                    price: newPrice.price,
                  },
                } as Record<string, unknown>,
              },
            };
           

            await axios
              .put(
                `${config.listingServiceUrl}/listings/${existingListing.listing_id}`,

                payload,
                {
                  headers: {
                    Authorization: authHeader, // Pass your authorization header
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((response) => {
                console.log("listing updated", response.data);
                return response.data;
              })
              .catch((error: any) => {
                console.log("error updating listing", error.response.data);

                console.error(
                  translate("ERROR_CREATING_DATA_ROOM"),
                  error.response.data
                );
              });
          }
        }
        return { message: translate("LISTING_ALREADY_EXISTS") };
      }

      // Create and save the listing
      const listing = new Listing({
        listing_id: new mongoose.Types.ObjectId().toString(),
        name,
        address,
        property_description,
        property_highlights,
        days_on_market,
        type,
        built_on,
        renovated_on,
        listing_agent,
        dataroom_id,
        workflows,
        images,
        videos,
        maps,
        property_details,
        sales_and_tax,
        public_facts,
        schools,
        listing_source,
        status,
      });

      const user = extractUserIdFromToken(authHeader);
      console.log(user);

      const newDataRoom: DataRoom = {
        organization_id: new mongoose.Types.ObjectId(),
        ari: `${config.ari.prefix}:${config.ari.namespace}:${
          config.ari.service
        }:${config.ari.region}:${config.ari.accountId}:${
          config.ari.resource
        }/${createDataRoomName(listing.name)}`, // exapmle:`ari:agsiri:iam:us:123456789012:user/JohnDoe`
        data_residency: {
          country: "US",
          region: "us-east-1",
          data_center: "Data Center 1",
        },
        name: createDataRoomName(listing.name),
        description: `Data Room creating for the Lising ${listing.name}`,
        created_by: user!.userId,
        key_info: {},
        permissions: [],
        owner: user!.userId,
      };

      // Create a data room
      const dataRoom = await axios
        .post(`${config.dataRoomServiceUrl}/datarooms`, newDataRoom)
        .then((response) => {
          console.log("DATA_ROOM_CREATED");
          return response.data;
        })
        .catch((error) => {
          console.error(
            translate("ERROR_CREATING_DATA_ROOM"),
            error.response.data
          );
        });
      listing.dataroom_id = dataRoom.dataRoom._id;

      //create  cabinet into the data room:
      const newCabinet = {
        dataroom: listing.dataroom_id,
        ari: `${config.ari.prefix}:${config.ari.namespace}:${
          config.ari.service
        }:${config.ari.region}:${config.ari.accountId}:${
          config.ari.resource
        }/${createDataRoomName(listing.name)}`, // exapmle:`ari:agsiri:iam:us:123456789012:user/JohnDoe`
        name: createDataRoomName(listing.name),
        description:
          config.cabinet.description ||
          `Cabinet creating for the Lising ${listing.name}`,
        created_by: user!.userId,
        key_info: config.cabinet.key_info || {},
        permissions: config.cabinet.permissions || [],
        owner: user!.userId,
        type: config.cabinet.type || "REGULAR",
        created_at: new Date(),
        media: config.cabinet.media || [],
        documents: config.cabinet.documents || [],
        contracts: config.cabinet.contracts || [],
      };

      const cabinet = await axios
        .post(`${config.dataRoomServiceUrl}/cabinets`, newCabinet)
        .then((response) => {
          console.log("CABINET_CREATED");
          return response.data;
        })
        .catch((error) => {
          console.error(
            translate("ERROR_CREATING_CABINET"),
            error.response.data
          );
        });

      const savedListing = await listing.save();
      return savedListing;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Modifies an existing listing.
   * @param listingId - The ID of the listing to modify.
   * @param updates - An object containing the fields to update in the listing.
   * @returns A promise that resolves to the updated listing document.
   */
  async modifyListing(listingId: string, updates: ListingUpdate): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(listingId)) {
        throw new Error(translate("INVALID_LISTING_ID"));
      }

      // Validate update data
      this.validateUpdateData(updates);
      // Fetch the current listing
      const currentListing = await Listing.findOne({ listing_id: listingId });
      if (!currentListing) {
        throw new Error(translate("LISTING_NOT_FOUND"));
      }
      // Prepare the updated data
      const updatedListingData = { ...currentListing.toObject() };

      // Apply updates
      if (updates.name) {
        updatedListingData.name = updates.name;
      }

      if (updates.type) {
        updatedListingData.type = updates.type;
      }
      if (updates.status) {
        updatedListingData.status = updates.status;
      }

      if (updates.property_description) {
        updatedListingData.property_description = updates.property_description;
      }
      if (updates.days_on_market) {
        updatedListingData.days_on_market = updates.days_on_market;
      }
      if (updates.schools) {
        updatedListingData.schools = updates.schools;
      }

      if (updates.built_on) {
        updatedListingData.built_on = updates.built_on;
      }

      if (updates.renovated_on) {
        updatedListingData.renovated_on = updates.renovated_on;
      }

      if (updates.workflows) {
        updatedListingData.workflows = updates.workflows;
      }

      if (updates.address) {
        // Merge address updates
        updatedListingData.address = {
          ...updatedListingData.address, // Preserve existing address fields
          ...updates.address, // Apply updates
        };
      }
      if (updates.public_facts) {
        updatedListingData.public_facts = updates.public_facts;
      }
      if (updates.property_highlights) {
        const {
          barns,
          deed_restrictions,
          tillable,
          woodland,
          wetland,
          total_acres,
        } = updates.property_highlights;

        updatedListingData.property_highlights = {
          ...updatedListingData.property_highlights,
          barns: barns ?? updatedListingData.property_highlights.barns,
          deed_restrictions:
            typeof deed_restrictions === "string"
              ? deed_restrictions
              : updatedListingData.property_highlights.deed_restrictions,
          tillable:
            typeof tillable === "number"
              ? tillable
              : updatedListingData.property_highlights.tillable,
          woodland:
            typeof woodland === "number"
              ? woodland
              : updatedListingData.property_highlights.woodland,
          wetland:
            typeof wetland === "number"
              ? wetland
              : updatedListingData.property_highlights.wetland,
          total_acres:
            typeof total_acres === "number"
              ? total_acres
              : updatedListingData.property_highlights.total_acres,
        };
      }

      if (updates.sales_and_tax) {
        const { sales_history, tax_history } = updates.sales_and_tax;
        updatedListingData.sales_and_tax = {
          ...updatedListingData.sales_and_tax,
          sales_history:
            typeof sales_history === "object"
              ? sales_history
              : updatedListingData.sales_and_tax?.sales_history,
          tax_history:
            typeof tax_history === "object"
              ? tax_history
              : updatedListingData.sales_and_tax?.tax_history,
        };
      }

      if (updates.property_details) {
        const {
          parking,
          interior,
          exterior,
          financial,
          utilities,
          location,
          other,
        } = updates.property_details;
        updatedListingData.property_details = {
          ...updatedListingData.property_details,
          parking:
            typeof parking === "object"
              ? parking
              : updatedListingData.property_details?.parking,
          interior:
            typeof interior === "object"
              ? interior
              : updatedListingData.property_details?.interior,
          exterior:
            typeof exterior === "object"
              ? exterior
              : updatedListingData.property_details?.exterior,
          financial:
            typeof financial === "object"
              ? (financial as Record<string, unknown>)
              : updatedListingData.property_details?.financial,
          utilities:
            typeof utilities === "object"
              ? utilities
              : updatedListingData.property_details?.utilities,
          location:
            typeof location === "object"
              ? location
              : updatedListingData.property_details?.location,
          other:
            typeof other === "object"
              ? (other as any)
              : updatedListingData.property_details?.other,
        };
      }

      if (updates.listing_agent) {
        const { name, email, phone_number, company } = updates.listing_agent;
        updatedListingData.listing_agent = {
          ...updatedListingData.listing_agent,
          name:
            typeof name === "string"
              ? name
              : updatedListingData.listing_agent?.name,
          email:
            typeof email === "string"
              ? email
              : updatedListingData.listing_agent?.email,
          phone_number:
            typeof phone_number === "string"
              ? phone_number
              : updatedListingData.listing_agent?.phone_number,
          company:
            typeof company === "string"
              ? company
              : updatedListingData.listing_agent?.company,
        };
      }

      updatedListingData.property_details = {
        ...updatedListingData.property_details,
        financial:
          typeof updates.property_details?.financial == "object"
            ? (updates.property_details?.financial as Record<string, unknown>)
            : updatedListingData.property_details?.financial,
      };
    

      // Perform the update
      const updatedListing = await Listing.findOneAndUpdate(
        { listing_id: listingId },
        updatedListingData,
        { new: true, runValidators: false } // runValidators: false to bypass schema validation errors
      );

      if (!updatedListing) {
        throw new Error(translate("LISTING_NOT_FOUND"));
      }

      return updatedListing;
    } catch (error: any) {
      throw new Error(error.message);
    }
    // Validate listingId
  }

  //   private isValidObjectId(id: string): boolean {
  //     // Implement your logic to validate ObjectId
  //     return /^[a-fA-F0-9]{24}$/.test(id);
  //   }

  private validateUpdateData(updateData: ListingUpdate): void {
    if (updateData.name && typeof updateData.name !== "string") {
      throw new Error(translate("INVALID_NAME"));
    }

    if (updateData.address) {
      const { house_number, street, city, state, zip } = updateData.address;
      if (
        (house_number && typeof house_number !== "string") ||
        (street && typeof street !== "string") ||
        (city && typeof city !== "string") ||
        (state && typeof state !== "string") ||
        (zip && typeof zip !== "string")
      ) {
        throw new Error(translate("INVALID_ADDRESS"));
      }
    }

    if (
      updateData.property_description &&
      typeof updateData.property_description !== "string"
    ) {
      throw new Error(translate("INVALID_PROPERTY_DESCRIPTION"));
    }

    if (updateData.property_highlights) {
      const {
        total_acres,
        tillable,
        woodland,
        wetland,
        deed_restrictions,
        barns,
      } = updateData.property_highlights;
      if (
        (total_acres && typeof total_acres !== "number") ||
        (tillable && typeof tillable !== "number") ||
        (woodland && typeof woodland !== "number") ||
        (wetland && typeof wetland !== "number") ||
        (deed_restrictions && typeof deed_restrictions !== "string") ||
        (barns && !Array.isArray(barns))
      ) {
        throw new Error(translate("INVALID_PROPERTY_HIGHLIGHTS"));
      }
    }

    if (updateData.type && !["Farm", "Residential"].includes(updateData.type)) {
      throw new Error(translate("INVALID_TYPE"));
    }

    if (updateData.listing_agent) {
      const { name, company, phone_number, email } = updateData.listing_agent;
      if (
        (name && typeof name !== "string") ||
        (company && typeof company !== "string") ||
        (phone_number && typeof phone_number !== "string") ||
        (email && typeof email !== "string") ||
        (email && !/^.+\@.+\..+$/.test(email))
      ) {
        throw new Error(translate("INVALID_LISTING_AGENT"));
      }
    }

    if (updateData.built_on && typeof updateData.built_on !== "string") {
      throw new Error(translate("INVALID_BUILT_ON"));
    }

    if (
      updateData.renovated_on &&
      typeof updateData.renovated_on !== "string"
    ) {
      throw new Error(translate("INVALID_RENOVATED_ON"));
    }

    if (
      updateData.days_on_market &&
      typeof updateData.days_on_market !== "number"
    ) {
      // throw new Error("INVALID_DAYS_ON_MARKET");
      throw new Error(translate("INVALID_DAYS_ON_MARKET"));
    }

    if (
      updateData.status &&
      ![
        "ACTIVE",
        "SOURCED",
        "SCREENED",
        "IN REVIEW",
        "REVIEWED",
        "IN DUE DILIGENCE",
        "SELECTED",
        "REJECTED",
        "ARCHIVED",
      ].includes(updateData.status)
    ) {
      throw new Error(translate("INVALID_STATUS"));
    }
  }

  /**
   * Retrieves all listings from the listing service.
   * @returns A promise that resolves to an array of all listing documents.
  //  */
  async getAllListings({ sortBy, page, pageSize, search }: { sortBy: string; page: number; pageSize: number; search: string }) {
    // Ensure valid page and pageSize
    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 10;

    const skip = (page - 1) * pageSize;
    let sortOption: any;

    // Determine the sorting option based on the query parameter
    switch (sortBy) {
      case "newest":
        sortOption = { built_on: -1 }; // Sort by newest based on 'built_on' (descending)
        break;
      case "oldest":
        sortOption = { built_on: 1 }; // Sort by oldest based on 'built_on' (ascending)
        break;
      case "priceHighToLow":
        sortOption = { "property_details.financial.price.price": -1 }; // Sort by price high to low (descending)
        break;
      case "priceLowToHigh":
        sortOption = { "property_details.financial.price.price": 1 }; // Sort by price low to high (ascending)
        break;
      default:
        sortOption = { built_on: -1 }; // Default sorting by newest (built_on)
    }
  
    // Build the filter query with optional search on the 'name' field
    const filterQuery: Record<string, any> = {}; // Explicitly define the type
    if (search) {
      filterQuery["$or"] = [
        { name: { $regex: `.*${search}.*`, $options: "i" } },
        { "address.city": { $regex: `.*${search}.*`, $options: "i" } },
        { "address.street": { $regex: `.*${search}.*`, $options: "i" } },
        { "address.state": { $regex: `.*${search}.*`, $options: "i" } },
        { "address.zip": { $regex: `.*${search}.*`, $options: "i" } },
        { "address.house_number": { $regex: `.*${search}.*`, $options: "i" } },
        { property_description: { $regex: `.*${search}.*`, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$address.house_number", " ", "$name"] },
              regex: `.*${search}.*`,
              options: "i",
            },
          },
        },
      ];
    }
    // Fetch the total count of listings matching the filter
    const totalItems = await Listing.countDocuments(filterQuery);
  
    // Fetch the current page of listings with pagination, sorting, and filtering
    const listings = await Listing.find(filterQuery)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      data: listings,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }

  /**
   * Retrieves a specific listing based on the provided ID.
   * @param listingId - The ID of the listing to retrieve.
   * @returns A promise that resolves to the requested listing document.
   */
  public async getListingById(listingId: string): Promise<object> {
    try {
      if (!mongoose.isValidObjectId(listingId)) {
        throw new Error(translate("INVALID_LISTING_ID"));
      }
      const listing = await Listing.findOne({ listing_id: listingId }).exec();
      if (!listing) {
        throw new Error(translate("LISTING_NOT_FOUND"));
      }

      return listing;
    } catch (error: any) {
      // console.error("Error fetching listing:", error);
      throw new Error(error.message);
    }
  }

  /**
   * Deletes a listing from the listing service.
   * @param listingId - The ID of the listing to delete.
   * @returns A promise that resolves to a success message or the deleted listing document.
   */
  public async deleteListing(
    listingId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Validate listingId
      if (!mongoose.isValidObjectId(listingId)) {
        return { success: false, message: translate("INVALID_LISTING_ID") };
      }

      const deletedListing = await Listing.findOneAndDelete({
        listing_id: listingId,
      });

      if (!deletedListing) {
        return { success: false, message: translate("LISTING_NOT_FOUND") };
      }

      const { dataroom_id } = deletedListing;
      const dataRoomDeleted = await axios
        .delete(`${config.dataRoomServiceUrl}/datarooms/${dataroom_id}`)
        .then((response) => {
          console.log("DATA_ROOM_DELETED");
          return response.data;
        })
        .catch((error) => {
          console.error(translate("ERROR_DELETING_DATA_ROOM"));
        });

      return { success: true, message: translate("LISTING_DELETED") };
    } catch (error) {
      throw new Error(translate("ERROR_DELETING_LISTING"));
    }
  }

  /**
   * Searches for listings based on various criteria.
   * @param criteria - An object containing search criteria such as location, property type, and size.
   * @returns A promise that resolves to an array of listings that match the search criteria.
   */
  public async searchListings(options: SearchOptions): Promise<{
    listings: any[];
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
    const query = Listing.find(filterObject)
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const listings = await query.exec();
    const total = await Listing.countDocuments(filterObject);

    return {
      listings,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    };
  }

  public async queryListings(options: queryOptions): Promise<{
    listings: any[];
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
    const listings = await Listing.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination metadata
    const total = await Listing.countDocuments(filter);

    // Send response with listings and pagination metadata
    return {
      listings,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    };
  }

  /**
   * Uploads media (images, videos, maps) to an existing listing.
   * @param listingId - The ID of the listing to upload media to.
   * @param mediaType - The type of media (image, video, or map).
   * @param file - The media file to upload.
   * @returns A promise that resolves to the updated listing document with the newly added media.
   */
  // uploadMedia(listingId: string, mediaType: 'image' | 'video' | 'map', file: Buffer): Promise<Listing> {
  //   // Implementation here
  // }

  /**
   * Uploads media (images, videos, maps) to an existing listing.
   * @param listingId - The ID of the listing to upload media to.
   * @param mediaType - The type of media (image, video, or map).
   * @param file - The media file to upload.
   * @param fileName - The name of the file.
   * @returns A promise that resolves to the updated listing document with the newly added media.
   */
  public async uploadMedia(
    listingId: string,
    mediaType: "image" | "video" | "map" | "document",
    files: any,
    authHeader: string,
    maps: MapData | MapData[] | undefined
  ): Promise<any> {
    try {
      // const organizationId = new mongoose.Types.ObjectId(); // question: this should be the USER id
      const user = extractUserIdFromToken(authHeader);
      const userId = user!.userId;

      const listing = await Listing.findOne({ listing_id: listingId }).exec();
      if (!listing) throw new Error("Listing not found");

      if (mediaType === "image") {
        if (files && files.image) {
          if (Array.isArray(files.image)) {
            for (const file of files.image) {
              const fileBlob = new Blob([file.data], { type: file.mimetype });
              const response = await uploadFileToDataRoom(
                fileBlob,
                file.name,
                userId.toString(),
                listing
              );
              listing?.images?.push(response._id);
              console.log("response =>", response);
            }
          } else {
            const file = files.image;
            const fileBlob = new Blob([file.data], { type: file.mimetype });
            console.log("file.name from else =>", file.name);
            const response = await uploadFileToDataRoom(
              fileBlob,
              file.name,
              userId.toString(),
              listing
            );
            console.log("response =>", response);

            listing?.images?.push(response._id);
          }
        } else {
          throw new Error("No image file provided");
        }
      }
      if (mediaType === "video") {
        if (files && files.video) {
          if (Array.isArray(files.video)) {
            for (const file of files.video) {
              const fileBlob = new Blob([file.data], { type: file.mimetype });
              const response = await uploadFileToDataRoom(
                fileBlob,
                file.name,
                userId.toString(),
                listing
              );
              listing?.videos?.push(response._id);
              console.log("response =>", response);
            }
          } else {
            const file = files.video;
            const fileBlob = new Blob([file.data], { type: file.mimetype });
            console.log("file.name from else =>", file.name);
            const response = await uploadFileToDataRoom(
              fileBlob,
              file.name,
              userId.toString(),
              listing
            );
            listing?.videos?.push(response._id);
          }
        } else {
          throw new Error("No video file provided");
        }
      }
      if (mediaType === "document") {
        if (files && files.document) {
          if (Array.isArray(files.document)) {
            for (const file of files.document) {
              const fileBlob = new Blob([file.data], { type: file.mimetype });
              const response = await uploadFileToDataRoom(
                fileBlob,
                file.name,
                userId.toString(),
                listing
              );
              listing?.documents?.push(response.versions[0].url);
              console.log("response =>", response);
            }
          } else {
            const file = files.document;
            const fileBlob = new Blob([file.data], { type: file.mimetype });
            console.log("file.name from else =>", file.name);
            const response = await uploadFileToDataRoom(
              fileBlob,
              file.name,
              userId.toString(),
              listing
            );
            listing?.documents?.push(response.versions[0].url);
          }
        } else {
          throw new Error("No document file provided");
        }
      }
      if (mediaType === "map") {
        if (maps) {
          const mapArray = Array.isArray(maps) ? maps : [maps];
          for (const map of mapArray) {
            if (validateMap(map)) {
              listing.maps = listing.maps || [];
              listing.maps.push(map);
            } else {
              throw new Error("Invalid map data");
            }
          }
        } else {
          throw new Error("No map data provided");
        }
      }

      const updatedListing = await listing.save();
      return updatedListing;
    } catch (error: any) {
      throw new Error(`Error uploading media: ${error.message}`);
    }
  }
  /**
   * Adds a workflow step or process to an existing listing.
   * @param listingId - The ID of the listing to add the workflow to.
   * @param workflow - An object containing the workflow name and steps.
   * @returns A promise that resolves to the updated listing document with the new workflow.
   */
  // addWorkflow(listingId: string, workflow: Workflow): Promise<Listing> {
  //   // Implementation here
  // }

  /**
   * Retrieves a specific listing based on the provided ID.
   * @param listingId - The ID of the listing to retrieve.
   * @returns A promise that resolves to the requested listing document.
   */
  public async getImage(
    listingId: string,
    authHeader: string,
    page: number = 1, // Default to first page
    limit: number = 10
  ): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(listingId)) {
        throw new Error(translate("INVALID_LISTING_ID"));
      }
      const listing = await Listing.findOne({ listing_id: listingId }).exec();
      if (!listing) {
        throw new Error(translate("LISTING_NOT_FOUND"));
      }

      // Define the data structure with explicit types
      let data: {
        images: object[];
        videos: object[];
        maps: object[];
        imagesMeta: {
          // Added meta property for Image pagination only
          currentPage: number;
          totalPages: number;
          totalItems: number;
        };
      } = {
        images: [],
        videos: [],
        maps: [],
        imagesMeta: {
          currentPage: 0,
          totalPages: 0,
          totalItems: 0,
        },
      };
      let imagesLength = listing.images?.length;
      if (imagesLength === undefined) {
        throw new Error(translate("LISTING_HAS_NO_IMAGES"));
      }

      // Calculate the total number of pages
      data.imagesMeta.totalPages = Math.ceil(imagesLength / limit);
      data.imagesMeta.totalItems = imagesLength;
      data.imagesMeta.currentPage = page;

      // Fetch images for the current page
      const startIndex = (page - 1) * limit;
      const endIndex = Math.min(startIndex + limit, imagesLength);

      for (let i = startIndex; i < endIndex; i++) {
        const fileData = await axios
          .get(`${config.dataRoomServiceUrl}/files/${listing.images?.[i]}`, {
            headers: {
              Authorization: authHeader,
            },
          })
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.log(translate("ERROR_FETCH_FILE"), error.response);
          });
        if (!fileData) {
          throw new Error(translate("NO_FILE_DATA"));
        }
        data.images.push({ name: fileData.name, url: fileData.content_url });
      }

      let videosLength = listing.videos?.length;
      if (videosLength === undefined) {
        throw new Error(translate("LISTING_HAS_NO_VIDEOS"));
      }
      for (let i = 0; i < videosLength; i++) {
        const fileData = await axios
          .get(`${config.dataRoomServiceUrl}/files/${listing.videos?.[i]}`, {
            headers: {
              Authorization: authHeader,
            },
          })
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.log(translate("ERROR_FETCH_FILE"), error.response);
          });
        if (!fileData) {
          throw new Error(translate("NO_FILE_DATA"));
        }
        data.videos.push({ name: fileData.name, url: fileData.content_url });
      }

      let mapsLength = listing.maps?.length;
      if (mapsLength === undefined) {
        throw new Error(translate("LISTING_HAS_NO_MAPS"));
      }
      for (let i = 0; i < mapsLength; i++) {
        const fileData = await axios
          .get(`${config.dataRoomServiceUrl}/files/${listing.maps?.[i]}`, {
            headers: {
              Authorization: authHeader,
            },
          })
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.log(translate("ERROR_FETCH_FILE"), error.response);
          });
        if (!fileData) {
          throw new Error(translate("NO_FILE_DATA"));
        }
        data.maps.push({ name: fileData.name, url: fileData.content_url });
      }

      return data;
    } catch (error: any) {
      // console.error("Error fetching listing:", error);
      throw new Error(error.message);
    }
  }
}

// Interfaces and types used in the service

interface Listing {
  _id?: string;
  listing_id: string;
  name: string;
  address: Address;
  property_description: string;
  property_highlights: PropertyHighlights;
  listing_agent: ListingAgent;
  dataroom_id: string;
  workflows: Record<string, unknown>;
  images: string[];
  videos: string[];
  maps: object[];
  property_details: PropertyDetails;
  sales_and_tax: SalesAndTax;
  public_facts: Record<string, any>;
  schools: Record<string, any>;
  days_on_market?: number;
  type: string;
  built_on?: Date;
  renovated_on?: Date[];
  listing_source: string;
  status: string;
}

interface Address {
  house_number: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
}

interface PropertyHighlights {
  total_acres: number;
  tillable: number;
  woodland: number;
  wetland: number;
  deed_restrictions: boolean;
  barns: Barn[];
}

interface Barn {
  size: string;
  description: string;
}

interface ListingAgent {
  name: string;
  company: string;
  phone_number: string;
  email: string;
}

interface PropertyDetails {
  parking: Parking;
  interior: Interior;
  exterior: Exterior;
  financial: Record<string, any>;
  utilities: Utilities;
  location: Location;
  other: OtherPropertyDetails;
}

interface Parking {
  number_of_spaces: number;
  type: string;
}

interface Interior {
  bathrooms: Bathrooms;
  rooms: Room[];
  basement: Record<string, any>;
  laundry: Record<string, any>;
  fireplace: Record<string, any>;
  interior_features: Record<string, any>;
}

interface Bathrooms {
  number_full: number;
  number_total: number;
  bathroom1_level: string;
  bathroom2_level: string;
}

interface Room {
  type: string;
  level: string;
}

interface Exterior {
  features: Record<string, any>;
  property_information: Record<string, any>;
  lot_information: Record<string, any>;
}

interface Financial {
  // financial fields
}

interface Utilities {
  heating_and_cooling: Record<string, any>;
  utility: Record<string, any>;
}

interface Location {
  school_information: Record<string, any>;
  location_information: Record<string, any>;
}

interface OtherPropertyDetails {
  listing_information: Record<string, any>;
}

interface SalesAndTax {
  sales_history: Record<string, any>;
  tax_history: Record<string, any>;
}

interface Workflow {
  workflow_name: string;
  workflow_steps: any[]; // Define according to your workflow structure
}

interface ListingSearchCriteria {
  city?: string;
  state?: string;
  zip?: string;
  total_acres_min?: number;
  total_acres_max?: number;
  property_type?: string;
}

interface SearchOptions {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  filters: Record<string, string | undefined>;
}

interface queryOptions {
  page: number;
  limit: number;
  queryParams: any;
}

interface ListingUpdate {
  name?: string;
  address?: Address;
  property_description?: string;
  property_highlights?: PropertyHighlights;
  type?: "Farm" | "Residential";
  listing_agent?: ListingAgent;
  status?:
    | "SOURCED"
    | "SCREENED"
    | "IN REVIEW"
    | "REVIEWED"
    | "IN DUE DILIGENCE"
    | "SELECTED"
    | "REJECTED"
    | "ARCHIVED";
  public_facts?: Record<string, any>;
  schools?: Record<string, any>;
  days_on_market?: number;
  built_on?: Date;
  renovated_on?: Date[];
  sales_and_tax?: SalesAndTax;
  property_details?: PropertyDetails;
  workflows?: Record<string, unknown>;
}

interface DataRoom {
  organization_id: mongoose.Types.ObjectId;
  ari: string;
  data_residency: {
    country: string;
    region: string;
    data_center: string;
  };
  name: string;
  description: string;
  created_by: string;
  key_info: Record<string, any>;
  permissions: string[];
  owner: string;
}
