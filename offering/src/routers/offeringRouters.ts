import express, { Router } from "express";
import OfferingController from "../controllers/offeringController";

import { validateOfferingMiddleware } from "../middlewares/validateOfferingMiddleware";
import {
  isAuthenticated,
  authorizeAction,
} from "../middlewares/roleAuthorization";
const router: Router = express.Router();

// Route to create a new offering - requires authentication and authorization
// for 'offering.create' action
router.post(
  "/",
  validateOfferingMiddleware,
  isAuthenticated,
  authorizeAction("offering.create"),
  (req, res) => OfferingController.createOffering(req, res)
);

// Route to query offerings - requires authentication and authorization 
// for 'offering.query' action
router.get('/query', 
  isAuthenticated, 
  authorizeAction('offering.query'), 
  (req, res) => OfferingController.queryOfferings(req, res)
);

// Route to get all offerings - requires authentication and authorization
// for 'offering.view' action
router.get("/", isAuthenticated, authorizeAction("offering.view"), (req, res) =>
  OfferingController.getAllofferings(req, res)
);

router.get(
  "/crops",
  isAuthenticated,
  authorizeAction("offering.view"),
  (req, res) => OfferingController.getCrop(req, res)
)

// Route to get a specific offering - requires authentication and authorization
// for 'offering.view' action
router.get(
  "/:id", // :offering_id OR :listing_id
  isAuthenticated,
  authorizeAction("offering.view"),
  (req, res) => OfferingController.getOffering(req, res)
);

// Route to update a specific offering - requires authentication and authorization 
// for 'offering.update' action
router.put('/:offering_id', 
  isAuthenticated, 
  authorizeAction('offering.update'), 
  (req, res) => OfferingController.updateOffering(req, res)
);

// Route to delete a specific offering - requires authentication and authorization 
// for 'offering.delete' action
router.delete('/:offering_id', 
  isAuthenticated, 
  authorizeAction('offering.delete'), 
  (req, res) => OfferingController.deleteOffering(req, res) 
);

router.post('/search', 
  isAuthenticated, 
  authorizeAction('offering.search'),
  (req, res) => OfferingController.searchOfferings(req, res)
);

router.put(
  "/:offering_id/documents",
  isAuthenticated,
  authorizeAction("offering.update"),
  (req, res) => OfferingController.updateDocuments(req, res)
)




export default router;
