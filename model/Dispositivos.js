const mongoose = require('mongoose');

const DispositivoSchema = new mongoose.Schema({
  macAddress: { type: String, unique: true, required: true },
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dispositivo', DispositivoSchema);
