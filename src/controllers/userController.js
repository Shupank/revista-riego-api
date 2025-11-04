import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const user = new User({ nombre, email, password });
    await user.save();
    const { password: _, ...userWithoutPass } = user.toObject();
    res.status(201).json({ message: 'Usuario creado', data: userWithoutPass });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login exitoso', token, user: { id: user._id, nombre: user.nombre, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};