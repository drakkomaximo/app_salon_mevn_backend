import Services from "../model/Services.js";
import { handleNotFoundError, validateObjectId } from "../utils/index.js";

const createServices = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    const error = new Error("Por favor, llena todos los campos");
    return res.status(400).json({ message: error.message });
  }

  try {
    const services = new Services(req.body);
    await services.save();

    res.status(201).json({
      message: "Servicio creado exitosamente",
    });
  } catch (error) {
    const message = "Error en el servidor";
    res.status(500).json({ message });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Services.find();
    res.send(services);
  } catch (error) {
    const message = "Error en el servidor";
    res.status(500).json({ message });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;

  if (validateObjectId(id, res)) return;

  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError("Servicio no encontrado", res);
  }
  res.send(service);
};

const updateServiceById = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (validateObjectId(id, res)) return;

  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError("Servicio no encontrado", res);
  }

  service.name = name || service.name;
  service.price = price || service.price;

  try {
    await service.save();
    res.send({
      message: "Servicio actualizado exitosamente",
    });
  } catch (error) {
    const message = "Error en el servidor";
    res.status(500).json({ message });
  }
};

const deleteServiceById = async (req, res) => {
  const { id } = req.params;

  if (validateObjectId(id, res)) return;

  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError("Servicio no encontrado", res);
  }

  try {
    await service.deleteOne();
    res.send({
      message: "Servicio eliminado exitosamente",
    });
  } catch (error) {
    const message = "Error en el servidor";
    res.status(500).json({ message });
  }
};

export {
  createServices,
  updateServiceById,
  getServices,
  getServiceById,
  deleteServiceById,
};
