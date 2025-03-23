const mongoose = require('mongoose');

const LecturaSchema = new mongoose.Schema({
  macAddress: { type: String, required: true },
  lecturas: [
    {
      temperatura: Number,
      nivelAgua: Number,
      distancia: Number,
      bombaEncendida: Boolean,
      fecha: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Lectura', LecturaSchema);
