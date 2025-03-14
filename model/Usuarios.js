const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
  },
  apellidoP: {
    type: String,
    required: [true, "El apellido paterno es obligatorio"],
    trim: true,
  },
  apellidoM: {
    type: String,
    required: [true, "El apellido materno es obligatorio"],
    trim: true,
  },
  telefono: {
    type: String,
    required: [true, "El teléfono es obligatorio"],
    match: [/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos"],
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Por favor ingresa un correo electrónico válido"],
  },
  contraseña: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
  },
  sexo: {
    type: String,
    required: [true, "El sexo es obligatorio"],
    enum: ["masculino", "femenino", "otro"],
  },
  edad: {
    type: Number,
    required: [true, "La edad es obligatoria"],
    min: [18, "La edad debe ser al menos 18 años"],
    max: [100, "La edad no puede ser mayor a 100 años"],
  },
  pregunta_recuperacion: {
    preg_id: {
      type: Number,
      required: [true, "El ID de la pregunta de recuperación es obligatorio"],
    },
    respuesta: {
      type: String,
      required: [true, "La respuesta de recuperación es obligatoria"],
    },
  },
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
    enum: ["Cliente", "Administrador"],
  },
});

usuarioSchema.index({ email: 1 }, { unique: true });
usuarioSchema.index({ telefono: 1 }, { unique: true });


const Usuario = mongoose.model("Usuario", usuarioSchema, "Usuarios");

module.exports = Usuario;
