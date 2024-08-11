import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { format } from "date-fns";

function validateObjectId(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("El ID no es válido");
    return res.status(400).json({ message: error.message });
  }
}

function handleNotFoundError(message, res) {
  const error = new Error(message);
  return res.status(404).json({ message: error.message });
}

const uniqueId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const generateJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return token;
};

function formatDate(date) {
  return format(date, "PPPP");
}

export { validateObjectId, handleNotFoundError, uniqueId, generateJWT, formatDate };
