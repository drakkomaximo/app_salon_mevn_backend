import Appointment from "../model/Appointment.js";

const getUsersAppointments = async (req, res) => {
  const { user } = req.params;

  if (user !== req.user._id.toString()) {
    const error = new Error("No autorizado");
    return res.status(401).json({ message: error.message });
  }

  try {
    const query = req.user.admin
      ? { date: { $gte: new Date() } }
      : {
          user,
          date: { $gte: new Date() },
        };
    const appointments = await Appointment.find(query)
      .populate("services")
      .populate({
        path: "user",
        select: "name email",
      })
      .sort({ date: "asc" });
    res.json(appointments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Hubo un error" });
  }
};

export { getUsersAppointments };
