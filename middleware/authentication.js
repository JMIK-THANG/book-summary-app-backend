const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    // Step 1: Get the Authorization header
    const authHeader = req.headers.authorization;

    // Step 2: Check if the Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        status: "failed",
        message: "Access denied. No token provided.",
      });
    }

    // Step 3: Extract the token
    const token = authHeader.split(" ")[1];

    // Step 4: Verify the token
    const decodedToken = jwt.verify(token, "jmikankit");

    // Step 5: Store the decoded user information
    req.user = decodedToken;

    // Continue to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticateToken;