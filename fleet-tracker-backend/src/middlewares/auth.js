import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Authorization header missing or malformed",
      });
    }

  
    const bearerToken = authHeader.split(" ")[1];

    if (!bearerToken) {
      return res.status(401).json({
        status: "error",
        message: "Token not provided",
      });
    }

    const decoded = verifyToken(bearerToken);

    if (!decoded) {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }

   
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

   
    req.user = user;
    console.log("Authenticated user:", user);
    req.token = bearerToken;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
