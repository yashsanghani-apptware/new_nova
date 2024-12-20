import CampaignService from '../services/CampaignService';
import Campaign from '../models/Campaign';
import mongoose from 'mongoose';

jest.mock('../models/Campaign'); // Mock the Campaign model

describe('CampaignService.queryCampaigns', () => {
  const campaignService = new CampaignService();

  it('should return paginated campaigns based on query options', async () => {
    const queryOptions = {
      page: 2,
      limit: 5,
      queryParams: { isActive: true }
    };

    // Mock campaign data
    const mockCampaigns = [
      { campaign_id: new mongoose.Types.ObjectId().toString(), name: 'Campaign 1', isActive: true },
      { campaign_id: new mongoose.Types.ObjectId().toString(), name: 'Campaign 2', isActive: true },
    ];

    const mockTotal = 12; // Mock the total number of campaigns

    // Mock the Campaign.find method to return paginated campaigns
    (Campaign.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockCampaigns),
    });

    // Mock the Campaign.countDocuments method to return the total count
    (Campaign.countDocuments as jest.Mock).mockResolvedValue(mockTotal);

    // Call the method
    const result = await campaignService.queryCampaigns(queryOptions);

    // Assertions
    expect(result.campaigns).toEqual(mockCampaigns);
    expect(result.total).toBe(mockTotal);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.pages).toBe(Math.ceil(mockTotal / 5));

    // Ensure that the Campaign.find and Campaign.countDocuments methods were called with correct filter
    expect(Campaign.find).toHaveBeenCalledWith({ isActive: 1 }); // Updated: 1 instead of true
    expect(Campaign.countDocuments).toHaveBeenCalledWith({ isActive: 1 }); // Updated: 1 instead of true
  });

  it('should return campaigns with default pagination when no page and limit are provided', async () => {
    const queryOptions = { 
      page: 1, // Providing default page
      limit: 10, // Providing default limit
      queryParams: { isActive: true }
    };

    // Mock campaign data
    const mockCampaigns = [
      { campaign_id: new mongoose.Types.ObjectId().toString(), name: 'Campaign 1', isActive: true },
    ];

    const mockTotal = 1;

    // Mock the Campaign.find and countDocuments methods
    (Campaign.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockCampaigns),
    });
    (Campaign.countDocuments as jest.Mock).mockResolvedValue(mockTotal);

    // Call the method
    const result = await campaignService.queryCampaigns(queryOptions);

    // Assertions
    expect(result.campaigns).toEqual(mockCampaigns);
    expect(result.total).toBe(mockTotal);
    expect(result.page).toBe(1); // Default page
    expect(result.limit).toBe(10); // Default limit
    expect(result.pages).toBe(1);

    // Ensure that the correct filter is passed
    expect(Campaign.find).toHaveBeenCalledWith({ isActive: 1 }); // Updated: 1 instead of true
    expect(Campaign.countDocuments).toHaveBeenCalledWith({ isActive: 1 }); // Updated: 1 instead of true
  });

  it('should throw an error if query fails', async () => {
    const queryOptions = { 
      page: 1, // Providing default page
      limit: 10, // Providing default limit
      queryParams: { isActive: true } 
    };

    // Mock the Campaign.find method to throw an error
    (Campaign.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockRejectedValue(new Error('Database error')),
    });

    // Expect the queryCampaigns method to throw the error
    await expect(campaignService.queryCampaigns(queryOptions)).rejects.toThrow('Database error');
  });
});
