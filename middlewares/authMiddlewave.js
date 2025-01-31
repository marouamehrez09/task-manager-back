import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    //const token = req.cookies?.token;

    const token = req.headers.authorization?.split(" ")[1]; // Lit le token depuis l'en-tête

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }

    try {
      console.log(
        "🚀 ~ protectRoute ~ process.env.JWT_SECRET:",
        process.env.JWT_SECRET
      );
      console.log("🚀 ~ protectRoute ~ token:", token);
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🚀 ~ protectRoute ~ decodedToken:", decodedToken);
      console.log(
        "🚀 ~ protectRoute ~ decodedToken.userId:",
        decodedToken.userId
      );

      const user = await User.findById(decodedToken.userId).select(
        "isAdmin email"
      );
      if (!user) {
        return res
          .status(401)
          .json({ status: false, message: "User not found. Try login again." });
      }

      req.user = {
        email: user.email,
        isAdmin: user.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } catch (error) {
      console.log("🚀 ~ protectRoute ~ error:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: false,
          message: "Token expired. Please login again.",
        });
      }
      return res
        .status(401)
        .json({ status: false, message: "Invalid token. Try login again." });
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { protectRoute, isAdminRoute };
