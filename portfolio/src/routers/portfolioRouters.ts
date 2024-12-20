import express, { Router } from "express";
import PortfolioController from "../controllers/portfolioController";
import { validatePortfolioMiddleware } from "../middlewares/validatePortfolioMiddleware";
import {
  isAuthenticated,
  authorizeAction,
} from "../middlewares/roleAuthorization";
const router: Router = express.Router();

//# Route to create a new portfolio - requires authentication and authorization
//# for 'portfolio.create' action

router.post(
  "/",
  isAuthenticated,
  authorizeAction("portfolio.create"),
  validatePortfolioMiddleware,
  (req, res) => PortfolioController.createPortfolio(req, res)
);

//# Route to query portfolios - requires authentication and authorization
//# for 'portfolio.query' action

router.get(
  "/query",
  isAuthenticated,
  authorizeAction("portfolio.query"),
  (req, res) => PortfolioController.queryPortfolios(req, res)
);

//# Route to get all portfolios - requires authentication and authorization
//# for 'portfolio.view' action

router.get(
  "/",
  isAuthenticated,
  authorizeAction("portfolio.view"),
  (req, res) => PortfolioController.getAllPortfolios(req, res)
);

//# Route to get a specific portfolio - requires authentication and authorization
//# for 'portfolio.view' action

router.get(
  "/:portfolio_id", // :portfolio_id
  isAuthenticated,
  authorizeAction("portfolio.view"),
  (req, res) => PortfolioController.getPortfolio(req, res)
);

//# Route to update a specific portfolio - requires authentication and authorization
//# for 'portfolio.update' action

router.put(
  "/:portfolio_id",
  isAuthenticated,
  authorizeAction("portfolio.update"),
  (req, res) => PortfolioController.updatePortfolio(req, res)
);

//# Route to delete a specific portfolio - requires authentication and authorization
//# for 'portfolio.delete' action
router.delete(
  "/:portfolio_id",
  isAuthenticated,
  authorizeAction("portfolio.delete"),
  (req, res) => PortfolioController.deletePortfolio(req, res)
);

router.post(
  "/search",
  isAuthenticated,
  authorizeAction("portfolio.search"),
  (req, res) => PortfolioController.searchPortfolios(req, res)
);

// Route to get all portfolios for a specific user - requires authentication and authorization
// for 'portfolio.view' action
router.get(
  "/user/:user_id",
  isAuthenticated,
  authorizeAction("portfolio.view"),
  (req, res) => PortfolioController.getPortfoliosByUser(req, res)
);

export default router;
