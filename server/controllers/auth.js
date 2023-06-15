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



  /**
 * Log in a user
 * 
 * @param {Object} req - The request object containing the user credentials
 * @param {Object} res - The response object to send the result
 */
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
      /*
        * Compare the provided password with the user's hashed password
        * If the passwords do not match, return an error message
      */
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      // Generate a JSON Web Token (JWT) with the user's ID as the payload
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      // Remove the password field from the user object before sending the response
      delete user.password;
      // Respond with the token and the user object
      res.status(200).json({ token, user });
    } catch (err) {
      // If an error occurs, respond with an error message
      res.status(500).json({ error: err.message });
    }
  };
  
  