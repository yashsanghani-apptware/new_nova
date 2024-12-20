import Listing from "../models/Listing";
import { Request, Response } from "express";
import { SortOrder } from 'mongoose';

const mongoose = require('mongoose');


const isValidObjectId = (id: any): boolean => {
  return mongoose.isValidObjectId(id);
};
/**
 * Create a new listing.
 *
 * @function createListing
 * @param {Object} req - Express request object
 * @param {Object} req.body - The request body containing the listing details
 * @param {string} req.body.listing_id - Unique identifier for the listing
 * @param {string} req.body.name - Name of the property listing
 * @param {Object} req.body.address - Address of the property
 * @param {string} req.body.address.house_number - House number of the property
 * @param {string} req.body.address.street - Street name of the property
 * @param {string} req.body.address.apartment - Apartment number, if applicable
 * @param {string} req.body.address.city - City where the property is located
 * @param {string} req.body.address.state - State where the property is located
 * @param {string} req.body.address.zip - ZIP code of the property's location
 * @param {string} req.body.property_description - Detailed description of the property
 * @param {Object} req.body.property_highlights - Key highlights of the property
 * @param {number} req.body.property_highlights.total_acres - Total acres of the property
 * @param {number} req.body.property_highlights.tillable - Tillable acres on the property
 * @param {number} req.body.property_highlights.woodland - Woodland acres on the property
 * @param {number} req.body.property_highlights.wetland - Wetland acres on the property
 * @param {string} req.body.property_highlights.deed_restrictions - Deed restrictions on the property
 * @param {Array} req.body.property_highlights.barns - List of barns on the property
 * @param {Object} req.body.listing_agent - Details of the listing agent
 * @param {string} req.body.listing_agent.name - Name of the listing agent
 * @param {string} req.body.listing_agent.company - Company of the listing agent
 * @param {string} req.body.listing_agent.phone_number - Phone number of the listing agent
 * @param {string} req.body.listing_agent.email - Email address of the listing agent
 * @param {string} req.body.type - Type of the property (e.g., Farm, Residential)
 * @param {string} req.body.listing_source - Source of the listing ('SYSTEM' | 'REALTOR')
 * @param {string} req.body.status - Current status of the listing ('SOURCED', 'SCREENED', etc.)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves to the created listing object
 */
export async function createListing(req: Request, res: Response) {
  // Implementation goes heretry {
  try {
    const {
      // listing_id,
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
    } = req.body;

    // Validate listing_id
    // if (typeof listing_id !== "string" || listing_id.trim() === "") {
    //   return res.status(400).json({ message: "INVALID_LISTING_ID" });
    // }

    // Validate name
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "INVALID_NAME" });
    }

    // Validate address
    if (
      !address ||
      typeof address !== "object" ||
      !address.house_number ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip
    ) {
      return res.status(400).json({ message: "INVALID_ADDRESS" });
    }

    // Validate property_description
    if (
      typeof property_description !== "string" ||
      property_description.trim() === ""
    ) {
      return res.status(400).json({ message: "INVALID_PROPERTY_DESCRIPTION" });
    }

    // Validate property_highlights
    if (
      !property_highlights ||
      typeof property_highlights !== "object" ||
      typeof property_highlights.total_acres !== "number" ||
      typeof property_highlights.tillable !== "number" ||
      typeof property_highlights.woodland !== "number" ||
      typeof property_highlights.wetland !== "number" ||
      typeof property_highlights.deed_restrictions !== "string" ||
      !Array.isArray(property_highlights.barns)
    ) {
      return res.status(400).json({ message: "INVALID_PROPERTY_HIGHLIGHTS" });
    }

    // Validate type
    if (!["Farm", "Residential"].includes(type)) {
      return res.status(400).json({ message: "INVALID_TYPE" });
    }

    // Validate listing_agent
    if (
      !listing_agent ||
      typeof listing_agent !== "object" ||
      typeof listing_agent.name !== "string" ||
      typeof listing_agent.company !== "string" ||
      typeof listing_agent.phone_number !== "string" ||
      typeof listing_agent.email !== "string" ||
      !/^.+\@.+\..+$/.test(listing_agent.email)
    ) {
      return res.status(400).json({ message: "INVALID_LISTING_AGENT" });
    }

    // Validate listing_source
    if (!["SYSTEM", "REALTOR"].includes(listing_source)) {
      return res.status(400).json({ message: "INVALID_LISTING_SOURCE" });
    }

    // Validate status
    if (
      ![
        "SOURCED",
        "SCREENED",
        "IN REVIEW",
        "REVIEWED",
        "IN DUE DILIGENCE",
        "SELECTED",
        "REJECTED",
        "ARCHIVED",
      ].includes(status)
    ) {
      return res.status(400).json({ message: "INVALID_STATUS" });
    }

    // Validate and format the property_details if present
    if (property_details) {
      if (
        !property_details.parking ||
        !property_details.parking.number_of_spaces ||
        !property_details.parking.type
      ) {
        return res.status(400).json({ message: "INVALID_PARKING_DETAILS" });
      }

      if (
        !property_details.interior ||
        !property_details.interior.bathrooms ||
        !Array.isArray(property_details.interior.rooms)
      ) {
        return res.status(400).json({ message: "INVALID_INTERIOR_DETAILS" });
      }

      // Add additional validation checks for other fields in property_details if needed
    }

    // Create a new Listing document
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

    // Save the listing to the database
    const savedListing = await listing.save();

    // Respond with the created listing
    return res.status(201).json(savedListing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return res
      .status(500)
      .json({ message: "INTERNAL_SERVER_ERROR", error: error });
  }
}

/**
 * Retrieve a specific listing by its ID.
 *
 * @function getListing
 * @param {Object} req - Express request object
 * @param {string} req.params.listing_id - The ID of the listing to retrieve
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves to the retrieved listing object
 */
export  async function getListing(req: Request, res: Response) {
  try {
    const { listing_id } = req.params;
    // Validate listing_id
    if (!isValidObjectId(listing_id)) {
      return res
        .status(400)
        .json({ message: 'INVALID_LISTING_ID' });
    }
      
    const listing = await Listing.findOne({ listing_id: listing_id });
      if (!listing) {
        return res
          .status(404)
          .json({ message: 'LISTING_NOT_FOUND' });
      }
       res.status(200).json(listing);
    } catch (error) {
      console.log(error);
      
      res.status(404).json({ message:'ERROR_FETCHING_LISTING'});
    }
}

/**
 * Update an existing listing by its ID.
 *
 * @function updateListing
 * @param {Object} req - Express request object
 * @param {string} req.params.listing_id - The ID of the listing to update
 * @param {Object} req.body - The request body containing the updated listing details
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves to the updated listing object
 */
export async function updateListing(req: Request, res: Response) {
  try {
      const { listing_id } = req.params; // Get the listing ID from the request URL parameters
      const updateData = req.body; // Get the data to update from the request body

      // Validate listing_id
      if (!mongoose.Types.ObjectId.isValid(listing_id)) {
          return res.status(400).json({ message: 'INVALID_LISTING_ID' });
      }

      // Validate fields if necessary before updating
      if (updateData.name && typeof updateData.name !== 'string') {
          return res.status(400).json({ message: 'INVALID_NAME' });
      }

      if (updateData.address) {
          const { house_number, street, city, state, zip } = updateData.address;
          if (!house_number || !street || !city || !state || !zip) {
              return res.status(400).json({ message: 'INVALID_ADDRESS' });
          }
      }

      if (updateData.property_description && typeof updateData.property_description !== 'string') {
          return res.status(400).json({ message: 'INVALID_PROPERTY_DESCRIPTION' });
      }

      if (updateData.property_highlights) {
          const {
              total_acres, tillable, woodland, wetland, deed_restrictions, barns
          } = updateData.property_highlights;
          if (typeof total_acres !== 'number' ||
              typeof tillable !== 'number' ||
              typeof woodland !== 'number' ||
              typeof wetland !== 'number' ||
              typeof deed_restrictions !== 'string' ||
              !Array.isArray(barns)) {
              return res.status(400).json({ message: 'INVALID_PROPERTY_HIGHLIGHTS' });
          }
      }
      
      // Validate type if present
    if (updateData.type && !['Farm', 'Residential'].includes(updateData.type)) {
      return res.status(400).json({ message: 'INVALID_TYPE' });
    }

      if (updateData.listing_agent) {
          const { name, company, phone_number, email } = updateData.listing_agent;
          if (!name || !company || !phone_number || !email || !/^.+\@.+\..+$/.test(email)) {
              return res.status(400).json({ message: 'INVALID_LISTING_AGENT' });
          }
      }

      if (updateData.status && ![
          'SOURCED', 'SCREENED', 'IN REVIEW', 'REVIEWED', 'IN DUE DILIGENCE', 'SELECTED', 'REJECTED', 'ARCHIVED'
      ].includes(updateData.status)) {
          return res.status(400).json({ message: 'INVALID_STATUS' });
      }

      // Find the listing by its ID and update it with the new data
      const updatedListing = await Listing.findOneAndUpdate(
          { listing_id },  // Search for the listing by its ID
          { $set: updateData },  // Update the fields with new values
          { new: true, runValidators: true }  // Return the updated document
      );

      // If listing is not found, return a 404 error
      if (!updatedListing) {
          return res.status(404).json({ message: 'LISTING_NOT_FOUND' });
      }

      // Respond with the updated listing
      return res.status(200).json(updatedListing);
  } catch (error) {
      console.error('Error updating listing:', error);
      return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR', error });
  }
}


/**
 * Delete a specific listing by its ID.
 *
 * @function deleteListing
 * @param {Object} req - Express request object
 * @param {string} req.params.listing_id - The ID of the listing to delete
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves when the listing is deleted
 */
export async function deleteListing(req: Request, res: Response) {
  // Implementation goes here
  try {
    const { listing_id } = req.params;
    // Validate listing_id
    if (!isValidObjectId(listing_id)) {
      return res
        .status(400)
        .json({ message: 'INVALID_LISTING_ID' });
    }
    const deletedListing = await Listing.findOneAndDelete({ listing_id });
    if (!deletedListing) {
      return res
        .status(404)
        .json({ message: 'LISTING_NOT_FOUND' });
    }
    res.status(200).json({ message: 'LISTING_DELETED'});
  } catch (error:any) {
    res
      .status(500)
      .json({
        message: 'ERROR_DELETING_LISTING',
        error: error.message,
      });
  }
}

// /**
//  * Trigger the screening workflow for a sourced listing.
//  *
//  * @function triggerScreeningWorkflow
//  * @param {Object} req - Express request object
//  * @param {string} req.params.listing_id - The ID of the listing to trigger the screening workflow
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves when the screening workflow is triggered
//  */
// async function triggerScreeningWorkflow(req, res) {
//     // Implementation goes here
// }

// /**
//  * Trigger the review workflow for a screened listing.
//  *
//  * @function triggerReviewWorkflow
//  * @param {Object} req - Express request object
//  * @param {string} req.params.listing_id - The ID of the listing to trigger the review workflow
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves when the review workflow is triggered
//  */
// async function triggerReviewWorkflow(req, res) {
//     // Implementation goes here
// }

// /**
//  * Trigger the due diligence workflow for a reviewed listing.
//  *
//  * @function triggerDueDiligenceWorkflow
//  * @param {Object} req - Express request object
//  * @param {string} req.params.listing_id - The ID of the listing to trigger the due diligence workflow
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves when the due diligence workflow is triggered
//  */
// async function triggerDueDiligenceWorkflow(req, res) {
//     // Implementation goes here
// }

// /**
//  * Add media (images, videos, maps) to a specific listing.
//  *
//  * @function addMedia
//  * @param {Object} req - Express request object
//  * @param {string} req.params.listing_id - The ID of the listing to add media to
//  * @param {Array<string>} req.body.images - Array of image URLs to add
//  * @param {Array<string>} req.body.videos - Array of video URLs to add
//  * @param {Array<string>} req.body.maps - Array of map URLs to add
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves to the updated listing with the added media
//  */
// async function addMedia(req, res) {
//     // Implementation goes here
// }

// /**
//  * Add a note to a specific listing during review or due diligence.
//  *
//  * @function addNote
//  * @param {Object} req - Express request object
//  * @param {string} req.params.listing_id - The ID of the listing to add a note to
//  * @param {string} req.body.phase - The phase during which the note is added ('REVIEW' | 'DUE DILIGENCE')
//  * @param {string} req.body.author - The author of the note
//  * @param {string} req.body.content - The content of the note
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves to the updated listing with the added note
//  */
// async function addNote(req, res) {
//     // Implementation goes here
// }

// /**
//  * Add a document to a specific listing during review or due diligence.
//  *
//  * @function addDocument
//  * @param {Object} req - Express request object
//  * @param {string} req.params.listing_id - The ID of the listing to add a document to
//  * @param {string} req.body.phase - The phase during which the document is added ('REVIEW' | 'DUE DILIGENCE')
//  * @param {string} req.body.type - The type of document being added (e.g., 'Soil Report')
//  * @param {string} req.body.url - The URL of the document
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves to the updated listing with the added document
//  */
// async function addDocument(req, res) {
//     // Implementation goes here
// }

// /**
//  * Add a photo to a specific listing during review or due diligence.
//  *
//  * @function addPhoto
//  * @param {Object} req - Express request object
//  * @param {string} req.params.listing_id - The ID of the listing to add a photo to
//  * @param {string} req.body.url - The URL of the photo
//  * @param {string} req.body.description - The description of the photo
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves to the updated listing with the added photo
//  */
// async function addPhoto(req, res) {
//     // Implementation goes here
// }

// /**
//  * Add a video to a specific listing during review or due diligence.
//  *
//  * @function addVideo
//  * @param {Object} req - Express request object
//  * @param {string} req.params.listing_id - The ID of the listing to add a video to
//  * @param {string} req.body.url - The URL of the video
//  * @param {string} req.body.description - The description of the video
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves to the updated listing with the added video
//  */
// async function addVideo(req, res) {
//     // Implementation goes here
// }

// /**
//  * Retrieve all listings.
//  *
//  * @function getAllListings
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves to an array of all listings
//  */
export async function getAllListings(req: Request, res: Response) {
  // Implementation goes here
  try {
    const listing = await Listing.find();
    if (listing.length == 0)
      return res.status(200).json({ message: "LISTING_NOT_AVAILABLE" });
    res.status(200).json(listing);
  } catch (error) {
    res.status(404).json({ message: "ERROR_FETCHING_LISTING", error: error });
  }
}

// /**
//  * Find listings based on specific criteria.
//  *
//  * @function findListings
//  * @param {Object} req - Express request object
//  * @param {Object} req.query - Query parameters to filter the listings
//  * @param {string} [req.query.name] - Filter by the name of the listing
//  * @param {string} [req.query.status] - Filter by the status of the listing
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves to an array of listings matching the criteria
//  */
// async function findListings(req, res) {
//     // Implementation goes here
// }

/**
 * Query listings with advanced filtering and pagination.
 *
 * @function queryListings
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters for advanced filtering and pagination
 * @param {string} [req.query.name] - Filter by the name of the listing
 * @param {string} [req.query.status] - Filter by the status of the listing
 * @param {number} [req.query.page] - Page number for pagination
 * @param {number} [req.query.limit] - Number of results per page
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns a promise that resolves to a paginated list of listings matching the query
 */
export async function queryListings(req: Request, res: Response) {
  try {
    const { page = 1, limit = 10, ...queryParams } = req.query;

    // Calculate skip value based on the current page and limit
    const skip = (Number(page) - 1) * Number(limit);

    // Explicitly cast the sort order
    const sort: { [key: string]: SortOrder } = { createdAt: -1 as SortOrder };

    // Create a filter object based on the query parameters
    const filter: any = {};

    Object.entries(queryParams).forEach(([key, value]) => {
        if (typeof value === "object") {
          filter[key] = { [`${Object.keys(value)[0]}`] : Number(Object.values(value)[0]) || Object.values(value)[0] };
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
    res.status(200).json({
      listings,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(404).json({ message: "ERROR_FETCHING_LISTING", error });
  }
}

// /**
//  * Search listings using text search across multiple fields.
//  *
//  * @function searchListings
//  * @param {Object} req - Express request object
//  * @param {Object} req.query - Query parameters for the search
//  * @param {string} req.query.q - The search term to match against the listing name, description, and other text fields
//  * @param {Object} res - Express response object
//  * @returns {Promise<void>} Returns a promise that resolves to an array of listings matching the search criteria
//  */
// async function searchListings(req, res) {
//     // Implementation goes here
// }

export default {
  createListing,
  getListing,
  getAllListings,
  queryListings
};
