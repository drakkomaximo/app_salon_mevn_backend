import { createTransport } from "../config/nodemailer.js";

export async function sendEmailNewAppointment({ date, time, totalAmount }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  // send mail with defined transport object
  await transporter.sendMail({
    from: "App Salon <citas@appsalon.com>",
    to: "admin@appsalon.com",
    subject: "App Salon New Appointment",
    text: "App Salon New Appointment",
    html: `<p>Hello: Admin, you have a new appointment</p>
        <p>Appointment details:</p>
        <p>Date: ${date}</p>
        <p>Time: ${time}</p>
        <p>Total Amount: $${totalAmount}</p>
        `,
  });
}

export const sendEmailUpdateAppointment = async ({ date, time }) => {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  // send mail with defined transport object
  await transporter.sendMail({
    from: "App Salon <citas@appsalon.com>",
    to: "admin@appsalon.com",
    subject: "App Salon Update Appointment",
    text: "App Salon Update Appointment",
    html: `<p>Hello: Admin, an appointment has been updated</p>
            <p>Appointment details:</p>
            <p>Date: ${date}</p>
            <p>Time: ${time}</p>
            `,
  });
};

export const sendEmailDeleteAppointment = async ({ date, time }) => {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  // send mail with defined transport object
  await transporter.sendMail({
    from: "App Salon <citas@appsalon.com>",
    to: "admin@appsalon.com",
    subject: "App Salon Delete Appointment",
    text: "App Salon Delete Appointment",
    html: `<p>Hello: Admin, an appointment has been deleted</p>
            <p>Appointment details:</p>
            <p>Date: ${date}</p>
            <p>Time: ${time}</p>
            `,
  });
};
