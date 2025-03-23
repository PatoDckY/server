const mongoose = require('mongoose');

// Esquema de la colección
const datosPeceraSchema = new mongoose.Schema({
    macAddress: { type: String, required: true }, // Campo obligatorio
    temperatura: { type: Number, required: true }, // Campo obligatorio
    nivelAgua: { type: Number, required: true }, // Campo obligatorio
    distancia: { type: Number, required: true }, // Campo obligatorio
    bombaEncendida: { type: Boolean, required: true }, // Campo obligatorio
    fecha: { type: Date, default: Date.now }, // Campo opcional
  });

// Crear el modelo
const DatosPecera = mongoose.model('DatosPecera', datosPeceraSchema);

module.exports = DatosPecera;