const mongoose = require("mongoose");

// Definir el esquema de Mongoose para la colección "Guia"
const GuiaSchema = new mongoose.Schema({
  guia_usuario: {
    titulo: {
      type: String,
      required: true,
    },
    secciones: [
      {
        titulo: {
          type: String,
          required: true,
        },
        contenido: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
  },
});

// Crear y exportar el modelo de Mongoose para la colección "Guia"
module.exports = mongoose.model("Guia", GuiaSchema, "Guia");
