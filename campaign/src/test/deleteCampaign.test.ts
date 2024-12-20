import CampaignService from '../services/CampaignService';
import Campaign from '../models/Campaign';
import mongoose from 'mongoose';

jest.mock('../models/Campaign'); // Mock the Campaign model

describe('CampaignService.deleteCampaign', () => {
  const campaignService = new CampaignService();

  it('should mark a campaign as deleted and return the updated campaign', async () => {
    const campaignId = new mongoose.Types.ObjectId().toString();

    // Mock the deleted campaign data
    const mockDeletedCampaign = { campaign_id: campaignId, name: 'Test Campaign', isDeleted: true };

    // Mock the Campaign.findOneAndUpdate call to return the updated campaign
    (Campaign.findOneAndUpdate as jest.Mock).mockResolvedValue(mockDeletedCampaign);

    // Call the method
    const result = await campaignService.deleteCampaign(campaignId);

    // Expect the result to match the updated (deleted) campaign data
    expect(result).toEqual(mockDeletedCampaign);

    // Ensure that findOneAndUpdate is called with the correct arguments
    expect(Campaign.findOneAndUpdate).toHaveBeenCalledWith(
      { campaign_id: campaignId },
      { isDeleted: true },
      { new: true, runValidators: false }
    );
  });

  it('should throw an error if there is an issue deleting the campaign', async () => {
    const campaignId = new mongoose.Types.ObjectId().toString();

    // Mock the Campaign.findOneAndUpdate call to throw an error
    (Campaign.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

    // Call the method and expect it to throw an error
    await expect(campaignService.deleteCampaign(campaignId)).rejects.toThrow('Database error');
  });
});
