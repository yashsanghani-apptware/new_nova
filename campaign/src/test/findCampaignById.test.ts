import CampaignService from '../services/CampaignService';
import Campaign from '../models/Campaign';
import axios from 'axios';
import mongoose from 'mongoose';

jest.mock('../models/Campaign'); // Mock the Campaign model
jest.mock('axios'); // Mock axios

describe('CampaignService.findCampaignById', () => {
  const campaignService = new CampaignService();
  const authHeader = 'Bearer token';

  it('should find a campaign and return data', async () => {
    const campaignId = new mongoose.Types.ObjectId().toString();

    // Mock campaign data
    const mockCampaignData = { campaign_id: campaignId, offering_id: 'offering123', main_picture: 'file123' };
    
    // Mock offering data
    const mockOfferingData = { Listing: { listing_id: 'listing123' } };

    // Mock listing data
    const mockListingData = { id: 'listing123' };

    // Mock file data for the main picture
    const mockFileData = { id: 'file123', name: 'main_image.jpg' };

    // Mocking the Campaign.findOne call to return mock campaign data (no .exec())
    (Campaign.findOne as jest.Mock).mockResolvedValue(mockCampaignData);

    // Mock axios calls for offering, listing, and file data
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockOfferingData })  // First axios call (offering)
      .mockResolvedValueOnce({ data: mockListingData })   // Second axios call (listing)
      .mockResolvedValueOnce({ data: mockFileData });     // Third axios call (main picture)

    // Call the method
    const result = await campaignService.findCampaignById(campaignId, authHeader);

    // Expect that the result contains the correct campaign data
    expect(result.Campaign.campaign_id).toBe(campaignId);
    expect(result.Offering).toEqual(mockOfferingData);
    expect(result.Listing).toEqual(mockListingData);
    expect(result.MainPictureDatails).toEqual(mockFileData);
  });
});