import CampaignService from '../services/CampaignService';
import Campaign from '../models/Campaign';

jest.mock('../models/Campaign'); // Mock the Campaign model

describe('CampaignService.getAllCampaigns', () => {
  const campaignService = new CampaignService();

  it('should return all campaigns that are not deleted', async () => {
    // Mock campaign data
    const mockCampaigns = [
      { campaign_id: '1', name: 'Campaign 1', isDeleted: false },
      { campaign_id: '2', name: 'Campaign 2', isDeleted: false },
    ];

    // Mock the Campaign.find call to return mock campaign data
    (Campaign.find as jest.Mock).mockResolvedValue(mockCampaigns);

    // Call the method
    const result = await campaignService.getAllCampaigns();

    // Expect that the result contains the correct campaign data
    expect(result).toEqual(mockCampaigns);

    // Ensure that the find method was called with the correct filter
    expect(Campaign.find).toHaveBeenCalledWith({ isDeleted: false });
  });

  it('should throw an error if there is an issue fetching campaigns', async () => {
    // Mock the Campaign.find call to throw an error
    (Campaign.find as jest.Mock).mockRejectedValue(new Error('Database error'));

    // Call the method and expect it to throw an error
    await expect(campaignService.getAllCampaigns()).rejects.toThrow('Database error');
  });
});
