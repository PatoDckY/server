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

// Agregar una nueva categoría de soporte con preguntas, o agregar la pregunta a una categoría existente
router.post("/", async (req, res) => {
  try {
    // Verificar si la categoría ya existe
    const categoriaExistente = await Soporte.findOne({ categoria: req.body.categoria });
    
    if (categoriaExistente) {
      // Si la categoría ya existe, solo agregar la nueva pregunta
      const nuevaPregunta = {
        pregunta: req.body.preguntas[0].pregunta,
        respuesta: "",
      };
      
      categoriaExistente.preguntas.push(nuevaPregunta);
      await categoriaExistente.save();
      return res.status(201).json(categoriaExistente); // Retornar la categoría actualizada
    }

    // Si la categoría no existe, crear una nueva categoría con la pregunta
    const nuevoSoporte = new Soporte({
      categoria: req.body.categoria,
      preguntas: req.body.preguntas, // Se pasa directamente el array de preguntas
    });

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
