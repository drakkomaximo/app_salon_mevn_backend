import { createTransport } from "../config/nodemailer.js";

export async function sendEmailVerification({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  // send mail with defined transport object
  await transporter.sendMail({
    from: "App Salon <cuenta@appsalon.com>",
    to: email,
    subject: "App Salon Confirm Account",
    text: "App Salon Confirm Account",
    html: `<p>Hola: ${name}, confirm your account in AppSalon</p>
        <p>our account is almost ready. Please confirm it using the following link </p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account/${token}">Confirm Account</a>
        <p>If you did not create an account, please ignore this message.</p>
    `,
  });
}

export async function sendEmailResetPassword({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  // send mail with defined transport object
  await transporter.sendMail({
    from: "App Salon <cuenta@appsalon.com>",
    to: email,
    subject: "App Salon Reset Password",
    text: "App Salon Reset Password",
    html: `<p>Hola: ${name}, reset your password in AppSalon</p>
        <p>Reset your password using the following link </p>
        <a href="${process.env.FRONTEND_URL}/auth/forgot-password/${token}">Reset Password</a>
        <p>If you did not request a password reset, please ignore this message.</p>
    `,
  });
}
