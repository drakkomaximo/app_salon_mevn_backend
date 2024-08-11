import User from "../model/User.js";
import {
  sendEmailVerification,
  sendEmailResetPassword,
} from "../emails/authEmailService.js";
import { generateJWT, uniqueId } from "../utils/index.js";

const register = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    return res.status(400).json({ message: error.message });
  }

  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("El usuario ya existe");
    return res.status(400).json({ message: error.message });
  }

  const MIN_PASSWORD_LENGTH = 8;
  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    const error = new Error(
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
    );
    return res.status(400).json({ message: error.message });
  }

  try {
    const user = new User(req.body);
    const result = await user.save();

    const { name, email, token } = result;

    sendEmailVerification({
      name,
      email,
      token,
    });

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

const verify = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      const error = new Error("El usuario no existe");
      return res.status(401).json({ message: error.message });
    }

    user.verified = true;
    user.token = "";

    await user.save();

    res.status(200).json({ message: "Usuario verificado correctamente" });
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

const login = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    return res.status(400).json({ message: error.message });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("El usuario no existe");
      return res.status(400).json({ message: error.message });
    }

    if (!user.verified) {
      const error = new Error("El usuario no está verificado");
      return res.status(400).json({ message: error.message });
    }

    const match = await user.comparePassword(password);

    if (!match) {
      const error = new Error("La contraseña no es correcta");
      return res.status(400).json({ message: error.message });
    }

    const token = generateJWT(user._id);

    res.status(200).json({ token });
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

const user = async (req, res) => {
  const { user } = req;
  res.status(200).json({ user });
};

const admin = async (req, res) => {
  const { user } = req;

  if (!user.admin) {
    const error = new Error("No tienes permisos de administrador");
    return res.status(403).json({ message: error.message });
  }

  res.status(200).json({ user });
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ message: error.message });
    }

    const token = uniqueId();

    user.token = token;
    const result = await user.save();

    await sendEmailResetPassword({
      name: result.name,
      email: result.email,
      token: result.token,
    });

    res.status(200).json({ message: "Token enviado al email" });
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

const verifyPasswordResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      const error = new Error("El token no es válido");
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: "Token verificado correctamente" });
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ message: error.message });
    }

    const MIN_PASSWORD_LENGTH = 8;
    if (password.trim().length < MIN_PASSWORD_LENGTH) {
      const error = new Error(
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
      );
      return res.status(400).json({ message: error.message });
    }

    user.password = password;
    user.token = "";
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

export {
  register,
  verify,
  login,
  user,
  forgotPassword,
  newPassword,
  verifyPasswordResetToken,
  admin,
};
