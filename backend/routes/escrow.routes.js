import express from "express";
import { createEscrow } from "../controllers/escrow.controller.js";

const router = express.Router();

router.post("/create", createEscrow);

export default router;
