import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
name: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'] 
  },
email: { 
    type: String, 
    required: [true, 'El email es obligatorio'], 
    unique: true,
    lowercase: true,
    trim: true,
  },
password: { 
    type: String, 
    required: [true, 'La contraseña es obligatoria'],
    // Seleccionar false hace que la contraseña no se devuelva en las consultas find() por defecto
    select: false 
  },
role: { 
    type: String, 
    enum: ['customer', 'admin'], 
    default: 'customer' 
  }
}, { timestamps: true });

// Middleware pre-save para encriptar la contraseña (Hook de Mongoose)
userSchema.pre('save', async function (next) {
// Solo encripta si la contraseña ha sido modificada (o es nueva)
if (!this.isModified('password')) return next();

  // Encriptación: Hashing con costo 10
this.password = await bcrypt.hash(this.password, 10);
next();
});

export default mongoose.model('User', userSchema);