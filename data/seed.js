import dotenv from "dotenv";
import colors from "colors";
import { db } from "../config/db.js";
import Services from "../model/Services.js";
import { services } from "./beautyServices.js";
dotenv.config();
await db();

async function seedDB() {
  try {
    await Services.insertMany(services);
    console.log(colors.green.bgWhite.bold("Datos importados exitosamente"));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function cleanDB() {
    try {
        await Services.deleteMany();
        console.log(colors.red.bgWhite.bold("Datos eliminados exitosamente"));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    } 
}

if (process.argv[2] === "--import") {
  seedDB();
} else {
  cleanDB();
}
