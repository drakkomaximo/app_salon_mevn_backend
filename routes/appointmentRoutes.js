import express from "express";
import {
  createAppointment,
  getAppointmentById,
  getAppointmentsByDate,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, getAppointmentsByDate)
  .post(authMiddleware, createAppointment);

router
  .route("/:id")
  .get(authMiddleware, getAppointmentById)
  .put(authMiddleware, updateAppointment)
  .delete(authMiddleware, deleteAppointment);

export default router;
