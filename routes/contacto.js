const express = require("express");
const router = express.Router();
const Contacto = require("../model/Contacto");

// Obtener la información de contacto
router.get("/", async (req, res) => {
  try {
    const contacto = await Contacto.findOne();
    if (!contacto) {
      return res.status(404).json({ message: "Información de contacto no encontrada" });
    }
    res.json(contacto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la información de contacto" });
  }
});

// Actualizar la información de contacto
router.put("/:id", async (req, res) => {
  try {
    const contactoActualizado = await Contacto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contactoActualizado) {
      return res.status(404).json({ message: "Información de contacto no encontrada" });
    }
    res.json(contactoActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la información de contacto" });
  }
});

// Eliminar la información de contacto
router.delete("/:id", async (req, res) => {
  try {
    const contactoEliminado = await Contacto.findByIdAndDelete(req.params.id);
    if (!contactoEliminado) {
      return res.status(404).json({ message: "Información de contacto no encontrada" });
    }
    res.json({ message: "Información de contacto eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la información de contacto" });
  }
});

module.exports = router;
