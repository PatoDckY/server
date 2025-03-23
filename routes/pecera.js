const express = require('express');
const Dispositivo = require('../model/Dispositivos'); // Modelo de dispositivos
const Lectura = require('../model/Lecturas'); // Modelo de lecturas
const router = express.Router();

// Registrar dispositivo y almacenar lecturas
router.post('/', async (req, res) => {
  const { macAddress, temperatura, nivelAgua, distancia, bombaEncendida } = req.body;

  try {
    // Verificar si el dispositivo ya existe, si no, registrarlo
    let dispositivo = await Dispositivo.findOne({ macAddress });
    if (!dispositivo) {
      dispositivo = new Dispositivo({ macAddress });
      await dispositivo.save();
    }

    // Buscar si ya hay un documento de lecturas para la MAC
    let lectura = await Lectura.findOne({ macAddress });

    if (!lectura) {
      // Si no hay registros, crear uno nuevo
      lectura = new Lectura({
        macAddress,
        lecturas: [{ temperatura, nivelAgua, distancia, bombaEncendida }]
      });
    } else {
      // Si ya existe, agregar la nueva lectura al array
      lectura.lecturas.push({ temperatura, nivelAgua, distancia, bombaEncendida });
    }

    await lectura.save();
    res.status(200).json({ message: 'Lectura registrada correctamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la lectura', error });
  }
});

// Obtener todas las lecturas de un dispositivo específico
router.get('/:macAddress', async (req, res) => {
  try {
    const { macAddress } = req.params;
    const lectura = await Lectura.findOne({ macAddress });

    if (!lectura) {
      return res.status(404).json({ message: 'No hay lecturas registradas para esta MAC' });
    }

    res.status(200).json(lectura.lecturas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener lecturas', error });
  }
});

module.exports = router;
