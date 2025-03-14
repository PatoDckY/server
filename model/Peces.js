const mongoose = require('mongoose');

// Definir el esquema para la colección Peces
const pezSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  temperatura: {
    type: String,
    required: true
  },
  ph: {
    type: String,
    required: true
  },
  caracteristicas: {
    type: String,
    required: true
  },
  comida: {
    type: String,
    required: true
  },
  imagen: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Si quieres agregar campos de fecha de creación y actualización automáticamente
});

// Crear el modelo para la colección Peces
const Pez = mongoose.model('Pez', pezSchema,"Peces");

module.exports = Pez;
