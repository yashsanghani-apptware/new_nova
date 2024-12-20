import CampaignService from '../services/CampaignService';
import Campaign from '../models/Campaign';
import mongoose from 'mongoose';

jest.mock('../models/Campaign'); // Mock the Campaign model

describe('CampaignService.modifyCampaign', () => {
  const campaignService = new CampaignService();

  it('should successfully modify and return the updated campaign', async () => {
    // Mock campaign ID and update data
    const campaignId = new mongoose.Types.ObjectId().toString();
    const updates = {
      name: 'Updated Campaign Name',
      main_picture: 'http://example.com/updated-image.jpg',
    };

    // Mock existing campaign data
    const existingCampaign = {
      campaign_id: campaignId,
      name: 'Original Campaign',
      offering_id: new mongoose.Types.ObjectId(),
      main_picture: 'http://example.com/original-image.jpg',
      webinars: ['http://example.com/webinar'],
      newsletters: ['http://example.com/newsletter'],
      toObject: jest.fn().mockReturnValue({
        campaign_id: campaignId,
        name: 'Original Campaign',
        offering_id: new mongoose.Types.ObjectId(),
        main_picture: 'http://example.com/original-image.jpg',
      }),
    };

    // Mock the findOne method to return the current campaign
    (Campaign.findOne as jest.Mock).mockResolvedValue(existingCampaign);

    // Mock the findOneAndUpdate method to return the updated campaign
    const updatedCampaign = { ...existingCampaign, ...updates };
    (Campaign.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedCampaign);

    // Call the service method to modify the campaign
    const result = await campaignService.modifyCampaign(campaignId, updates);

    // Verify the results
    expect(result).toEqual(updatedCampaign);
    expect(Campaign.findOne).toHaveBeenCalledWith({ campaign_id: campaignId });
    expect(Campaign.findOneAndUpdate).toHaveBeenCalledWith(
      { campaign_id: campaignId },
      { ...existingCampaign.toObject(), ...updates },
      { new: true, runValidators: false }
    );
  });
});
