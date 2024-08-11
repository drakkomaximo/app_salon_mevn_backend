import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import { db } from "./config/db.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentsRoutes from "./routes/appointmentRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

// Configurar dotenv
dotenv.config();

// Configurar la app
const app = express();

// Leer datos by body
app.use(express.json());

// Conectar a la base de datos
db();

// Habilitar CORS
const whitelist = [process.env.FRONTEND_URL];

if (process.argv[2] === "--postman") {
  whitelist.push(undefined);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Rutas
app.use("/api/services", servicesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/users", usersRoutes);

// Puerto
const PORT = process.env.PORT || 4000;

// Iniciar la app
app.listen(PORT, () => {
  console.log(
    colors.white.bgMagenta.bold(`Servidor corriendo en el puerto ${PORT}`)
  );
});
