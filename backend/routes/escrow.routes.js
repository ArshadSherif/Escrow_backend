import express from "express";
import { createEscrow } from "../controllers/escrow.controller.js";
import { fundMilestoneController } from "../controllers/escrow.controller.js";

const router = express.Router();

router.post("/create", createEscrow);
router.post("/fund", fundMilestoneController);

export default router;
