import express, { Router } from 'express';
import ListingController from '../controllers/listingController';
import { isAuthenticated, authorizeAction } from '../middlewares/roleAuthorization';
import { validateListingMiddleware } from '../middlewares/validateListingMiddleware';
const router: Router = express.Router();

router.post('/webhook',
  (req, res) => ListingController.webhook(req, res)
);
// Route to create a new listing - requires authentication and authorization 
// for 'listing.create' action
router.post('/', 
  isAuthenticated, 
  authorizeAction('listing.create'), 
  validateListingMiddleware,
  (req, res) => ListingController.createListing(req, res)
);

// Route to query listings - requires authentication and authorization 
// for 'listing.query' action
router.get('/query', 
  isAuthenticated, 
  authorizeAction('listing.query'), 
  (req, res) => ListingController.queryListings(req, res)
);
  
// Route to get all listings - requires authentication and authorization 
// for 'listing.view' action
router.get('/', 
  isAuthenticated, 
  authorizeAction('listing.view'), 
  (req, res) => ListingController.getAllListings(req, res)
);

// Route to get a specific listing - requires authentication and authorization 
// for 'listing.view' action
router.get('/:listing_id', 
  isAuthenticated, 
  authorizeAction('listing.view'), 
  (req, res) => ListingController.getListing(req, res)
);

// Route to update a specific listing - requires authentication and authorization 
// for 'listing.update' action
router.put('/:listing_id', 
  isAuthenticated, 
  authorizeAction('listing.update'), 
  (req, res) => ListingController.updateListing(req, res)
);

// Route to delete a specific listing - requires authentication and authorization 
// for 'listing.delete' action
router.delete('/:listing_id', 
  isAuthenticated, 
  authorizeAction('listing.delete'), 
  (req, res) => ListingController.deleteListing(req, res) 
);

router.post('/search', 
  isAuthenticated, 
  authorizeAction('listing.search'),
  (req, res) => ListingController.searchListing(req, res)
);

// Route to upload media to a listing
router.post('/media/:listingId/:mediaType',
  isAuthenticated,
  authorizeAction('listing.media'),
  (req, res) => ListingController.uploadMedia(req, res)
);

router.post('/image/:listing_id',
  isAuthenticated,
  authorizeAction('listing.image'),
  (req, res) => ListingController.getImage(req, res)
);


export default router;
