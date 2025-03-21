const express = require("express");
const router = express.Router();
const Soporte = require("../model/Soporte");

// Obtener todas las categorías de soporte
router.get("/", async (req, res) => {
  try {
    const soporte = await Soporte.find();
    res.json(soporte);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos de soporte" });
  }
});

// Agregar una nueva categoría de soporte con preguntas
router.post("/", async (req, res) => {
  try {
    const nuevoSoporte = new Soporte(req.body);
    await nuevoSoporte.save();
    res.status(201).json(nuevoSoporte);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar la información de soporte" });
  }
});

// Actualizar una categoría de soporte por ID
router.put("/:id", async (req, res) => {
  try {
    const soporteActualizado = await Soporte.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!soporteActualizado) {
      return res.status(404).json({ message: "Soporte no encontrado" });
    }
    res.json(soporteActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el soporte" });
  }
});

// Eliminar una categoría de soporte por ID
router.delete("/:id", async (req, res) => {
  try {
    const soporteEliminado = await Soporte.findByIdAndDelete(req.params.id);
    if (!soporteEliminado) {
      return res.status(404).json({ message: "Soporte no encontrado" });
    }
    res.json({ message: "Soporte eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el soporte" });
  }
});

// Agregar una nueva pregunta a una categoría de soporte existente
router.post("/:id/pregunta", async (req, res) => {
  try {
    const soporte = await Soporte.findById(req.params.id);
    if (!soporte) {
      return res.status(404).json({ message: "Categoría de soporte no encontrada" });
    }

    // Crear una nueva pregunta con los datos enviados en el cuerpo de la solicitud
    const nuevaPregunta = {
      pregunta: req.body.pregunta,
      respuesta: req.body.respuesta,
    };

    // Agregar la nueva pregunta al array de preguntas de la categoría
    soporte.preguntas.push(nuevaPregunta);
    await soporte.save();

    res.status(201).json(soporte);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar la pregunta" });
  }
});


module.exports = router;
