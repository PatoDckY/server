const mongoose = require("mongoose");

// Definir el esquema de Mongoose para la colección "Contacto"
const ContactoSchema = new mongoose.Schema({
  horario_atencion: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  ubicacion: {
    ciudad: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      required: true,
    },
    pais: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
  },
});

// Crear y exportar el modelo de Mongoose para la colección "Contacto"
module.exports = mongoose.model("Contacto", ContactoSchema, "Contacto");
