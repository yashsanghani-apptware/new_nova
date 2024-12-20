import CampaignService from '../services/CampaignService';
import Campaign from '../models/Campaign';
import { extractUserIdFromToken, getOfferAndListingData, uploadFileToDataRoom } from '../utils/utils';
import { translate } from '../utils/i18n';

jest.mock('../models/Campaign');
jest.mock('../utils/utils');
jest.mock('../utils/i18n');

describe('CampaignService.uploadMedia', () => {
    const campaignService = new CampaignService();

    const mockCampaign = {
        campaign_id: 'campaign123',
        offering_id: 'offering123',
        main_picture: null,
        save: jest.fn().mockResolvedValue({ campaign_id: 'campaign123', offering_id: 'offering123', main_picture: 'fileId123' }),
    };

    const mockOfferData = {
        Listing: {
            dataroom_id: 'dataroom123',
        },
    };

    const mockFile = {
        image: {
            name: 'testImage.jpg',
            data: Buffer.from('image data'),
            mimetype: 'image/jpeg',
        },
    };

    const authHeader = 'Bearer token123';
    const userId = 'user123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully upload media and update the campaign', async () => {
        // Mock dependencies
        (extractUserIdFromToken as jest.Mock).mockReturnValue({ userId });
        (Campaign.findOne as jest.Mock).mockResolvedValue(mockCampaign);
        (getOfferAndListingData as jest.Mock).mockResolvedValue(mockOfferData);
        (uploadFileToDataRoom as jest.Mock).mockResolvedValue({ _id: 'fileId123' });

        const result = await campaignService.uploadMedia('campaign123', mockFile, authHeader);

        expect(Campaign.findOne).toHaveBeenCalledWith({ campaign_id: 'campaign123' });
        expect(getOfferAndListingData).toHaveBeenCalledWith('offering123', authHeader);
        expect(uploadFileToDataRoom).toHaveBeenCalledWith(
            expect.any(Blob), // Mocked Blob for the image
            'testImage.jpg',
            userId,
            mockCampaign,
            'dataroom123',
        );
        expect(mockCampaign.save).toHaveBeenCalled();
        expect(result.main_picture).toBe('fileId123');
    });

    it('should throw an error if the campaign is not found', async () => {
        (Campaign.findOne as jest.Mock).mockResolvedValue(null);

        await expect(campaignService.uploadMedia('invalidCampaignId', mockFile, authHeader))
            .rejects.toThrow(translate('CAMPAIGN_NOT_FOUND'));

        expect(Campaign.findOne).toHaveBeenCalledWith({ campaign_id: 'invalidCampaignId' });
    });

    it('should throw an error if offering data is not found', async () => {
        (Campaign.findOne as jest.Mock).mockResolvedValue(mockCampaign);
        (getOfferAndListingData as jest.Mock).mockResolvedValue(null);

        await expect(campaignService.uploadMedia('campaign123', mockFile, authHeader))
            .rejects.toThrow(translate('ERROR_FETCH_OFFERING'));

        expect(getOfferAndListingData).toHaveBeenCalledWith('offering123', authHeader);
    });

    it('should throw an error if listing data is not found', async () => {
        const incompleteOfferData = { Listing: null };
        (Campaign.findOne as jest.Mock).mockResolvedValue(mockCampaign);
        (getOfferAndListingData as jest.Mock).mockResolvedValue(incompleteOfferData);

        await expect(campaignService.uploadMedia('campaign123', mockFile, authHeader))
            .rejects.toThrow(translate('LISTING_NOT_FOUND'));

        expect(getOfferAndListingData).toHaveBeenCalledWith('offering123', authHeader);
    });

    it('should throw an error if no files are provided', async () => {
        (Campaign.findOne as jest.Mock).mockResolvedValue(mockCampaign);
        (getOfferAndListingData as jest.Mock).mockResolvedValue(mockOfferData);

        const emptyFiles = {};

        await expect(campaignService.uploadMedia('campaign123', emptyFiles, authHeader))
            .rejects.toThrow(translate('ERROR_UPLOADING_MEDIA'));
    });

    it('should handle errors during the upload process', async () => {
        (Campaign.findOne as jest.Mock).mockResolvedValue(mockCampaign);
        (getOfferAndListingData as jest.Mock).mockResolvedValue(mockOfferData);
        (uploadFileToDataRoom as jest.Mock).mockRejectedValue(new Error('Upload failed'));

        await expect(campaignService.uploadMedia('campaign123', mockFile, authHeader))
            .rejects.toThrow(translate('ERROR_UPLOADING_MEDIA') + 'Upload failed');

        expect(uploadFileToDataRoom).toHaveBeenCalled();
    });
});
