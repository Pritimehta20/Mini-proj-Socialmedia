import jwt from "jsonwebtoken";
import User from "../Model/user.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // go to next (controller)
    } else {
      return res.status(401).json({ error: "No token provided" });
    }

  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export default protect;