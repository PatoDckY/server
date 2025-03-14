const express = require('express');
const Producto = require('../model/Producto');  // Asegúrate de importar el modelo Producto
const Pez = require('../model/Peces');  // Asegúrate de importar el modelo Pez

const router = express.Router();

// Ruta para buscar productos y peces
router.get('/', async (req, res) => {
  const { query } = req.query; // Obtener el término de búsqueda desde la query

  if (!query) {
    return res.status(400).json({ message: "Por favor ingresa un término de búsqueda." });
  }

  try {
    // Búsqueda en la colección de Productos
    const productos = await Producto.find({
      $or: [
        { nombre: { $regex: query, $options: 'i' } },  // Buscar por nombre con insensibilidad a mayúsculas/minúsculas
      ]
    });

    // Búsqueda en la colección de Peces
    const peces = await Pez.find({
      $or: [
        { nombre: { $regex: query, $options: 'i' } },  // Buscar por nombre con insensibilidad a mayúsculas/minúsculas
      ]
    });

    // Devolver los resultados encontrados en ambas colecciones
    res.json({
      productos,
      peces
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
