// models/sensorDataModel.js
const mongoose = require("mongoose");

// Definir el esquema para los datos de los sensores
const sensorDataSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
  },
  waterLevel: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Fecha y hora en que se guardan los datos
  },
});

// Crear el modelo a partir del esquema
const SensorData = mongoose.model("SensorData", sensorDataSchema);

module.exports = SensorData;