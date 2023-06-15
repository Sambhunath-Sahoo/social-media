import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


/**
 * Register a new user
 * 
 * @param {Object} req - The request object containing the user data
 * @param {Object} res - The response object to send the result
 */
export const register = async (req, res) => {
    try {
      // Destructure the properties from the request body
      const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation,
      } = req.body;
  
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
  
      // Create a new User instance with the provided data
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000), // Generate a random viewed profile count
        impressions: Math.floor(Math.random() * 10000), // Generate a random impression count
      });
  
      // Save the new user to the database
      const savedUser = await newUser.save();
  
      // Respond with the saved user object
      res.status(201).json(savedUser);
    } catch (err) {
      // If an error occurs, respond with an error message
      res.status(500).json({ error: err.message });
    }
  };
  