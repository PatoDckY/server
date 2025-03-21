const express = require("express");
const Nosotros = require("../model/Nosotros"); // Importar el modelo de Nosotros
const router = express.Router();

// Ruta para obtener toda la información de "Nosotros"
router.get("/", async (req, res) => {
  try {
    const nosotros = await Nosotros.findOne(); // Obtener el primer documento de la colección
    res.json(nosotros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rutas para obtener cada campo por separado
router.get("/mision", async (req, res) => {
  try {
    const nosotros = await Nosotros.findOne();
    res.json({ mision: nosotros.mision });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/vision", async (req, res) => {
  try {
    const nosotros = await Nosotros.findOne();
    res.json({ vision: nosotros.vision });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/valores", async (req, res) => {
  try {
    const nosotros = await Nosotros.findOne();
    res.json({ valores: nosotros.valores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rutas para actualizar cada campo por separado
router.put("/mision", async (req, res) => {
  try {
    const nosotros = await Nosotros.findOneAndUpdate({}, { mision: req.body.mision }, { new: true });
    res.json(nosotros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/vision", async (req, res) => {
  try {
    const nosotros = await Nosotros.findOneAndUpdate({}, { vision: req.body.vision }, { new: true });
    res.json(nosotros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/valores", async (req, res) => {
  try {
    const nosotros = await Nosotros.findOneAndUpdate({}, { valores: req.body.valores }, { new: true });
    res.json(nosotros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
