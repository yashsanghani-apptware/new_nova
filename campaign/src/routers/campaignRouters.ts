import express, { Router } from 'express';
import CampaignController from '../controllers/campaignController';
import { isAuthenticated, authorizeAction } from '../middlewares/roleAuthorization';
import { validateCampaignMiddleware } from '../middlewares/validateCampaignMiddleware';

const router: Router = express.Router();
isAuthenticated
// Route to create a new campaign
router.post('/', 
  isAuthenticated, 
  authorizeAction('campaign.create'), 
  validateCampaignMiddleware,
  (req, res) => CampaignController.createCampaign(req, res));


// Route to query campaigns - requires authentication and authorization 
router.get('/query', 
  isAuthenticated, 
  authorizeAction('campaign.query'), 
  (req, res) => CampaignController.queryCampaigns(req, res)
);

router.post('/search', 
  isAuthenticated, 
  authorizeAction('campaign.search'),
  (req, res) => CampaignController.searchCampaigns(req, res)
);

// Route to update an existing campaign
router.put('/:campaignId', 
  isAuthenticated, 
  authorizeAction('campaign.update'),
  (req, res) => CampaignController.modifyCampaign(req, res));

// Route to delete a campaign
router.delete('/:campaignId', 
  isAuthenticated, 
  authorizeAction('campaign.delete'),
  (req, res) => CampaignController.deleteCampaign(req, res));

// Route to get a list of all campaigns
router.get('/', 
  isAuthenticated,
  authorizeAction('campaign.readAll'),
  (req, res) => CampaignController.getAllCampaigns(req, res));

// Route to get a particular campaign by its ID
router.get('/:campaignId', 
  isAuthenticated, 
  authorizeAction('campaign.read'),
  (req, res) => CampaignController.getCampaign(req, res));

// Route to upload media
router.post('/media/:campaignId',
  isAuthenticated,
  authorizeAction('campaign.media'),
  (req, res) => CampaignController.uploadMedia(req, res)
);

export default router;
