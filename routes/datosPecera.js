const express = require('express');
const DatosPecera = require('../model/DatosPecera'); // Importar el modelo
const router = express.Router();

// Ruta para guardar o actualizar los datos
router.post('/', async (req, res) => {
  const { macAddress, temperatura, nivelAgua, distancia, bombaEncendida } = req.body;

  try {
    // Buscar si ya existe un documento con la misma MAC Address
    const datoExistente = await DatosPecera.findOne({ macAddress });

    if (datoExistente) {
      // Si existe, actualizar los datos
      await DatosPecera.updateOne(
        { macAddress },
        { $set: { temperatura, nivelAgua, distancia, bombaEncendida, fecha: new Date() } }
      );
      res.status(200).json({ message: 'Datos actualizados correctamente' });
    } else {
      // Si no existe, crear un nuevo documento
      const nuevoDato = new DatosPecera({
        macAddress,
        temperatura,
        nivelAgua,
        distancia,
        bombaEncendida,
      });

      await nuevoDato.save();
      res.status(201).json({ message: 'Datos guardados correctamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar los datos', error });
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
