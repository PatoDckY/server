const mongoose = require("mongoose");

// Definir el esquema para la colección preguntas_recuperacion
const preguntaRecuperacionSchema = new mongoose.Schema({
  _id: {
    type: Number, // El ID es un número
    required: true, // Es obligatorio
    unique: true, // Debe ser único
  },
  pregunta: {
    type: String, // La pregunta es un string
    required: true, // Es obligatoria
    trim: true, // Elimina espacios en blanco al inicio y al final
  },
});

// Crear el modelo a partir del esquema
// El tercer argumento especifica el nombre de la colección en MongoDB
const PreguntaRecuperacion = mongoose.model(
  "PreguntaRecuperacion", // Nombre del modelo
  preguntaRecuperacionSchema,
  "preguntas_recuperacion" // Nombre de la colección en MongoDB
);

module.exports = PreguntaRecuperacion;