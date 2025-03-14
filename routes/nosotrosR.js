const express = require("express");
const Nosotros = require("../model/Nosotros"); // Importar el modelo de Nosotros
const router = express.Router();

// Ruta para obtener los datos de "Nosotros"
router.get("/", async (req, res) => {
  try {
    const nosotros = await Nosotros.findOne(); // Obtener el primer documento de la colección
    res.json(nosotros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;