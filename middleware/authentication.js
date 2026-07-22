const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "failed",
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      status: "failed",
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticateToken;