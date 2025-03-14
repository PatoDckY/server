const mongoose = require("mongoose");

// Definir el esquema de Mongoose para la colección "productos"
const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  imagen: { type: String, required: true },
});

// Crear y exportar el modelo de Mongoose para la colección "Productos"
module.exports = mongoose.model("Producto", ProductoSchema, "Productos");