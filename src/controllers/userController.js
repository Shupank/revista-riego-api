import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- C (Create) y AUTH ---

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación de existencia
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // 409 Conflict: El recurso ya existe
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    // Crear nuevo usuario y guardar (el pre-save hook encripta el password)
    const user = new User({ name, email, password }); 
    await user.save(); 

    // Excluir password de la respuesta
    const { password: _, ...userWithoutPass } = user.toObject();
    // 201 Created: Recurso creado con éxito
    res.status(201).json({ message: 'Usuario creado', data: userWithoutPass });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Duplicado detectado' });
    }
    // 400 Bad Request: Error de validación o formato
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email, incluyendo el password (select: false en el modelo)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // 401 Unauthorized: Credenciales incorrectas
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // <-- Ahora garantizado que existe
      { expiresIn: '1h' }
    );

    // 200 OK: Login exitoso
    res.json({
      message: 'Login exitoso',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    // 500 Internal Server Error: Error del servidor
    res.status(500).json({ message: error.message });
  }
};

// --- R (Read) ---

export const getAllUsers = async (req, res) => {
  try {
    // .select('-password') excluye la contraseña de la respuesta
    const users = await User.find().select('-password'); 
    // 200 OK: Éxito
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      // 404 Not Found: Recurso no encontrado
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 200 OK: Éxito
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    // Este error podría ser por un ID malformado
    res.status(400).json({ message: 'ID de usuario inválido' }); 
  }
};

// --- U (Update) ---

export const updateUser = async (req, res) => {
  try {
    // Previene la actualización de la contraseña por esta ruta
    if (req.body.password) {
      return res.status(400).json({ message: 'Use la ruta de cambio de contraseña' });
    }

    // { new: true } devuelve el documento actualizado
    // { runValidators: true } corre las validaciones del esquema en el update
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password'); // Excluye password

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
    }

    // 200 OK: Éxito
    res.status(200).json({ status: 'success', message: 'Usuario actualizado', data: user });
  } catch (error) {
    // 400 Bad Request: Error de validación o ID malformado
    res.status(400).json({ message: error.message });
  }
};

// --- D (Delete) ---

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
    }

    // 204 No Content: Práctica recomendada para eliminación exitosa sin devolver cuerpo
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};