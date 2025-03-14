const mongoose = require("mongoose");

const NosotrosSchema = new mongoose.Schema({
  mision: {
    type: String,
    required: true, 
  },
  vision: {
    type: String,
    required: true, 
  },
  valores: {
    type: String,
    required: true, 
  },
});

module.exports = mongoose.model("Nosotros", NosotrosSchema, "Nosotros"); // El tercer parámetro especifica el nombre de la colección