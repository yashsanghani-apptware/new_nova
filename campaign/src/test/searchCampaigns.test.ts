import CampaignService from '../services/CampaignService';
import Campaign from '../models/Campaign';
import mongoose from 'mongoose';

jest.mock('../models/Campaign'); // Mock the Campaign model

describe('CampaignService.searchCampaigns', () => {
  const campaignService = new CampaignService();

  it('should return paginated campaigns based on search options', async () => {
    const searchOptions = {
      page: 1,
      limit: 5,
      sort: 'name',
      order: 'asc' as const,  // Ensure the order is typed as "asc" or "desc"
      filters: { name: 'Test Campaign' }
    };

    // Mock campaign data
    const mockCampaigns = [
      { campaign_id: new mongoose.Types.ObjectId().toString(), name: 'Test Campaign 1', isActive: true },
      { campaign_id: new mongoose.Types.ObjectId().toString(), name: 'Test Campaign 2', isActive: true },
    ];

    const mockTotal = 10; // Mock the total number of campaigns

    // Mock the Campaign.find method to return a query object with exec
    (Campaign.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockCampaigns), // Mock exec() to resolve the mock campaigns
    });

    // Mock the Campaign.countDocuments method to return the total count
    (Campaign.countDocuments as jest.Mock).mockResolvedValue(mockTotal);

    // Call the method
    const result = await campaignService.searchCampaigns(searchOptions);

    // Assertions
    expect(result.campaigns).toEqual(mockCampaigns);
    expect(result.total).toBe(mockTotal);
    expect(result.page).toBe(1);
    expect(result.pages).toBe(Math.ceil(mockTotal / 5));

    // Ensure that the Campaign.find and Campaign.countDocuments methods were called with correct filter and sorting
    expect(Campaign.find).toHaveBeenCalledWith({
      name: { $regex: 'Test Campaign', $options: 'i' }
    });
    expect(Campaign.countDocuments).toHaveBeenCalledWith({
      name: { $regex: 'Test Campaign', $options: 'i' }
    });
  });

  it('should return campaigns sorted in descending order when specified', async () => {
    const searchOptions = {
      page: 1,
      limit: 5,
      sort: 'createdAt',
      order: 'desc' as const,  // Explicitly set to "desc"
      filters: { name: 'Campaign' }
    };

    // Mock campaign data
    const mockCampaigns = [
      { campaign_id: new mongoose.Types.ObjectId().toString(), name: 'Campaign 1', isActive: true },
    ];

    const mockTotal = 1;

    // Mock the Campaign.find method to return a query object with exec
    (Campaign.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockCampaigns), // Mock exec() to resolve the mock campaigns
    });

    // Mock the Campaign.countDocuments method to return the total count
    (Campaign.countDocuments as jest.Mock).mockResolvedValue(mockTotal);

    // Call the method
    const result = await campaignService.searchCampaigns(searchOptions);

    // Assertions
    expect(result.campaigns).toEqual(mockCampaigns);
    expect(result.total).toBe(mockTotal);
    expect(result.page).toBe(1);
    expect(result.pages).toBe(1);

    // Ensure that the correct sorting is applied (descending)
    expect(Campaign.find).toHaveBeenCalledWith({
      name: { $regex: 'Campaign', $options: 'i' }
    });
    expect(Campaign.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it('should throw an error if the search query fails', async () => {
    const searchOptions = {
      page: 1,
      limit: 5,
      sort: 'name',
      order: 'asc' as const,  // Explicitly set to "asc"
      filters: { name: 'Campaign' }
    };

    // Mock the Campaign.find method to throw an error
    (Campaign.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error('Database error')),
    });

    // Expect the searchCampaigns method to throw the error
    await expect(campaignService.searchCampaigns(searchOptions)).rejects.toThrow('Database error');
  });
});
