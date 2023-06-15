import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";


import authRoutes from "./routes/auth.js";

import { register } from "./controllers/auth.js";




/*
 * Configuration
 */

const __filename = fileURLToPath(import.meta.url); // Get the current file's absolute path
const __dirname = path.dirname(__filename); // Get the directory path of the current file
dotenv.config(); // Load environment variables from a .env file
const app = express(); // Create an instance of the Express application

app.use(express.json()); // Parse JSON bodies of incoming requests
app.use(helmet()); // Set security headers using the helmet middleware
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Configure cross-origin resource policy
app.use(morgan("common")); // Log HTTP requests using morgan middleware
app.use(bodyParser.json({ limit: "30mb", extended: true })); // Parse JSON payloads with size limit
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // Parse URL-encoded payloads with size limit
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // Serve static assets from the "public/assets" directory




/* FILE STORAGE */

// Configure the storage options for multer
const storage = multer.diskStorage({
	// Specify the destination folder for uploaded files
	destination: function (req, file, cb) {
		cb(null, "public/assets");
	},

	// Specify the filename for uploaded files
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});
// Create a multer instance with the configured storage options
const upload = multer({ storage });




/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);




/* ROUTES */
app.use("/auth", authRoutes);




/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

		/* ADD DATA ONE TIME */
		// User.insertMany(users);
		// Post.insertMany(posts);
	})
	.catch((error) => console.log(`${error} did not connect`));
