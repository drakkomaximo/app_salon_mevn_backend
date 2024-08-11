import mongoose from "mongoose";
import colors from "colors";

export const db = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      colors.cyan.bgGreen.bold(
        `MongoDB connected: ${db.connection.host}: ${db.connection.port}`
      )
    );
  } catch (error) {
    console.log(colors.red.bgYellow.bold(`Error: ${error.message}`));
    process.exit(1);
  }
};
