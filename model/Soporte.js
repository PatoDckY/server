const mongoose = require("mongoose");

// Definir el esquema de Mongoose para la colección "Soporte"
const SoporteSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: true,
  },
  preguntas: [
    {
      pregunta: {
        type: String,
        required: true,
      },
      respuesta: {
        type: String,
        required: false,  // Ahora es opcional
      },
    },
  ],
});

// Crear y exportar el modelo de Mongoose para la colección "Soporte"
module.exports = mongoose.model("Soporte", SoporteSchema, "Soporte");
