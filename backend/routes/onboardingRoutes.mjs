// this defines the end point for the onboarding process

// adding the necessary imports - express and the controller functions
import express from "express";
import { getStarted, showFeatures, showContact } from "../controllers/onboardingController.mjs";

// create a router instance
const router = express.Router();

// landing page - get started page
router.get("/start", getStarted);

// we can remove this, its optional

// features page - optional extra onboarding step
router.get("/features", showFeatures);

// contact page support page - optional extra onboarding step
router.get("/contact", showContact);

// export the router to be used in server.mjs
export default router;
//-------------------------------------------------------------------End of File----------------------------------------------------------//