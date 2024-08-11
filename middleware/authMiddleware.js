import jwt from "jsonwebtoken";
import User from "../model/User.js";
const authMiddleware = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select(
        "-password -verified -token -__v"
      );
    } catch {
      res.status(401).json({ message: "Token is not valid" });
    }
    next();
  } else {
    const error = new Error("No token, authorization denied");
    res.status(401).json({ message: error.message });
  }
};

export default authMiddleware;
