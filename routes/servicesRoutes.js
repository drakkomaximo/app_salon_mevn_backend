import express from "express";
import {
  createServices,
  getServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
} from "../controllers/servicesControllers.js";

const router = express.Router();

router.route("/").get(getServices).post(createServices);

router
  .route("/:id")
  .get(getServiceById)
  .put(updateServiceById)
  .delete(deleteServiceById);

export default router;

//root
//NZuH9hQIqMiusSa1
