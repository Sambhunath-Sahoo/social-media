import express from "express";
import { login } from "../controllers/auth.js";

// Create a new router instance
const router = express.Router();

// Define a POST route for login
router.post("/login", login);

export default router;
