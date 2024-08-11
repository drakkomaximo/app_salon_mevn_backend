import { parse, formatISO, startOfDay, endOfDay, isValid } from "date-fns";
import Appointment from "../model/Appointment.js";
import {
  handleNotFoundError,
  validateObjectId,
  formatDate,
} from "../utils/index.js";
import {
  sendEmailNewAppointment,
  sendEmailUpdateAppointment,
  sendEmailDeleteAppointment,
} from "../emails/appointmentEmailService.js";

const createAppointment = async (req, res) => {
  const appointment = req.body;
  appointment.user = req.user._id.toString();

  try {
    const newAppointment = new Appointment(appointment);
    const result = await newAppointment.save();

    await sendEmailNewAppointment({
      date: formatDate(result.date),
      time: result.time,
      totalAmount: result.totalAmount,
    });

    res.status(201).json({
      message: "Appointment created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAppointmentsByDate = async (req, res) => {
  const { date } = req.query;

  const newDate = parse(date, "dd/MM/yyyy", new Date());

  try {
    if (!isValid(newDate)) {
      const error = new Error("Invalid date");
      return res.status(400).json({ message: error.message });
    }

    const isoDate = formatISO(newDate);

    const appointments = await Appointment.find({
      date: {
        $gte: startOfDay(new Date(isoDate)),
        $lte: endOfDay(new Date(isoDate)),
      },
    }).select("time");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    if (validateObjectId(id, res)) return;

    const appointment = await Appointment.findById(id).populate("services");
    if (!appointment) {
      return handleNotFoundError("Appointment not found", res);
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      const error = new Error("Unauthorized");
      return res.status(401).json({ message: error.message });
    }

    res.send(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;

  if (validateObjectId(id, res)) return;

  const appointment = await Appointment.findById(id).populate("services");
  if (!appointment) {
    return handleNotFoundError("Appointment not found", res);
  }

  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error("Unauthorized");
    return res.status(401).json({ message: error.message });
  }

  const { date, time, totalAmount, services } = req.body;
  appointment.date = date;
  appointment.time = time;
  appointment.totalAmount = totalAmount;
  appointment.services = services;

  try {
    const result = await appointment.save();
    await sendEmailUpdateAppointment({
      date: formatDate(result.date),
      time: result.time,
    });
    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  if (validateObjectId(id, res)) return;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return handleNotFoundError("Appointment not found", res);
  }

  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error("Unauthorized");
    return res.status(401).json({ message: error.message });
  }

  try {
    const result = await appointment.deleteOne();
    await sendEmailDeleteAppointment({
      date: formatDate(appointment.date),
      time: appointment.time,
    });
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  createAppointment,
  getAppointmentsByDate,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
