import jwt from "jsonwebtoken";
import axios from 'axios';
import config from "../config";
import Offering, { IOffering } from "../model/Offering";

/**
 * Converts a listing name to a dataroom name.
 *
 * @param {string} listingName - The name of the listing.
 * @returns {string} - The formatted dataroom name.
 */
export function createDataRoomName(listingName: string): string {
  return listingName
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, "_") // Replace special characters with underscores
    .replace(/^_+|_+$/g, ""); // Remove leading or trailing underscores
}

const JWT_SECRET = process.env.JWT_SECRET || 'agsiri2023';

/**
 * Extracts the user ID and role from an authorization token.
 *
 * @param {string} authHeader - The authorization header with the token.
 * @returns {{ userId: string, role: string } | null} - The extracted user ID and role, or null if the token is invalid.
 * @throws {Error} - If the token is invalid, expired, or missing.
 */
export const extractUserIdFromToken = (
  authHeader: string
): { userId: string; role: string } | null => {

  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
    return { userId: decoded.userId, role: decoded.role };
  } catch (error: any) {
    console.error("Error verifying token:", error.message, error);
    throw new Error("Invalid token");
  }
};

  /**
   * Uploads a file to the data room service.
   *
   * @param {Blob} fileBlob - The file blob to upload.
   * @param {string} fileName - The name of the file.
   * @param {string} userId - The ID of the user uploading the file.
   * @param {IListing} listing - The listing this file is associated with.
   * @returns {Promise<object>} - The response from the data room service.
   * @throws {Error} - If there is an error uploading the file.
   */
export async function uploadFileToDataRoom(
    fileBlob: Blob,
    fileName: string,
    userId: string,
    listing: {
      name: string;
      dataroom_id: string;
    }
  ) {
    try {
      // Create a new FormData object
      const newFileFormData = new FormData();
  
      // Append the file and metadata to the FormData
      newFileFormData.append("file", fileBlob, fileName);
      newFileFormData.append("organization_id", userId);
      newFileFormData.append("name", fileName);
      newFileFormData.append("description", `Image for the listing name: ${listing?.name}`);
      newFileFormData.append("created_by", userId);
      newFileFormData.append("type", "SHARED");
      newFileFormData.append("status", "Pending");
      newFileFormData.append("encryption_key", "someEncryptionKey");
      newFileFormData.append("ari", `ari:drs:us:client:agsiri:dataroom:${createDataRoomName(listing?.name)}`);
      newFileFormData.append("dataroom_id", `${listing?.dataroom_id}`);
  
      // Make the axios POST request
      const response = await axios.post(`${config.dataRoomServiceUrl}/files`, newFileFormData);
  
      // Return the response
      return response.data;
    } catch (error) {
      console.error("ERROR_UPLOADING_FILE", { error });
      throw error; // Re-throw the error so it can be handled elsewhere if needed
    }
  }
// Add more utility functions here...

// validationUtils.ts

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface MapData {
  property: GeoLocation;
  nearby: GeoLocation;
}

// Function to validate latitude and longitude
export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90;
}

export function isValidLongitude(lon: number): boolean {
  return lon >= -180 && lon <= 180;
}

export function isValidGeoLocation(location: GeoLocation): boolean {
  return isValidLatitude(location.latitude) && isValidLongitude(location.longitude);
}

// Function to validate a map object
export function validateMap(map: MapData): boolean {
  return isValidGeoLocation(map.property) && isValidGeoLocation(map.nearby);
}
