const express = require("express");
const router = express.Router();
const PreguntaRecuperacion = require("../model/preguntas_recuperacion"); // Importar el modelo

// Obtener todas las preguntas
router.get("/", async (req, res) => {
  try {
    const preguntas = await PreguntaRecuperacion.find(); // Buscar todas las preguntas
    res.status(200).json(preguntas); // Devolver las preguntas en formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Manejar errores
  }
});

// Agregar una nueva pregunta
router.post("/", async (req, res) => {
  try {
    const { _id, pregunta } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!_id || !pregunta) {
      return res.status(400).json({ error: "El _id y la pregunta son obligatorios." });
    }

    // Crear una nueva pregunta
    const nuevaPregunta = new PreguntaRecuperacion({
      _id,
      pregunta,
    });

    // Guardar la pregunta en la base de datos
    await nuevaPregunta.save();
    res.status(201).json({ mensaje: "Pregunta agregada correctamente", nuevaPregunta });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Manejar errores
  }
});

// Obtener una pregunta por su ID
router.get("/:id", async (req, res) => {
  try {
    const pregunta = await PreguntaRecuperacion.findById(req.params._id);

    if (!pregunta) {
      return res.status(404).json({ message: "Pregunta de recuperación no encontrada" });
    }

    res.status(200).json(pregunta); // Devolver la pregunta encontrada en formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Manejar errores
  }
});


module.exports = router;