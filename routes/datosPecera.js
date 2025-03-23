const express = require('express');
const DatosPecera = require('../model/DatosPecera'); // Importar el modelo
const router = express.Router();

// Ruta para guardar los datos
router.post('/', async (req, res) => {
  const { macAddress, temperatura, nivelAgua, distancia, bombaEncendida } = req.body;

  try {
    // Crear un nuevo documento con los datos recibidos
    const nuevoDato = new DatosPecera({
      macAddress,
      temperatura,
      nivelAgua,
      distancia,
      bombaEncendida,
    });

    // Guardar el documento en la base de datos
    await nuevoDato.save();
    res.status(201).json({ message: 'Datos guardados correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar los datos', error });
  }
});

// Ruta para obtener todos los datos
router.get('/', async (req, res) => {
  try {
    const datos = await DatosPecera.find().sort({ fecha: -1 }); // Ordenar por fecha descendente
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los datos', error });
  }
});

module.exports = router;