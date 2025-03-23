const mongoose = require('mongoose');

// Esquema de la colección
const datosPeceraSchema = new mongoose.Schema({
  macAddress: { type: String, required: true }, // Dirección MAC del dispositivo
  temperatura: { type: Number, required: true }, // Temperatura medida
  nivelAgua: { type: Number, required: true }, // Nivel de agua medido
  distancia: { type: Number, required: true }, // Distancia medida
  bombaEncendida: { type: Boolean, required: true }, // Estado de la bomba
  fecha: { type: Date, default: Date.now }, // Fecha de registro
});

// Crear el modelo
const DatosPecera = mongoose.model('DatosPecera', datosPeceraSchema);

module.exports = DatosPecera;