const express = require('express');
const mongoose = require('mongoose');
const Guia = require('../model/Guia'); // Asegúrate de que la ruta sea correcta según la ubicación del modelo

const router = express.Router();

// Ruta para obtener la guía de usuario
router.get('/', async (req, res) => {
  try {
    const guia = await Guia.findOne(); // Asume que solo hay un documento en la colección "Guia"
    if (!guia) {
      return res.status(404).json({ message: 'Guía no encontrada' });
    }
    res.json(guia); // Devuelve los datos de la guía
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la guía de usuario' });
  }
});

module.exports = router;
