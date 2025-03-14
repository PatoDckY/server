const express = require('express');
const Peces = require('../model/Peces'); // Asegúrate de que la ruta al modelo sea correcta
const router = express.Router();

// Ruta para obtener todos los peces
router.get("/", async (req, res) => {
  try {
    const pez = await Peces.find(); // Obtiene todos los peces de la colección
    res.json(pez); // Retorna la lista de todos los peces
  } catch (error) {
    res.status(500).json({ message: error.message }); // Si ocurre un error, muestra el mensaje
  }
});

module.exports = router;
