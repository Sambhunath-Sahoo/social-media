import jwt from "jsonwebtoken";

/**
 * Verify JWT token for authentication
 * 
 * @param {Object} req - The request object containing the token in the Authorization header
 * @param {Object} res - The response object to send the result
 * @param {Function} next - The next function to continue to the next middleware or route handler
 */
export const verifyToken = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    let token = req.header("Authorization");

    // Check if the token exists
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    // Remove the "Bearer " prefix from the token if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // Verify the token using the JWT_SECRET
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Set the verified user information in the request object
    req.user = verified;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If an error occurs, respond with an error message
    res.status(500).json({ error: err.message });
  }
};
