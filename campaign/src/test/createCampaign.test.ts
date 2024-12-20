import { ICampaign } from '../models/Campaign';
import CampaignService from '../services/CampaignService';
import { extractUserIdFromToken } from '../utils/utils';
import axios from 'axios';
import Campaign from '../models/Campaign';
import mongoose from 'mongoose';
import config from '../config/config';
// Mock axios and other dependencies
jest.mock('axios');
jest.mock('../utils/utils');

// Mocking Campaign model methods
jest.mock('../models/Campaign', () => {
    const mockCampaign = jest.fn();
    mockCampaign.prototype.save = jest.fn();
    return mockCampaign;
});

describe('CampaignService.createCampaign', () => {
    let campaignService: CampaignService;

    beforeEach(() => {
        campaignService = new CampaignService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create and save a new campaign', async () => {
        // Mock campaign data
        const campaignData = {
            _id: new mongoose.Types.ObjectId(),
            campaign_id: new mongoose.Types.ObjectId(),
            name: 'Test Campaign',
            offering_id: new mongoose.Types.ObjectId(),
            main_picture: 'http://example.com/image.jpg',
            webinars: ['http://example.com/webinar'],
            newsletters: ['http://example.com/newsletter'],
            isDeleted: false
        } as ICampaign;

        // Mock authHeader
        const authHeader = 'Bearer mockToken';

        // Mock the extractUserIdFromToken function
        (extractUserIdFromToken as jest.Mock).mockReturnValue({ userId: 'mockUserId' });

        // Mock axios response for offering service
        (axios.get as jest.Mock).mockResolvedValue({ data: { offering: 'some data' } });

        // Mock the save method to return the saved campaign
        const savedCampaign = { ...campaignData, _id: new mongoose.Types.ObjectId() };
        (Campaign.prototype.save as jest.Mock).mockResolvedValue(savedCampaign);

        // Call the createCampaign function
        const result = await campaignService.createCampaign(campaignData, authHeader);

        // Expectations
        expect(extractUserIdFromToken).toHaveBeenCalledWith(authHeader);
        expect(axios.get).toHaveBeenCalledWith(
            `${config.offeringServiceUrl}/api/offerings/${campaignData.offering_id}`,
            { headers: { Authorization: authHeader } }
        );
        expect(Campaign.prototype.save).toHaveBeenCalled();
        expect(result).toEqual(savedCampaign);
    });      
});
